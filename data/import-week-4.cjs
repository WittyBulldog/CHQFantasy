const fs=require('node:fs');
const raw=require('./week-4-results.json');
const prior=require('../team-performance-data.js');
const awards=require('../season-awards-data.js');
const swami=require('./swami-picks.json');
const identity={1:['tylor-c','Silence of the Lamb'],2:['nick-n','Beast Infection'],3:['chris-m','Chris’s Team'],4:['dan-e','Daniel’s Primo Team'],5:['dillon-m','Dillon’s Team'],6:['brett-d','DonkeyWoodDean'],7:['jason-h','Gotham Knights'],8:['mark-ma','Mark’s Team'],9:['mark-me','Mels-16'],10:['mickey-b','Overdue Bills'],11:['jason-b','Slim Pickens'],12:['dusty-d','West Coast']};
const members=require('./league-members.json').members;
const source=m=>`https://football.fantasysports.yahoo.com/f1/317429/matchup?week=4&mid1=${m.ids[0]}&mid2=${m.ids[1]}`;
if(prior.week!==4)fs.copyFileSync('team-performance-data.js',`data/team-performance-week-${prior.week}.js`);
const weekAward={week:4,phase:'Regular season',complete:true,label:'Week 4 • final results',source:'https://football.fantasysports.yahoo.com/f1/317429?matchup_week=4',scores:raw.matchups.flatMap(m=>m.ids.map((id,i)=>({id:identity[id][0],name:members.find(p=>p.id===identity[id][0]).name,points:m.scores[i]})))};
awards.weeks=awards.weeks.filter(w=>w.week!==4).concat(weekAward).sort((a,b)=>a.week-b.week);
fs.writeFileSync('season-awards-data.js','// Yahoo results through Week 4 verified October 6, 2026; stat corrections may apply through October 8.\nconst CHQ_SEASON_AWARDS = '+JSON.stringify(awards,null,2)+";\nif(typeof module !== 'undefined') module.exports=CHQ_SEASON_AWARDS;\n");
const performance={season:2026,week:4,slots:prior.slots,teams:raw.rosters.map(r=>{const m=raw.matchups.find(m=>m.ids.includes(r.yahooId));return {id:identity[r.yahooId][0],team:identity[r.yahooId][1],matchup:`${m.ids[0]}&mid2=${m.ids[1]}`,players:r.players};})};
const rows=require('../team-performance.js').calculateTeamPerformance(performance,awards);
fs.writeFileSync('team-performance-data.js','// Yahoo Week 4 starters and benches verified October 6, 2026. IR excluded.\n// Stat corrections may apply through October 8. First nine players are starters.\nconst CHQ_TEAM_PERFORMANCE = '+JSON.stringify(performance,null,2)+";\nif(typeof module !== 'undefined') module.exports=CHQ_TEAM_PERFORMANCE;\n");
const recaps=[
  "Brett got the spotlight and the win. Flowers (28.80), Goff (23.48), Olave (22.60), LaPorta (22.40), and Reichard (20.00) helped DonkeyWoodDean cruise by 65.00. Flowers replaced Brian Thomas Jr. in the final flex spot. Taylor's 22.70 was Slim's only score above 20; the upset never materialized.",
  "Right winner, wrong idea about making it quick. The Commish scored 165.42 behind Lamb's 44.30 and Javonte's 31.30, and still lost by 31.20. McMillan (48.20), Kyren (36.70), Bijan (30.70), and Burrow (28.72) pushed Mels-16 to 196.62, the new season high. Mark's running back room was every bit the problem advertised.",
  "The Walker-Collins call landed: 67.70 combined, powering a 54.06-point win. Nick's final lineup used Antonio Williams at WR and Egbuka in the flex. Gotham started McLaurin for zero and Pitts instead of Andrews; Jameson Williams' 19.20 also stayed on the bench. None of those swaps alone would have erased the deficit.",
  "The receivers did not do the heavy lifting. Chris managed 61.58 with Rice scoring zero and Chase adding just 5.70. Daniel's final lineup included Puka, who delivered 30.70, alongside Maye's 27.16. A 71.68-point loss is a pretty firm rebuttal to the Swami. Monangai's 31.00 and Tate's 24.50 sat on Chris's bench.",
  "The Higgins call delivered 29.70, and Dillon's final lineup upgrades helped finish the job: Stroud scored 26.08 and Judkins 21.60. Mark started Sutton and Malik Washington with Jefferson and DeVonta out. Dillon won by 33.08; Yahoo's final projections had this nearly even, with Mark favored by just 0.07.",
  "Right winner, different heroes. Hubbard's 28.90 and Doubs' 23.80 led Mick to a 40.14-point win. Allen added 19.52, but Kincaid managed only 1.70, so the Buffalo-pair prediction gets partial credit at best. Dusty's Barkley and Irving combined for 8.10, while Nabers' 26.20 and Deebo's 18.00 stayed on the bench."
];
const w=swami.weeks.find(w=>w.week===4);
w.picks.forEach((p,i)=>{const m=raw.matchups[i];p.scores=m.scores;p.finalOriginalProjections=m.originalProjections;p.winner=identity[m.ids[m.scores[0]>m.scores[1]?0:1]][1];p.source=source(m);p.recap=recaps[i];});
w.editorialNote='Original previews and picks are preserved below. Final scores, starting lineups, and benches verified on Yahoo October 6, 2026; stat corrections may apply through October 8.';
w.summary='Week 4: 4–2 (66.7%). Mels-16, Beast Infection, Dillon, and Overdue Bills delivered. Brett steamrolled the featured upset pick, and Daniel dismantled Chris. Season record: 12–6 (66.7%), with Week 1 excluded.';
w.verified='October 6, 2026';
fs.writeFileSync('data/swami-picks.json',JSON.stringify(swami,null,2)+'\n');
console.log(rows.map(r=>({team:r.team,actual:r.actual,possible:r.possible,missed:r.missed})));
const swaps=[];
for(const r of performance.teams)for(const b of r.players.slice(9))for(let i=0;i<9;i++)if((performance.slots[i]==='W/R/T'?['RB','WR','TE'].includes(b[1]):b[1]===performance.slots[i])&&b[2]>r.players[i][2])swaps.push({team:r.team,bench:b,starter:r.players[i],gain:Math.round((b[2]-r.players[i][2])*100)/100});
console.log('Largest single swap:',swaps.sort((a,b)=>b.gain-a.gain)[0]);
