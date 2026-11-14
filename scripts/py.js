const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const venvWin = path.join(root, '.venv', 'Scripts', 'python.exe');
const venvUnix = path.join(root, '.venv', 'bin', 'python');

let pyExecutable = 'python';
if (process.platform === 'win32' && fs.existsSync(venvWin)) {
  pyExecutable = venvWin;
} else if (fs.existsSync(venvUnix)) {
  pyExecutable = venvUnix;
}

const args = process.argv.slice(2);
const child = spawn(pyExecutable, args, { stdio: 'inherit', shell: false });

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
