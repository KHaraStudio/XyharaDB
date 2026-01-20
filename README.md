<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>XyharaDB Documentation</title>
</head>
<body>

<img src="https://files.catbox.moe/xlgoo8.jpg" alt="XyharaDB Banner">

<h1>XyharaDB</h1>

<p>
XyharaDB is a lightweight file-based database framework built with Node.js.
It uses a single <code>.xydb</code> file to store data and does not require
any external database server or API.
</p>

<p>
This project is designed for CLI tools, small to medium projects,
offline systems, experiments, and learning how database engines work internally.
</p>

<hr>

<h2>Main Characteristics</h2>
<ul>
  <li>File-based database (.xydb)</li>
  <li>No server required</li>
  <li>No external API dependency</li>
  <li>Simple query language</li>
  <li>Console (interactive CLI) mode</li>
  <li>Auto-clean expired data</li>
  <li>Audit log system</li>
  <li>Backup and restore support</li>
  <li>Error system similar to real databases</li>
</ul>

<hr>

<h2>What Is New</h2>
<ul>
  <li>Audit logging to <code>XyharaDB.log</code></li>
  <li>Custom database error system</li>
  <li>Backup command</li>
  <li>Restore command</li>
  <li>Improved console exit handling</li>
  <li>More consistent error messages</li>
</ul>

<hr>

<h2>Project Structure</h2>

<pre>
XyharaDB/
├── README.md
├── console.js
├── XyharaDB.xydb
├── XyharaDB.log
├── home/
│   └── XyharaDB.js
├── utils/
│   ├── dbError.js
│   └── auditLogger.js
├── tests/
│   ├── testInsert.js
│   ├── testUpdate.js
│   └── testDelete.js
├── package.json
└── package-lock.json
</pre>

<hr>

<h2>Installation</h2>

<pre>
git clone https://github.com/KHaraStudio/XyharaDB.git
cd XyharaDB
npm install
</pre>

<hr>

<h2>Basic Usage</h2>

<h3>Import</h3>
<pre>
import XyharaDB from "./home/XyharaDB.js";
</pre>

<h3>Initialize Database</h3>
<pre>
const db = new XyharaDB({
  open_console: true
});
</pre>

<p>
If the file <code>XyharaDB.xydb</code> does not exist, it will be created automatically.
Existing data will never be deleted unless explicitly removed.
</p>

<hr>

<h2>Console Mode</h2>

<p>
When <code>open_console</code> is enabled, an interactive console will start.
</p>

<pre>
XyharaDB>
</pre>

<p>
To exit the console:
</p>

<pre>
keluar
</pre>

<hr>

<h2>Query Commands</h2>

<h3>Create / Insert Data</h3>
<pre>
TAMBAH KE users (id, name, age) NILAI (1, 'KHara', 17)
</pre>

<h3>Select Data</h3>
<pre>
LIHAT SEMUA DARI users
</pre>

<h3>Update Data</h3>
<pre>
UBAH users SET age=18 DIMANA id=1
</pre>

<h3>Delete Data</h3>
<pre>
HAPUS DARI users DIMANA id=1
</pre>

<h3>List Tables</h3>
<pre>
LIHAT TABEL
</pre>

<hr>

<h2>Cache With Expire</h2>

<pre>
TAMBAH KE cache (id, value) NILAI (1, 'hello') EXPIRE 5
</pre>

<p>
Data will be automatically removed after the expiration time.
</p>

<hr>

<h2>Backup and Restore</h2>

<h3>Backup Database</h3>
<pre>
BACKUP KE backup.xydb
</pre>

<h3>Restore Database</h3>
<pre>
RESTORE DARI backup.xydb
</pre>

<hr>

<h2>Audit Log System</h2>

<p>
All important operations are logged automatically to:
</p>

<pre>
XyharaDB.log
</pre>

<p>
Example log entry:
</p>

<pre>
{
  "time": "2026-01-19T08:59:22.995Z",
  "action": "INSERT",
  "table": "users",
  "id": "1",
  "data": { "name": "KHara", "age": 17 }
}
</pre>

<hr>

<h2>Error System</h2>

<p>
XyharaDB uses a structured error system similar to real databases.
</p>

<p>Example:</p>

<pre>
[XY1001] Kesalahan sintaks di dekat 'UBAH users SET age=18 DIMANA id=1'
</pre>

<p>
Errors are descriptive and do not crash the database.
</p>

<hr>

<h2>Data Safety</h2>

<ul>
  <li>Database file is never deleted automatically</li>
  <li>Data persists between program runs</li>
  <li>Backup is manual and explicit</li>
</ul>

<hr>

<h2>Use Cases</h2>

<ul>
  <li>CLI tools</li>
  <li>Offline applications</li>
  <li>Small web backends</li>
  <li>Game save systems</li>
  <li>Learning database internals</li>
</ul>

<hr>

<h2>License</h2>

<p>
Open-source project by KHaraStudio.
Free to use, modify, and distribute.
</p>

<hr>

<p>
XyharaDB — Developed by KHaraStudio
</p>

</body>
</html>
