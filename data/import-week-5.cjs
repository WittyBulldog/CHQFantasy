const fs=require('node:fs');
const raw=require('./week-5-results.json'),prior=require('../team-performance-data.js'),awards=require('../season-awards-data.js'),swami=require('./swami-picks.json');
const identity={1:['tylor-c','Silence of the Lamb'],2:['nick-n','Beast Infection'],3:['chris-m','Chris’s Team'],4:['dan-e','Daniel’s Primo Team'],5:['dillon-m','Dillon’s Team'],6:['brett-d','DonkeyWoodDean'],7:['jason-h','Gotham Knights'],8:['mark-ma','Mark’s Team'],9:['mark-me','Mels-16'],10:['mickey-b','Overdue Bills'],11:['jason-b','Slim Pickens'],12:['dusty-d','West Coast']};
const members=require('./league-members.json').members;
const source=m=>`https://football.fantasysports.yahoo.com/f1/317429/matchup?week=5&mid1=${m.ids[0]}&mid2=${m.ids[1]}`;
if(prior.week!==5)fs.copyFileSync('team-performance-data.js',`data/team-performance-week-${prior.week}.js`);
const weekAward={week:5,phase:'Regular season',complete:true,label:'Week 5 • final results',source:'https://football.fantasysports.yahoo.com/f1/317429?matchup_week=5',scores:raw.matchups.flatMap(m=>m.ids.map((id,i)=>({id:identity[id][0],name:members.find(p=>p.id===identity[id][0]).name,points:m.scores[i]})))};
awards.weeks=awards.weeks.filter(w=>w.week!==5).concat(weekAward).sort((a,b)=>a.week-b.week);
const performance={season:2026,week:5,slots:prior.slots,teams:raw.matchups.flatMap(m=>m.ids.map((id,i)=>({id:identity[id][0],team:identity[id][1],matchup:`${m.ids[0]}&mid2=${m.ids[1]}`,players:m.rosters[i]})))};
const rows=require('../team-performance.js').calculateTeamPerformance(performance,awards);
fs.writeFileSync('season-awards-data.js','// Yahoo results through Week 5 verified October 13, 2026; corrections may apply through October 15.\nconst CHQ_SEASON_AWARDS = '+JSON.stringify(awards,null,2)+";\nif(typeof module !== 'undefined') module.exports=CHQ_SEASON_AWARDS;\n");
fs.writeFileSync('team-performance-data.js','// Yahoo Week 5 starters and benches verified October 13, 2026. IR excluded.\n// Bye-week bench scores are zero; corrections may apply through October 15. First nine players are starters.\nconst CHQ_TEAM_PERFORMANCE = '+JSON.stringify(performance,null,2)+";\nif(typeof module !== 'undefined') module.exports=CHQ_TEAM_PERFORMANCE;\n");
const recaps={
  1:"The Commish finally got a win to match the points. Likely's 32.40, London's 21.80, and Shrader's 21.30 helped Silence survive Lamb's 2.90 and beat Mark by 10.50. Bowers (26.00), Rodgers (22.00), and Jefferson (18.80) kept Mark close, but the supporting cast could not close the gap.",
  2:"The spotlight was on Nick. The points were on Jason's side. Pickens (31.00), Golden (23.30), Adams (22.10), and Braelon Allen (21.60) powered Slim to a 56.40-point win. Shough's 1.84 put Beast in a hole, and Walker was on a bye. Egbuka and Stevenson tried to help, but this upset call was dead well before the final tally.",
  3:"The bounce-back call survived, barely. Watson's 35.30 and Chase's 19.70 carried Chris to an 8.68-point win despite Bagent scoring 3.18. Allen dropped 34.50 for Mick, but the shrine needed more help from the receivers. Starting Bourne (12.00) instead of Concepcion (1.50) would have flipped the result to a 1.82-point Overdue Bills win.",
  6:"Until someone stops the donkey, keep riding. Gibbs (40.70) and Warren (39.80) combined for 80.50, with Goff (28.94) and Wilson (26.40) adding to the damage. Brett's 206.74 is the new season high, and he won by 70.58. Puka matched Gibbs with 40.70 for Daniel, but one monster game could not keep up with the whole damn stable.",
  5:"West Coast finally showed up, and Dillon got the bill. Irving (34.50), Washington (33.40), Nabers (32.10), and Love (28.28) powered Dusty's 176.68 and a 52.62-point first win. Daniels (35.26), Evans (29.30), and Cook (25.80) gave Dillon a solid total, but this was the week the basement fought back.",
  7:"The ridiculous upset pick stayed ridiculous. Mels won by 16.34 behind Burrow (24.60), Henry (24.00), and Tyler Warren (21.40), keeping the perfect record intact. JSN's 25.80 helped Gotham, but Montgomery's 1.10 did not. Woody Marks over Montgomery alone would not have won it; combine that with Pitts over Andrews and Gotham could have flipped the result."
};
const w=swami.weeks.find(w=>w.week===5);
w.picks.forEach(p=>{const m=raw.matchups.find(m=>source(m)===p.source);if(!m)throw Error('Unmatched pick');p.scores=m.scores;p.finalOriginalProjections=m.originalProjections;p.winner=identity[m.ids[m.scores[0]>m.scores[1]?0:1]][1];p.recap=recaps[m.ids[0]];});
w.editorialNote='Original Week 5 previews and picks are preserved. Final scores, starters, and benches checked on Yahoo October 13, 2026; corrections may apply through October 15.';
w.summary='Week 5: 3–3 (50.0%). Silence of the Lamb, Chris, and Brett delivered. Slim and Mels spoiled the upset calls, and West Coast finally got its first win. Season record: 15–9 (62.5%), with Week 1 excluded.';
w.verified='October 13, 2026';
fs.writeFileSync('data/swami-picks.json',JSON.stringify(swami,null,2)+'\n');
console.log(rows.map(r=>({team:r.team,actual:r.actual,possible:r.possible,missed:r.missed})));
