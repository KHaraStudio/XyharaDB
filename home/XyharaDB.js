import fs from "fs";
import path from "path";
import readline from "readline";
import { DBError, Errors } from "../utils/dbError.js";
import AuditLogger from "../utils/auditLogger.js";

export default class XyharaDB {
    constructor({
        dbPath = path.join(process.cwd(), "XyharaDB.xydb"),
        open_console = false,
        auto_clean_interval = 5000 // 5 detik
    } = {}) {
        this.dbPath = dbPath;
        this.open_console = open_console;
        this.auto_clean_interval = auto_clean_interval;

        // Init database file
        if (!fs.existsSync(this.dbPath))
            fs.writeFileSync(this.dbPath, JSON.stringify({}));
        this.db = JSON.parse(fs.readFileSync(this.dbPath));

        // Init audit logger
        this.logger = new AuditLogger(this.dbPath);

        // Cache cleaner
        this.cleanExpired();
        this.cleaner = setInterval(
            () => this.cleanExpired(),
            this.auto_clean_interval
        );

        if (this.open_console) this.startConsole();
    }

    // =================== UTILITY ===================
    simpan() {
        fs.writeFileSync(this.dbPath, JSON.stringify(this.db, null, 2));
    }

    buatTabel(tabel) {
        if (!this.db[tabel]) this.db[tabel] = {};
    }

    cleanExpired() {
        const now = Date.now();
        let cleaned = 0;

        for (const tabel in this.db) {
            for (const id in this.db[tabel]) {
                const row = this.db[tabel][id];
                if (row?.__expire && now > row.__expire) {
                    delete this.db[tabel][id];
                    cleaned++;
                }
            }
        }

        if (cleaned) {
            this.simpan();
            this.logger.write("AUTOCLEAN", { removed: cleaned });
            if (this.open_console)
                console.log(
                    `\x1b[90m🧹 AutoClean: ${cleaned} cache expired dihapus\x1b[0m`
                );
        }
    }

    // =================== QUERY ENGINE ===================
    query(q) {
        q = q.trim();
        this.cleanExpired();
        if (q.match(/^LIHAT TABEL$/i)) return this.queryListTable();
        if (q.match(/^TAMBAH KE/i)) return this.queryInsert(q);
        if (q.match(/^LIHAT SEMUA/i)) return this.querySelect(q);
        if (q.match(/^UBAH/i)) return this.queryUpdate(q);
        if (q.match(/^HAPUS DARI/i)) return this.queryDelete(q);
        if (q.match(/^BACKUP KE /i)) return this.queryBackup(q);
        if (q.match(/^RESTORE DARI /i)) return this.queryRestore(q);

        throw Errors.UNKNOWN_QUERY();
    }

    // ------------------- INSERT -------------------
    queryInsert(q) {
        const m = q.match(
            /TAMBAH KE (\w+) \((.+)\) NILAI \((.+)\)(?: EXPIRE (\d+))?/i
        );
        if (!m) throw Errors.SYNTAX(q);

        const tabel = m[1];
        const kolom = m[2].split(",").map(v => v.trim());
        const nilai = m[3].split(",").map(v => v.trim().replace(/^'|'$/g, ""));
        const expireSec = m[4] ? Number(m[4]) : null;

        this.buatTabel(tabel);

        const idIndex = kolom.indexOf("id");
        const id =
            idIndex !== -1
                ? nilai[idIndex]
                : Object.keys(this.db[tabel]).length + 1;

        const data = {};
        kolom.forEach((k, i) => {
            if (k !== "id")
                data[k] = isNaN(nilai[i]) ? nilai[i] : Number(nilai[i]);
        });

        if (expireSec) data.__expire = Date.now() + expireSec * 1000;

        this.db[tabel][id] = data;
        this.simpan();

        // Audit log
        this.logger.write("INSERT", { table: tabel, id, data });

        return `✔ TAMBAH ke ${tabel} (id=${id})${
            expireSec ? ` ⏳expire ${expireSec}s` : ""
        }`;
    }

    // ------------------- SELECT -------------------
    querySelect(q) {
        const m = q.match(/LIHAT SEMUA(?: DARI)? (\w+)/i);
        if (!m) throw Errors.SYNTAX(q);

        const tabel = m[1];
        this.buatTabel(tabel);

        return {
            dari: tabel,
            total: Object.keys(this.db[tabel]).length,
            data: this.db[tabel]
        };
    }

    // ------------------- UPDATE -------------------
    queryUpdate(q) {
        const m = q.match(/UBAH (\w+)\s+SET\s+(.+)\s+DIMANA\s+id\s*=\s*(\d+)/i);
        if (!m) throw Errors.SYNTAX(q);

        const tabel = m[1];
        const id = m[3];
        this.buatTabel(tabel);

        if (!this.db[tabel][id]) throw Errors.ID_NOT_FOUND(id);

        m[2].split(",").forEach(p => {
            let [k, v] = p.split("=");
            k = k.trim();
            v = v.trim().replace(/^'|'$/g, "");
            this.db[tabel][id][k] = isNaN(v) ? v : Number(v);
        });

        this.simpan();

        // Audit log
        this.logger.write("UPDATE", { table: tabel, id, set: m[2] });

        return `✔ UBAH id=${id} di ${tabel}`;
    }

    // ------------------- DELETE -------------------
    queryDelete(q) {
        const m = q.match(/HAPUS DARI (\w+) DIMANA id = (\d+)/i);
        if (!m) throw Errors.SYNTAX(q);

        const [_, tabel, id] = m;
        if (!this.db[tabel]) throw Errors.TABLE_NOT_FOUND(tabel);

        delete this.db[tabel][id];
        this.simpan();

        // Audit log
        this.logger.write("DELETE", { table: tabel, id });

        return `✔ HAPUS id=${id} dari ${tabel}`;
    }

    // ------------------- LIST TABLE -------------------
    queryListTable() {
        return Object.keys(this.db);
    }

    // ------------------- BACKUP / RESTORE -------------------
    queryBackup(q) {
        const m = q.match(/^BACKUP KE (.+)$/i);
        if (!m) throw Errors.SYNTAX(q);

        const target = m[1].trim();
        fs.writeFileSync(target, JSON.stringify(this.db, null, 2));

        // Audit log
        this.logger.write("BACKUP", { target });

        return `✔ Backup tersimpan ke ${target}`;
    }

    queryRestore(q) {
        const m = q.match(/^RESTORE DARI (.+)$/i);
        if (!m) throw Errors.SYNTAX(q);

        const source = m[1].trim();
        if (!fs.existsSync(source)) throw Errors.FILE_NOT_FOUND(source);

        this.db = JSON.parse(fs.readFileSync(source));
        this.simpan();

        // Audit log
        this.logger.write("RESTORE", { source });

        return `✔ Database dipulihkan dari ${source}`;
    }

    // =================== CONSOLE MODE ===================
    startConsole() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "\x1b[36mXyharaDB>\x1b[0m "
        });

        console.log("\x1b[32mSelamat datang di XyharaDB Console\x1b[0m");
        console.log("Ketik 'keluar' untuk keluar\n");

        rl.prompt();
        rl.on("line", line => {
            if (line.toLowerCase() === "keluar") {
                clearInterval(this.cleaner);
                rl.close();
                process.exit(0);
            }

            try {
                const res = this.query(line);
                console.log("\x1b[33m", res, "\x1b[0m");
            } catch (e) {
                console.log(
                    "\x1b[31m" +
                        (e.toString ? e.toString() : e.message) +
                        "\x1b[0m"
                );
            }
            rl.prompt();
        });
    }
}