const fs=require('node:fs');
const assert=require('node:assert/strict');
const read=f=>JSON.parse(fs.readFileSync(__dirname+'/'+f,'utf8').replace(/^\uFEFF/,''));
const raw=read('yahoo-import.json'),mapping=read('league-members.json');
const normalize=s=>s.replace(/[’‘]/g,"'").trim().replace(/\s+/g,' ').toLowerCase();
const members=mapping.members.map(m=>({...m,years:Object.keys(m.teams).map(Number)}));
const games=[];
for(const s of raw.seasons){
 assert(s.regularSeasonComplete);
 const ids=s.teams.map(t=>{
  const matches=members.filter(m=>m.teams[s.year]&&normalize(m.teams[s.year])===normalize(t));
  assert.equal(matches.length,1,`Owner mapping: ${s.year} ${t}`);return matches[0].id;
 });
 const seen=new Set(),weeks=s.year===2020?13:14;
 const appearances=new Map();
 for(const [week,a,b,sa,sb] of s.games){
  assert(week>=1&&week<=weeks&&a!==b&&ids[a-1]&&ids[b-1]);
  assert(Number.isFinite(sa)&&Number.isFinite(sb)&&sa>=0&&sb>=0);
  const key=[week,...[a,b].sort((x,y)=>x-y)].join('-');assert(!seen.has(key));seen.add(key);
  for(const id of [a,b]){const k=`${week}-${id}`;assert(!appearances.has(k),'Two matches for one team in same week');appearances.set(k,true);}
  games.push({year:s.year,week,a:ids[a-1],b:ids[b-1],sa,sb,url:raw.archives[s.year]+`/matchup?week=${week}&mid1=${a}&mid2=${b}`});
 }
 assert.equal(s.games.length,weeks*6);
 assert.equal(appearances.size,weeks*12);
}
assert.equal(games.length,498);assert.equal(raw.seasons.length,6);
const data={through:'2025 regular season',members,games};
const {summarize}=require('../career-stats.js');
const all=summarize(data);
assert.equal(all.rows.reduce((n,r)=>n+r.games,0),996);
assert.equal(all.rows.reduce((n,r)=>n+r.wins,0),all.rows.reduce((n,r)=>n+r.losses,0));
assert.equal(summarize(data,'2021').rows.find(r=>r.id==='tylor-c').wins,8);
assert.equal(summarize(data,'2021').rows.find(r=>r.id==='dusty-d').wins,8);
assert.equal(all.rows.find(r=>r.id==='john-b').games,13);
assert.equal(all.rows.find(r=>r.id==='john-y').games,14);
assert.equal(all.rows.find(r=>r.id==='dillon-m').games,56);
for(const m of members){const opponents=members.filter(o=>o.id!==m.id);const count=opponents.reduce((n,o)=>n+summarize(data,'all',m.id,o.id).games.length,0);assert.equal(count,all.rows.find(r=>r.id===m.id).games);}
fs.writeFileSync(__dirname+'/career-data.js','window.CHQ_CAREER_DATA = '+JSON.stringify(data)+';\n');
console.log('Validated 498 games, six seasons, 15 owners; turnover, reciprocal totals and head-to-head sums pass.');
console.table(all.rows.sort((a,b)=>b.wins-a.wins).map(r=>({name:r.name,w:r.wins,l:r.losses,t:r.ties,g:r.games})));
