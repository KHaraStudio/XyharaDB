import XyharaDB from '../home/XyharaDB.js';

const db = new XyharaDB();

console.log(db.query("TAMBAH KE pengguna (id, nama, umur) NILAI (1, 'KHara', 16)"));
console.log(db.query("TAMBAH KE pengguna (id, nama, umur) NILAI (2, 'Xyhara', 20)"));
console.log(db.query("LIHAT SEMUA DARI pengguna"));
