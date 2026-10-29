const fs = require('node:fs');
const path = require('node:path');

const source = path.resolve(__dirname, '..', 'face4.html');
const output = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..', 'dist');

fs.mkdirSync(output, { recursive: true });
for (const name of ['index.html', 'face4.html']) {
    fs.copyFileSync(source, path.join(output, name));
}
console.log('Static site: ' + output);
