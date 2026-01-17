export function validasiKolom(obj, kolom) {
    for (let k of kolom) {
        if (!(k in obj)) throw new Error(`Kolom ${k} tidak ditemukan`);
    }
}
