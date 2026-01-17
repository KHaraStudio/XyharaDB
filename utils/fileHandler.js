import fs from 'fs';

export function bacaFile(path) {
    if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');
    return JSON.parse(fs.readFileSync(path));
}

export function tulisFile(path, data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
