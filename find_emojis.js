import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.jsx')) results.push(file);
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
files.forEach(f => {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    let hasEmoji = false;
    for (let char of line) {
      if (char.codePointAt(0) > 0x2000 && char.codePointAt(0) !== 0x2022 && char !== '₹') { // > 0x2000 catches emojis, exclude bullet points and rupee
        hasEmoji = true;
        break;
      }
    }
    if (hasEmoji) {
      console.log(`${f}:${i+1} => ${line.trim()}`);
    }
  });
});
