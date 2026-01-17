import XyharaDB from '../home/XyharaDB.js';

const db = new XyharaDB();

console.log(db.query("UBAH pengguna SET nama = 'Xyhara Studio' DIMANA id = 2"));
console.log(db.query("LIHAT SEMUA DARI pengguna"));
