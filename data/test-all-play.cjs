const assert=require('node:assert/strict'),fs=require('node:fs');
const {calculateAllPlay,recordLabel}=require('./all-play-records.cjs');
const data=require('../season-awards-data.js'),teams=require('../team-performance-data.js').teams;
const result=calculateAllPlay({...data,weeks:data.weeks.filter(w=>w.week<=6)},teams);
const expected={
  'brett-d':['11-0','10-1','11-0','9-2','11-0','0-11','52-14'],
  'tylor-c':['7-4','3-8','7-4','10-1','7-4','10-1','44-22'],
  'mark-me':['6-5','9-2','10-1','11-0','6-5','1-10','43-23'],
  'jason-b':['0-11','11-0','6-5','3-8','9-2','8-3','37-29'],
  'mickey-b':['9-2','8-3','0-11','5-6','1-10','11-0','34-32'],
  'chris-m':['10-1','4-7','9-2','0-11','3-8','7-4','33-33'],
  'dillon-m':['1-10','6-5','8-3','7-4','5-6','4-7','31-35'],
  'mark-ma':['4-7','7-4','5-6','4-7','4-7','3-8','27-39'],
  'dan-e':['3-8','1-10','3-8','6-5','8-3','6-5','27-39'],
  'nick-n':['8-3','0-11','2-9','8-3','0-11','9-2','27-39'],
  'jason-h':['5-6','5-6','4-7','2-9','2-9','5-6','23-43'],
  'dusty-d':['2-9','2-9','1-10','1-10','10-1','2-9','18-48']
};
assert.equal(result.rows.length,12);
for(const row of result.rows){
  assert.deepEqual([...row.records.map(recordLabel),recordLabel(row)],expected[row.id]);
  for(const r of row.records)assert.equal(r.wins+r.losses+r.ties,11);
  assert.equal(row.wins+row.losses+row.ties,66);
}
for(let index=0;index<6;index++){
  const wins=result.rows.reduce((n,r)=>n+r.records[index].wins,0);
  const losses=result.rows.reduce((n,r)=>n+r.records[index].losses,0);
  assert.equal(wins,66);assert.equal(losses,66);
}
const smallTeams=[{id:'a',team:'A'},{id:'b',team:'B'},{id:'c',team:'C'}];
const small={season:2026,weeks:[{week:1,complete:true,scores:[{id:'a',points:0.1+0.2},{id:'b',points:0.3},{id:'c',points:-1}]},{week:2,complete:false,scores:[]}]};
const tied=calculateAllPlay(small,smallTeams);
assert.deepEqual(tied.weeks,[1]);
assert.equal(recordLabel(tied.rows.find(r=>r.id==='a')),'1-0-1');
assert.equal(recordLabel(tied.rows.find(r=>r.id==='b')),'1-0-1');
assert.equal(recordLabel(tied.rows.find(r=>r.id==='c')),'0-2');
assert.throws(()=>calculateAllPlay({...small,weeks:[{...small.weeks[0],scores:small.weeks[0].scores.slice(1)}]},smallTeams),/Missing or invalid/);
assert.throws(()=>calculateAllPlay({...small,weeks:[small.weeks[0],small.weeks[0]]},smallTeams),/Duplicate/);
const html=fs.readFileSync('weekly-updates.html','utf8');
assert.equal((html.match(/id="all-play-heading"/g)||[]).length,1);
assert.ok(html.indexOf('id="all-play-heading"')<html.indexOf('id="performance-heading"'));
const current=calculateAllPlay(data,teams);
assert.ok(html.includes(`scope="colgroup" colspan="${current.weeks.length}"`));
for(const row of current.rows)assert.equal(row.wins+row.losses+row.ties,current.weeks.length*11);
assert.equal(fs.readFileSync('dist/weekly-updates.html','utf8'),html);
console.log('All-play: all 84 example records match; balanced wins/losses, ties, negative scores, incomplete weeks, input validation, and generated table checks pass.');
