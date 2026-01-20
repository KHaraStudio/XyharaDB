import fs from "fs";

export default class AuditLogger {
    constructor(dbPath) {
        this.logPath = dbPath.replace(/\.xydb$/, ".log");

        if (!fs.existsSync(this.logPath)) fs.writeFileSync(this.logPath, "");
    }

    write(action, payload = {}) {
        const entry = {
            time: new Date().toISOString(),
            action,
            ...payload
        };
        fs.appendFileSync(this.logPath, JSON.stringify(entry) + "\n");
    }
}