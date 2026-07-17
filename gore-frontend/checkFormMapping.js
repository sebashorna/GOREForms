const fs = require('fs');
const html = fs.readFileSync('src/app/pages/salud/salud.html', 'utf8');
const ts = fs.readFileSync('src/app/pages/salud/salud.ts', 'utf8');
const htmlNames = [];
let i = 0;
const pat = 'formControlName="';
while (true) {
  const j = html.indexOf(pat, i);
  if (j < 0) break;
  const k = html.indexOf('"', j + pat.length);
  htmlNames.push(html.slice(j + pat.length, k));
  i = k + 1;
}
const tsControls = [];
ts.split('\n').forEach(line => {
  const m = line.match(/^\s*([a-zA-Z0-9_]+): \[/);
  if (m) tsControls.push(m[1]);
});
const rawValues = [];
i = 0;
while (true) {
  const j = ts.indexOf('rawValues.', i);
  if (j < 0) break;
  let k = j + 'rawValues.'.length;
  while (k < ts.length && /[a-zA-Z0-9_]/.test(ts[k])) k++;
  rawValues.push(ts.slice(j + 'rawValues.'.length, k));
  i = k;
}
const uniq = arr => [...new Set(arr)];
const htmlU = uniq(htmlNames).sort();
const tsU = uniq(tsControls).sort();
const rawU = uniq(rawValues).sort();
console.log('HTML controls count', htmlU.length);
console.log(htmlU.join(', '));
console.log('TS controls count', tsU.length);
console.log(tsU.join(', '));
console.log('rawValues count', rawU.length);
console.log(rawU.join(', '));
console.log('missing in HTML', tsU.filter(x => !htmlU.includes(x)).join(', '));
console.log('missing in TS', htmlU.filter(x => !tsU.includes(x)).join(', '));
console.log('html controls not mapped', htmlU.filter(x => !rawU.includes(x)).join(', '));
