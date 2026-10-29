const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const file = process.argv[2] || path.resolve(__dirname, '..', 'face4.html');
const html = fs.readFileSync(file, 'utf8');
const modules = [...html.matchAll(/<script\b[^>]*type=["']module["'][^>]*>([\s\S]*?)<\/script>/gi)];
if (!modules.length) throw new Error('No module script found in ' + file);

for (const [, source] of modules) {
    const result = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: source, encoding: 'utf8' });
    if (result.error) throw result.error;
    if (result.status !== 0) {
        process.stderr.write(result.stderr);
        process.exit(result.status || 1);
    }
}
console.log('Page module syntax OK');
