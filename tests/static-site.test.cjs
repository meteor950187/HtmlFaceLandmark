const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
function tempDirectory(t) {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'face-demo-'));
    t.after(() => {
        assert.equal(path.dirname(path.resolve(directory)), path.resolve(os.tmpdir()));
        assert.ok(path.basename(directory).startsWith('face-demo-'));
        fs.rmSync(directory, { recursive: true, force: true });
    });
    return directory;
}

test('static build publishes the demo at root without repository files', t => {
    const output = tempDirectory(t);
    const result = spawnSync(process.execPath, [path.join(root, 'scripts/build-static.cjs'), output], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(fs.readdirSync(output).sort(), ['face4.html', 'index.html']);
    const source = fs.readFileSync(path.join(root, 'face4.html'), 'utf8');
    assert.equal(fs.readFileSync(path.join(output, 'index.html'), 'utf8'), source);
    assert.equal(fs.readFileSync(path.join(output, 'face4.html'), 'utf8'), source);
});

test('CI syntax command accepts the page module', () => {
    const result = spawnSync(process.execPath, [path.join(root, 'scripts/check-page.cjs')], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
});

test('CI syntax command rejects invalid JavaScript in an HTML module', t => {
    const directory = tempDirectory(t);
    const invalidPage = path.join(directory, 'invalid.html');
    fs.writeFileSync(invalidPage, '<script type="module">const broken = ;</script>');
    const result = spawnSync(process.execPath, [path.join(root, 'scripts/check-page.cjs'), invalidPage], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /SyntaxError/);
});
