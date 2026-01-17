import XyharaDB from '../home/XyharaDB.js';

const db = new XyharaDB();

console.log(db.query("HAPUS DARI pengguna DIMANA id = 1"));
console.log(db.query("LIHAT SEMUA DARI pengguna"));
