export class DBError extends Error {
    constructor(code, message) {
        super(message);
        this.code = `XY${code}`;
    }

    toString() {
        return `[${this.code}] ${this.message}`;
    }
}

export const Errors = {
    SYNTAX: (q) =>
        new DBError(1001, `Kesalahan sintaks di dekat '${q}'`),

    UNKNOWN_QUERY: () =>
        new DBError(1002, 'Query tidak dikenali'),

    TABLE_NOT_FOUND: (t) =>
        new DBError(2001, `Tabel '${t}' tidak ditemukan`),

    ID_NOT_FOUND: (id) =>
        new DBError(2002, `ID '${id}' tidak ditemukan`)
};