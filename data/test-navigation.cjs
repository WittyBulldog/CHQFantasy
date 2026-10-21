const assert=require('node:assert/strict'),fs=require('node:fs');
const {GROUPS,renderNavigation}=require('./navigation.cjs');
const expected=['index.html',...GROUPS.flatMap(g=>g.links.map(([url])=>url))];
assert.equal(new Set(expected).size,12);
const files=fs.readdirSync('.').filter(f=>f.endsWith('.html'));
for(const file of files){
 const html=fs.readFileSync(file,'utf8');
 const nav=html.match(/<nav class="nav"[\s\S]*?<\/nav>/)?.[0];
 const active=file==='punishment-poll-admin.html'?'punishment-poll.html':file;
 assert.equal(nav,renderNavigation(active),'Shared menu differs on '+file);
 const links=[...nav.matchAll(/<a href="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(links,expected,'Missing or duplicate destination on '+file);
 const inMenu=expected.includes(active);
 assert.equal((nav.match(/aria-current="page"/g)||[]).length,inMenu?1:0,'Active link count on '+file);
 if(inMenu)assert.ok(nav.includes(`href="${active}" class="active-nav" aria-current="page"`));
 assert.equal((nav.match(/<summary>/g)||[]).length,4);
 assert.equal((nav.match(/<details[^>]* open/g)||[]).length,0,'Groups should start collapsed');
 assert.equal((nav.match(/active-group/g)||[]).length,file==='index.html'||!inMenu?0:1);
 assert.ok(html.includes('href="mobile-nav.css"')&&html.includes('src="mobile-nav.js"'));
 assert.ok(!nav.includes('punishment-poll-admin.html'),'Commissioner controls must not be in public navigation');
 assert.equal(fs.readFileSync('dist/'+file,'utf8').match(/<nav class="nav"[\s\S]*?<\/nav>/)[0],nav);
}
console.log(`Grouped navigation verified on ${files.length} pages: all 12 published destinations, 4 collapsed groups, active links, and matching published assets.`);
