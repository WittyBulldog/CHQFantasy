const fs=require('node:fs'),assert=require('node:assert/strict');
const raw=require('./week-9-results.json'),data=require('../team-performance-data.js'),awards=require('../season-awards-data.js'),swami=require('./swami-picks.json');
const rows=require('../team-performance.js').calculateTeamPerformance(data,awards);
assert.equal(data.week,9);assert.equal(rows.length,12);
assert.equal(awards.weeks.filter(w=>w.complete).length,9);
assert.equal(Math.min(...raw.matchups.map(m=>Math.round(Math.abs(m.scores[0]-m.scores[1])*100))),804);
assert.equal(Math.max(...rows.map(r=>r.actual)),147.18);
assert.equal(rows.find(r=>r.id==='mickey-b').possible,118.76);
assert.equal(rows.find(r=>r.id==='nick-n').possible,133);
const underdogs=raw.matchups.map(m=>({m,i:m.scores[0]>m.scores[1]?0:1})).filter(({m,i})=>m.originalProjections[i]<m.originalProjections[1-i]).sort((a,b)=>(b.m.originalProjections[1-b.i]-b.m.originalProjections[b.i])-(a.m.originalProjections[1-a.i]-a.m.originalProjections[a.i]));
assert.equal(underdogs.length,3);assert.deepEqual(underdogs[0].m.ids,[7,12]);
const swaps=[];
for(const t of data.teams)for(const b of t.players.slice(9))for(let i=0;i<9;i++)if(data.slots[i]==='W/R/T'?['WR','RB','TE'].includes(b[1]):b[1]===data.slots[i])swaps.push({team:t.id,bench:b[0],starter:t.players[i][0],gain:Math.round((b[2]-t.players[i][2])*100)});
assert.deepEqual(swaps.sort((a,b)=>b.gain-a.gain)[0],{team:'mickey-b',bench:'KC Concepcion Jr.',starter:'Adonai Mitchell',gain:1880});
// Compare cumulative scores against Yahoo's current standings, not just roster sums.
const expectedPF={'brett-d':1263.84,'tylor-c':1169.96,'mark-me':1167.92,'chris-m':1135.22,'jason-b':1146.72,'dan-e':1117.28,'mark-ma':1022.4,'nick-n':979.06,'dillon-m':1059.06,'dusty-d':1041.04,'mickey-b':981.2,'jason-h':985.4};
for(const [id,total] of Object.entries(expectedPF))assert.equal(awards.weeks.reduce((sum,w)=>sum+Math.round(w.scores.find(s=>s.id===id).points*100),0),Math.round(total*100),id+' Yahoo points total');
assert.ok(!swami.weeks.some(w=>w.week===9&&w.picks.length));
assert.equal(swami.weeks.flatMap(w=>w.picks).filter(p=>p.winner===p.pick).length,21);
const allPlay=require('./all-play-records.cjs').calculateAllPlay(awards,data.teams);
assert.ok(allPlay.rows.every(r=>r.wins+r.losses+r.ties===99));
const rankings=JSON.parse(fs.readFileSync('data/power-rankings.json','utf8')).editions.at(-1);
assert.equal(rankings.week,9);
assert.deepEqual(rankings.teams.map(t=>t.id),['tylor-c','chris-m','brett-d','dillon-m','dan-e','dusty-d','mark-me','jason-b','nick-n','mark-ma','jason-h','mickey-b']);
assert.ok(rankings.teams.every(t=>t.comment));
assert.ok(rankings.teams[2].comment.includes('three losses in four weeks'));
const weekly=fs.readFileSync('weekly-updates.html','utf8');
assert.ok(weekly.includes('Week 9 Highlights'));assert.ok(weekly.includes('scope="colgroup" colspan="9"'));
assert.ok(weekly.includes('No Week 9 Swami picks are recorded'));
assert.ok(weekly.includes('href="#week-9-results-heading"'));
for(let week=1;week<=8;week++)assert.ok(weekly.includes(`Week ${week} recap archive`));
for(const file of ['weekly-updates.html','power-rankings.html']){
 const html=fs.readFileSync(file,'utf8'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,'Duplicate ID in '+file);
 assert.equal(fs.readFileSync('dist/'+file,'utf8'),html);
}
console.log('Week 9 checks pass: six results, 12 lineups, Yahoo cumulative scores, highlights, nine-week records, exact ranking order, preserved archives, and no added Swami grades.');
