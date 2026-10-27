const fs=require('node:fs'),{createHash}=require('node:crypto');
const file='weekly-updates.html';let html=fs.readFileSync(file,'utf8');
for(const asset of ['season-awards-data.js','season-awards.js','team-performance-history.js','team-performance.js']){
  const version=createHash('sha256').update(fs.readFileSync(asset)).digest('hex').slice(0,12);
  const pattern=new RegExp(`src="${asset.replaceAll('.','\\.')}(?:\\?v=[a-f0-9]+)?"`,'g');
  html=html.replace(pattern,`src="${asset}?v=${version}"`);
}
fs.writeFileSync(file,html);
