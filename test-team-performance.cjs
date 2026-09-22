const assert=require('node:assert/strict');
const {calculateTeamPerformance}=require('../team-performance.js');
const data=require('./team-performance-week-1.js'),awards=require('../season-awards-data.js');
const rows=calculateTeamPerformance(data,awards);
const expected={'tylor-c':152.26,'mickey-b':179.16,'nick-n':153.40,'dusty-d':133.88,'chris-m':186.86,'brett-d':176.94,'dan-e':113.12,'mark-me':153.10,'dillon-m':116.90,'jason-h':156.16,'mark-ma':124.02,'jason-b':122.40};
for(const row of rows){
  assert.equal(row.possible,expected[row.id]);
  assert.equal(new Set(row.lineup.map(p=>p.index)).size,data.slots.length);
  assert.equal(Math.round(row.lineup.reduce((sum,p)=>sum+p.points,0)*100),Math.round(row.possible*100));
}
assert.equal(rows.find(r=>r.id==='nick-n').efficiency,100);
assert.equal(rows.find(r=>r.id==='chris-m').lineup.at(-1).points,-2);
// A flex slot must not consume the only TE needed by a required TE slot.
const fixture={season:2026,week:1,slots:['W/R/T','TE'],teams:[{id:'test',players:[['WR','WR',5],['TE','TE',30],['RB','RB',20]]}]};
const fixtureAwards={season:2026,weeks:[{week:1,complete:true,scores:[{id:'test',name:'Test',points:35}]}]};
assert.equal(calculateTeamPerformance(fixture,fixtureAwards)[0].possible,50);
const broken=structuredClone(data);broken.teams[0].players[0][2]=0;
assert.throws(()=>calculateTeamPerformance(broken,awards),/do not match/);
const incomplete=structuredClone(awards);incomplete.weeks[0].complete=false;
assert.throws(()=>calculateTeamPerformance(data,incomplete),/completed week/);
const missing=structuredClone(data);missing.teams.pop();
assert.throws(()=>calculateTeamPerformance(missing,awards),/Missing/);
console.log('Team performance: all 12 totals, unique players, flex eligibility, negative scores, and invalid-data checks passed.');

