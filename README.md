<h1 align="center">XyharaDB</h1>

<p align="center">
  <img src="https://files.catbox.moe/xlgoo8.jpg" alt="XyharaDB Banner" width="600">
</p>

<p align="center">
  <b>File-based database untuk Node.js dengan bahasa query kustom (XQL)</b><br>
  Terinspirasi SQLite, dibuat sederhana untuk pembelajaran & eksperimen.
</p>

<hr>

<h2>Fitur</h2>
<ul>
  <li>Database berbasis file (<code>.xydb</code>)</li>
  <li>Bahasa query sendiri: <b>XQL (Xyhara Query Language)</b></li>
  <li>Ringan & tanpa dependency eksternal</li>
  <li>Mode library & console interaktif</li>
  <li>Cocok untuk proyek kecil & pembelajaran</li>
</ul>

<h2>Instalasi</h2>
<pre><code>npm install xyharadb</code></pre>

atau clone repo:
<pre><code>git clone https://github.com/KHaraStudio/XyharaDB.git</code></pre>

<h2>Penggunaan</h2>

<h3>Mode Library</h3>
<pre><code>import XyharaDB from 'xyharadb';

const db = new XyharaDB();

db.query("TAMBAH KE pengguna (id,nama,umur) NILAI (1,'KHara',16)");
console.log(db.query("LIHAT SEMUA pengguna"));
</code></pre>

<h3>Mode Console</h3>
<pre><code>import XyharaDB from 'xyharadb';

new XyharaDB({
  open_console: true
});
</code></pre>

<h3>Contoh di Terminal</h3>
<pre><code>XyharaDB> TAMBAH KE pengguna (id,nama,umur) NILAI (1,'KHara',16)
XyharaDB> LIHAT SEMUA pengguna
XyharaDB> UBAH pengguna SET nama='KHara Studio' DIMANA id = 1
XyharaDB> keluar
</code></pre>

<h2>XQL (Xyhara Query Language)</h2>

<h4>Tambah Data</h4>
<pre><code>TAMBAH KE pengguna (id,nama,umur) NILAI (1,'KHara',16)</code></pre>

<h4>Lihat Semua Data</h4>
<pre><code>LIHAT SEMUA pengguna</code></pre>

<h4>Ubah Data</h4>
<pre><code>UBAH pengguna SET nama='KHara Studio' DIMANA id = 1</code></pre>

<h4>Hapus Data</h4>
<pre><code>HAPUS DARI pengguna DIMANA id = 1</code></pre>

<h2>Filosofi</h2>
<p>
XyharaDB dibuat untuk membuktikan bahwa bahasa query dan database sederhana
bisa dibuat sendiri tanpa sistem kompleks.
Cocok untuk belajar cara kerja database & parser.
</p>

<h2>Lisensi</h2>
<p>
Oakai License © 2026 KHara Studio
</p>

<hr>

<p align="center">
  Dibuat dengan oleh <b>KHara Studio</b>
</p>
