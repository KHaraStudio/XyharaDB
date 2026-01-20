# XyharaDB Documentation
XyharaDB is a lightweight file-based 
database engine written in JavaScript. It 
is designed as a **library/framework**, 
not an application. XyharaDB focuses on: - 
Simplicity - Direct file storage (`.xydb`) 
- Console & programmatic usage - DB-like 
behavior without SQL complexity
## Key Principles
- No fixed folder structure - User 
controls database file location - 
Engine-first design - No external 
dependencies
## Basic Usage
```js import XyharaDB from 'xyharadb'; 
const db = new XyharaDB({
  dbPath: './mydb.xydb'
});

