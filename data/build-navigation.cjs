const fs=require('node:fs');
const {renderNavigation}=require('./navigation.cjs');
for(const file of fs.readdirSync('.').filter(f=>f.endsWith('.html'))){
  const html=fs.readFileSync(file,'utf8');
  if(!/<nav class="nav"[\s\S]*?<\/nav>/.test(html))throw Error('Missing navigation: '+file);
  const current=file==='punishment-poll-admin.html'?'punishment-poll.html':file;
  fs.writeFileSync(file,html.replace(/<nav class="nav"[\s\S]*?<\/nav>/,renderNavigation(current)));
}
console.log('Grouped navigation generated across every page.');
