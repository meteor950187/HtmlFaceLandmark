const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'face4.html'), 'utf8');
const source = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];

// Only browser/media dependencies are substituted; all workflow functions come from the page.
function loadPage({ safari = false, supported = true, cameraError = false, mp4 = true } = {}) {
    const nodes = new Map();
    const urls = new Map();
    const timers = [];
    const recorders = [];
    const camera = { error: cameraError ? Object.assign(new Error('Camera failure'), { name: typeof cameraError === 'string' ? cameraError : 'NotAllowedError' }) : null, pending: null };
    const permission = { state: 'prompt', events: new Map(), addEventListener(name, fn) { this.events.set(name, fn); } };
    let cameraRequests = 0;
    let trackStops = 0;
    function node(key) {
        if (!nodes.has(key)) {
            const classes = new Set(key === '.steps-progress' ? [] : ['is-hide']);
            const events = new Map();
            nodes.set(key, {
                classList: { add: x => classes.add(x), remove: x => classes.delete(x), contains: x => classes.has(x) },
                style: {}, children: [], innerText: '', textContent: '', disabled: false,
                events, addEventListener(name, fn) {
                    events.set(name, fn);
                    if (name === 'loadedmetadata') queueMicrotask(fn);
                },
                removeEventListener() {}, focus() {}, pause() {}, load() {},
                play: async () => {}, readyState: 4, videoWidth: 640, videoHeight: 480,
                setAttribute(name, value) { this[name] = value; },
                getAttribute(name) { return this[name] || null; },
                removeAttribute(name) { delete this[name]; },
                getContext: () => ({}),
                querySelector: child => node(key + ' ' + child)
            });
        }
        return nodes.get(key);
    }
    node('.steps').children = ['.steps-progress', '.steps-loadingBar', '.steps-process-success', '.step1', '.step2', '.step3', '.step4'].map(node);
    const stream = { getTracks: () => [{ stop: () => trackStops++ }] };
    class Recorder {
        static isTypeSupported(type) { return supported && (type === 'video/webm' || (mp4 && type === 'video/mp4')); }
        constructor(stream, options) {
            this.mimeType = options.mimeType;
            this.state = 'inactive';
            this.events = new Map();
            this.stopCalls = 0;
            recorders.push(this);
        }
        start() { this.state = 'recording'; }
        addEventListener(name, fn) { this.events.set(name, fn); }
        removeEventListener(name) { this.events.delete(name); }
        emit(name, event = {}) {
            this['on' + name]?.(event);
            this.events.get(name)?.(event);
        }
        stop() {
            if (this.state === 'inactive') throw new Error('Recorder already stopped');
            this.stopCalls++;
            this.state = 'inactive';
            setImmediate(() => {
                this.emit('dataavailable', { data: new Blob(['final-frame'], { type: this.mimeType }) });
                this.emit('stop');
            });
        }
    }
    const sandbox = {
        navigator: {
            userAgent: safari ? 'Version/17.0 Mobile Safari/605.1.15' : 'Chrome/130.0',
            mediaDevices: { getUserMedia: async () => {
                cameraRequests++;
                if (camera.error) throw camera.error;
                if (camera.pending) await camera.pending;
                return stream;
            } },
            permissions: { query: async () => permission }
        },
        document: { querySelector: node, getElementById: node, querySelectorAll: () => [], body: { style: {} } },
        window: { innerHeight: 800, addEventListener() {}, isSecureContext: true },
        isSecureContext: true, MediaRecorder: Recorder, Blob,
        URL: { createObjectURL: blob => { const url = 'blob:test-' + urls.size; urls.set(url, blob); return url; }, revokeObjectURL() {} },
        FilesetResolver: { forVisionTasks: async () => ({}) },
        FaceLandmarker: { createFromOptions: async () => ({ detectForVideo: () => ({}), close() {} }) },
        requestAnimationFrame: () => 1, cancelAnimationFrame() {}, performance, Date, console,
        setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; }, clearTimeout() {}
    };
    vm.createContext(sandbox);
    vm.runInContext(source.replace(/^\s*import .*;$/mg, '') + `
        globalThis.hooks = { initFaceLandmarker, recorderStop, setSuccessToTop, setNextStep, setDetectProcess,
            getStep: () => step, getUrl: () => currentRecorderUrl };
    `, sandbox);
    return { ...sandbox, node, urls, timers, recorders, camera, permission, get cameraRequests() { return cameraRequests; }, get trackStops() { return trackStops; } };
}

for (const safari of [false, true]) {
    test(`collects final recording chunk and reuses URL (${safari ? 'MP4' : 'WebM'})`, async () => {
        const page = loadPage({ safari });
        await page.hooks.initFaceLandmarker();
        const url = await page.hooks.recorderStop();
        assert.equal(await page.urls.get(url).text(), 'final-frame');
        assert.equal(page.urls.get(url).type, safari ? 'video/mp4' : 'video/webm');
        assert.equal(await page.hooks.recorderStop(), url);
        assert.equal(page.recorders[0].stopCalls, 1);
    });
}

test('completion prepares download, stops camera and can be reopened', async () => {
    const page = loadPage({ safari: true });
    await page.hooks.initFaceLandmarker();
    await page.hooks.setSuccessToTop();
    const download = page.node('recordingDownload');
    assert.match(download.href || '', /^blob:/);
    assert.match(download.download || '', /\.mp4$/);
    assert.equal(page.node('recordingPreview').src, download.href);
    assert.equal(page.node('playbackModal').classList.contains('is-hide'), false);
    assert.equal(page.trackStops, 1);
    await page.hooks.setSuccessToTop();
    assert.equal(page.recorders[0].stopCalls, 1);
});

test('Safari falls back to WebM when MP4 is unavailable', async () => {
    const page = loadPage({ safari: true, mp4: false });
    await page.hooks.initFaceLandmarker();
    await page.hooks.setSuccessToTop();
    assert.match(page.node('recordingDownload').download, /\.webm$/);
});

test('the final step automatically opens the success popup and prepares the recording', async () => {
    const page = loadPage();
    await page.hooks.initFaceLandmarker();
    page.hooks.setNextStep();
    for (let step = 1; step <= 4; step++) {
        page.hooks.setDetectProcess(true);
        page.timers.shift().fn();
        page.timers.shift().fn();
    }
    await new Promise(setImmediate);
    assert.equal(page.node('playbackModal').classList.contains('is-hide'), false);
    assert.equal(page.node('playbackModalLoading').classList.contains('is-hide'), true);
    assert.match(page.node('recordingDownload').href, /^blob:/);
    assert.equal(page.trackStops, 1);
});

test('recording errors release the camera and show a completion error', async () => {
    const page = loadPage();
    await page.hooks.initFaceLandmarker();
    page.recorders[0].stop = function () { this.emit('error', { error: new Error('錄影中斷') }); };
    await page.hooks.setSuccessToTop();
    assert.equal(page.node('playbackModalError').classList.contains('is-hide'), false);
    assert.match(page.node('playbackModalErrorText').innerText, /錄影中斷/);
    assert.equal(page.trackStops, 1);
});

test('recording errors before completion cannot produce a successful partial download', async () => {
    const page = loadPage();
    await page.hooks.initFaceLandmarker();
    const recorder = page.recorders[0];
    recorder.emit('dataavailable', { data: new Blob(['partial-recording']) });
    recorder.state = 'inactive';
    recorder.emit('error', { error: new Error('錄影資源不足') });
    recorder.emit('stop');
    await page.hooks.setSuccessToTop();
    assert.equal(page.node('playbackModalError').classList.contains('is-hide'), false);
    assert.match(page.node('playbackModalErrorText').innerText, /錄影資源不足/);
    assert.equal(page.node('recordingDownload').href, undefined);
    assert.equal(page.trackStops, 1);
});

test('loading the page does not request camera permission', async () => {
    const page = loadPage();
    await page.window.onload();
    assert.equal(page.cameraRequests, 0);
    assert.equal(typeof page.node('startDemo').events.get('click'), 'function');
});

test('camera denial leaves the start button usable with a visible message', async () => {
    const page = loadPage({ cameraError: true });
    await page.window.onload();
    const start = page.node('startDemo');
    assert.equal(typeof start.events.get('click'), 'function');
    await start.events.get('click')();
    assert.equal(start.disabled, false);
    assert.match(page.node('startStatus').textContent, /攝影機|相機/);
    assert.equal(page.recorders.length, 0);
});

test('an unanswered permission prompt stays pending until the user allows camera access', async () => {
    const page = loadPage();
    await page.window.onload();
    let allow;
    page.camera.pending = new Promise(resolve => { allow = resolve; });
    const start = page.node('startDemo');
    const attempt = start.events.get('click')();
    assert.equal(page.cameraRequests, 1);
    assert.equal(start.disabled, true);
    assert.match(page.node('startStatus').textContent, /允許.*攝影機|攝影機.*授權/);
    assert.equal(page.recorders.length, 0);
    allow();
    await attempt;
    assert.equal(page.hooks.getStep(), 1);
});

test('retry calls getUserMedia again after permission is changed', async () => {
    const page = loadPage({ cameraError: true });
    await page.window.onload();
    const click = page.node('startDemo').events.get('click');
    await click();
    page.camera.error = null;
    await click();
    assert.equal(page.cameraRequests, 2);
    assert.equal(page.hooks.getStep(), 1);
});

test('allowing a previously denied camera permission automatically retries the requested test', async () => {
    const page = loadPage({ cameraError: true });
    await page.window.onload();
    await page.node('startDemo').events.get('click')();
    page.camera.error = null;
    page.permission.state = 'granted';
    assert.equal(typeof page.permission.events.get('change'), 'function');
    await page.permission.events.get('change')();
    assert.equal(page.cameraRequests, 2);
    assert.equal(page.hooks.getStep(), 1);
});

test('permission changes do not activate camera before the user requests the test', async () => {
    const page = loadPage();
    await page.window.onload();
    await new Promise(setImmediate);
    page.permission.state = 'granted';
    await page.permission.events.get('change')();
    assert.equal(page.cameraRequests, 0);
});

test('unsupported camera permission queries still allow the camera request button to work', async () => {
    const page = loadPage();
    page.navigator.permissions.query = async () => { throw new TypeError('Unsupported camera descriptor'); };
    await page.window.onload();
    await page.node('startDemo').events.get('click')();
    assert.equal(page.cameraRequests, 1);
    assert.equal(page.hooks.getStep(), 1);
});

test('missing camera is explained separately from blocked permission', async () => {
    const page = loadPage({ cameraError: 'NotFoundError' });
    await page.window.onload();
    await page.node('startDemo').events.get('click')();
    assert.match(page.node('startStatus').textContent, /找不到.*攝影機/);
    assert.match(page.node('startStatus').textContent, /連接|裝置/);
    assert.equal(page.node('startDemo').disabled, false);
});

test('unsupported recording shows an error and releases the camera', async () => {
    const page = loadPage({ supported: false });
    await assert.rejects(page.hooks.initFaceLandmarker(), /錄影|側錄/);
    assert.equal(page.trackStops, 1);
});

test('single-frame trigger keeps the 2s timer and 2.5s transition', () => {
    const page = loadPage();
    page.hooks.setNextStep();
    page.hooks.setDetectProcess(true);
    page.hooks.setDetectProcess(false);
    assert.equal(page.timers[0].ms, 2000);
    page.timers.shift().fn();
    assert.equal(page.timers[0].ms, 2500);
    page.timers.shift().fn();
    assert.equal(page.hooks.getStep(), 2);
    assert.equal(page.node('.steps-progress').classList.contains('is-hide'), false);
});
