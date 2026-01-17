import fs from 'fs';
import path from 'path';
import readline from 'readline';

export default class XyharaDB {
    constructor({
        dbPath = path.join(process.cwd(), 'XyharaDB.xydb'),
        open_console = false
    } = {}) {
        this.dbPath = dbPath;
        this.open_console = open_console;

        if (!fs.existsSync(this.dbPath)) {
            fs.writeFileSync(this.dbPath, JSON.stringify({}));
        }
        this.db = JSON.parse(fs.readFileSync(this.dbPath));

        if (this.open_console) this.startConsole();
    }

    simpan() {
        fs.writeFileSync(this.dbPath, JSON.stringify(this.db, null, 2));
    }

    buatTabel(tabel) {
        if (!this.db[tabel]) this.db[tabel] = {};
    }

    query(q) {
        q = q.trim();

        // TAMBAH KE
        if (q.startsWith('TAMBAH KE')) {
            const m = q.match(/TAMBAH KE (\w+) \((.+)\) NILAI \((.+)\)/i);
            if (!m) throw new Error('Query TAMBAH KE salah format');

            const tabel = m[1];
            const kolom = m[2].split(',').map(v => v.trim());
            const nilai = m[3].split(',').map(v => v.trim().replace(/^'|'$/g, ''));

            this.buatTabel(tabel);

            const idIndex = kolom.indexOf('id');
            const id = idIndex !== -1 ? nilai[idIndex] : Object.keys(this.db[tabel]).length + 1;

            let data = {};
            kolom.forEach((k, i) => {
                if (k !== 'id') data[k] = isNaN(nilai[i]) ? nilai[i] : Number(nilai[i]);
            });

            this.db[tabel][id] = data;
            this.simpan();

            return `✔ TAMBAH ke ${tabel} (id=${id})`;
        }

        // LIHAT SEMUA / DARI
        if (q.startsWith('LIHAT SEMUA')) {
            const m = q.match(/LIHAT SEMUA(?: DARI)? (\w+)/i);
            if (!m) throw new Error('Query LIHAT SEMUA salah format');

            const tabel = m[1];
            this.buatTabel(tabel);

            return {
                dari: tabel,
                data: this.db[tabel]
            };
        }

        // UBAH
        if (q.startsWith('UBAH')) {
            const m = q.match(/UBAH (\w+) SET (.+) DIMANA id = (\d+)/i);
            if (!m) throw new Error('Query UBAH salah format');

            const tabel = m[1];
            const id = m[3];
            this.buatTabel(tabel);

            if (!this.db[tabel][id]) throw new Error('ID tidak ditemukan');

            m[2].split(',').forEach(p => {
                let [k, v] = p.split('=');
                k = k.trim();
                v = v.trim().replace(/^'|'$/g, '');
                this.db[tabel][id][k] = isNaN(v) ? v : Number(v);
            });

            this.simpan();
            return `✔ UBAH id=${id} di ${tabel}`;
        }

        // HAPUS
        if (q.startsWith('HAPUS DARI')) {
            const m = q.match(/HAPUS DARI (\w+) DIMANA id = (\d+)/i);
            if (!m) throw new Error('Query HAPUS salah format');

            delete this.db[m[1]][m[2]];
            this.simpan();
            return `✔ HAPUS id=${m[2]} dari ${m[1]}`;
        }

        throw new Error('Query tidak dikenali');
    }

    // ================= CONSOLE MODE =================
    startConsole() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '\x1b[36mXyharaDB>\x1b[0m '
        });

        console.log('\x1b[32mSelamat datang di XyharaDB Console\x1b[0m');
        console.log("Ketik 'keluar' untuk keluar\n");

        rl.prompt();
        rl.on('line', line => {
            if (line === 'keluar') {
                rl.close();
                return;
            }
            try {
                const res = this.query(line);
                console.log('\x1b[33m', res, '\x1b[0m');
            } catch (e) {
                console.log('\x1b[31mError:', e.message, '\x1b[0m');
            }
            rl.prompt();
        });
    }
}
