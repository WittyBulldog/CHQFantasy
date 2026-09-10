const fs=require('node:fs'),path=require('node:path');
require('./data/build-career.cjs');
fs.mkdirSync('dist/data',{recursive:true});
for(const file of fs.readdirSync('.').filter(f=>/\.(html|css|js)$/.test(f)))fs.copyFileSync(file,path.join('dist',file));
fs.copyFileSync('data/career-data.js','dist/data/career-data.js');
for(const file of fs.readdirSync('dist').filter(f=>f.endsWith('.html'))){const html=fs.readFileSync(path.join('dist',file),'utf8');for(const [,url] of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(/^(https?:|mailto:|data:)/.test(url))continue;const target=path.join('dist',url.split('#')[0].split('?')[0]);if(!fs.existsSync(target))throw Error('Missing local asset '+file+' -> '+url);}}
console.log('Static build complete; all local page links and assets resolve.');
