import readline from 'readline';
import XyharaDB from './home/XyharaDB.js';
import chalk from 'chalk';

const db = new XyharaDB();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green('XyharaDB> ')
});

console.log(chalk.blue.bold('Selamat datang di XyharaDB console!'));
console.log(chalk.yellow('Bahasa query: XQL (Xyhara Query Language)'));
console.log(chalk.gray("Ketik 'keluar' untuk keluar.\n"));
rl.prompt();

rl.on('line', (line) => {
    line = line.trim();
    if(line.toLowerCase() === 'keluar') {
        console.log(chalk.red('Keluar dari XyharaDB console.'));
        process.exit(0);
    }
    try {
        const hasil = db.query(line);
        if(hasil !== undefined) console.log(chalk.cyanBright(JSON.stringify(hasil, null, 2)));
    } catch(err) {
        console.log(chalk.red('Error:'), err.message);
    }
    rl.prompt();
}).on('close', () => {
    console.log(chalk.red('Console ditutup.'));
    process.exit(0);
});
