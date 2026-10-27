const fs=require('node:fs');
const raw=require('./week-7-results.json'),prior=require('../team-performance-data.js'),awards=require('../season-awards-data.js');
const identity={1:['tylor-c','Silence of the Lamb'],2:['nick-n','Beast Infection'],3:['chris-m','Chris’s Team'],4:['dan-e','Daniel’s Primo Team'],5:['dillon-m','Dillon’s Team'],6:['brett-d','DonkeyWoodDean'],7:['jason-h','Gotham Knights'],8:['mark-ma','Mark’s Team'],9:['mark-me','Mels-16'],10:['mickey-b','Overdue Bills'],11:['jason-b','Slim Pickens'],12:['dusty-d','West Coast']};
const members=require('./league-members.json').members;
if(prior.week!==7){
  if(prior.week!==6)throw Error('Expected Week 6 before importing Week 7.');
  const archive='data/team-performance-week-6.js';
  if(!fs.existsSync(archive))fs.copyFileSync('team-performance-data.js',archive);
}
const award={week:7,phase:'Regular season',complete:true,label:'Week 7 • final results',source:'https://football.fantasysports.yahoo.com/f1/317429?matchup_week=7',scores:raw.matchups.flatMap(m=>m.ids.map((id,i)=>({id:identity[id][0],name:members.find(p=>p.id===identity[id][0]).name,points:m.scores[i]})))};
awards.weeks=awards.weeks.filter(w=>w.week!==7).concat(award).sort((a,b)=>a.week-b.week);
const performance={season:2026,week:7,slots:prior.slots,teams:raw.matchups.flatMap(m=>m.ids.map((id,i)=>({id:identity[id][0],team:identity[id][1],matchup:`${m.ids[0]}&mid2=${m.ids[1]}`,players:m.rosters[i]})))};
const rows=require('../team-performance.js').calculateTeamPerformance(performance,awards);
fs.writeFileSync('season-awards-data.js','// Yahoo results through Week 7 verified October 27, 2026; corrections may apply through October 29.\nconst CHQ_SEASON_AWARDS = '+JSON.stringify(awards,null,2)+";\nif(typeof module !== 'undefined') module.exports=CHQ_SEASON_AWARDS;\n");
fs.writeFileSync('team-performance-data.js','// Yahoo Week 7 starters and benches verified October 27, 2026. IR excluded.\n// Bye-week bench scores are zero. First nine players are starters.\nconst CHQ_TEAM_PERFORMANCE = '+JSON.stringify(performance,null,2)+";\nif(typeof module !== 'undefined') module.exports=CHQ_TEAM_PERFORMANCE;\n");
const source=m=>`https://football.fantasysports.yahoo.com/f1/317429/matchup?week=7&amp;mid1=${m.ids[0]}&amp;mid2=${m.ids[1]}`;
const recaps={
  1:'The Commish wins his third straight and gets to be unbearable for another week. Javonte Williams (24.50), Lamb (24.40), Jeanty (21.60), and Jacobs (20.10) supplied the bulk of the damage. Caleb Williams gave Chris 25.12 and Swift added 19.00, but Silence won by 23.60. Tucker’s 24.30 still watched from the bench, so there was room for more.',
  2:'81.22 is not usually a score you want to frame, but Nick can put this one wherever he likes. Stevenson’s 22.50 and Boswell’s 12.40 helped Beast survive by 0.90. Concepcion scored 26.20 for Mick, but Cooper’s 25.50 sat behind Coker’s 1.90. That one swap would have turned the loss into a 22.70-point win. Nick also left Lemon’s 19.70 unused, so nobody gets a lineup-management parade.',
  4:'Dan supplied the week’s highest score, and Pollard supplied a fairly direct response to the running-back-room criticism. Pollard (39.50), Maye (31.44), and McBride (30.10) combined for 101.04. Slim scored 153.48, the second-highest total of the week, and still lost by 15.86. Burden’s 26.70 and Allen’s 22.40 deserved a better opponent.',
  5:'Brett’s stay in the losing column lasted one week. Flowers delivered 30.70, Goff added 21.02, and Gibbs supplied 20.30 in a 16.64-point win. Higgins (29.80) and Judkins (23.40) kept Dillon competitive through the bye weeks. Brett and Dillon both started their best possible lineups from the available active rosters; this one was not hiding on the bench.',
  7:'The Bat-Signal finally got a convincing answer. JSN’s 34.30 and Jameson Williams’ 26.10 helped Gotham post the biggest winning margin of the week: 41.92. McCaffrey’s 22.00 and Vele’s 16.40 could not rescue Mark, whose Ravens defense scored minus three. Skattebo’s 22.10 on the bench would have helped, but no available lineup would have caught Gotham.',
  9:'Dusty turned an 11.33-point projected loss into a 35.64-point win, the week’s only upset against Yahoo’s final original projections. St. Brown (27.20), Irving (27.00), and Nabers (21.10) carried the comeback. Mels has now lost two straight. Burrow’s 28.88 sat behind Purdy’s 14.02, but even the best possible lineup would have fallen short of West Coast.'
};
const card=(id,title,subtitle,headline,stats,note,match)=>`<section class="weekly-card" aria-labelledby="${id}-heading"><div class="category"><h3 id="${id}-heading">${title}</h3></div><p>${subtitle}</p><p class="result-title">${headline}</p><dl>${stats.map(([a,b])=>`<div class="weekly-stat"><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl><p class="result-note">${note}</p><a class="source-link" href="${source(match)}">View matchup on Yahoo →</a></section>`;
const closest=raw.matchups.find(m=>m.ids[0]===2),upset=raw.matchups.find(m=>m.ids[0]===9);
const intro=`  <div class="weekly-heading"><div><div class="eyebrow">October 20–26, 2026</div><h2 id="weekly-highlights">Week 7 Highlights</h2></div><p class="status">Week 7 • Final results</p></div>
<p class="recap-note">Week 7 is complete. Scores, final original projections, starters, and benches verified on Yahoo October 27. Stat corrections may apply through October 29. Upsets use Yahoo’s final displayed original projections. Bye-week players score zero; IR players are excluded from lineup efficiency.</p>
<p class="recap-note"><strong>The Swami took an unscheduled bye.</strong> No Week 7 picks were submitted, so there is no prediction grade for this week. The season record stays at 18–12 (60.0%); Week 1 and Week 7 are excluded.</p>
<div class="weekly-grid">
${card('closest','Closest Matchup','A win is a win. This one barely cleared the doorway.','Beast survives by 0.90',[['Matchup','Beast Infection vs. Overdue Bills'],['Final score','Nick 81.22 • Mick 80.32'],['Winning margin','0.90 points']],'Stevenson’s 22.50 and Boswell’s 12.40 helped Nick scrape home. Concepcion’s 26.20 kept Mick close, but Bryce Young managed 7.42 and Coker added only 1.90. Both teams left useful receiver points on the bench. Beast wins the matchup; the stat-correction window gets its own seat at the table.',closest)}
${card('upset','Biggest Upset','West Coast gives the projections a correction of its own.','Dusty hands Mels a second straight loss',[['Yahoo’s final original projections','Mels-16 137.72 • West Coast 126.39'],['Final score','Mels 98.62 • West Coast 134.26'],['Underdog deficit','11.33 projected points']],'St. Brown and Irving combined for 54.20, with Nabers adding 21.10. An 11.33-point projected defeat became a 35.64-point win: a 46.97-point swing. West Coast was the week’s only winning underdog by final original projections. Even perfect lineup decisions would not have saved Mels.',upset)}
${card('bench','Worst Bench Decision','Mick had the winning receiver. He just needed him in the lineup.','Cooper’s 25.50 sits behind Coker’s 1.90',[['Owner &amp; benched player','Mickey B • Omar Cooper Jr.'],['Bench vs. starter','Cooper 25.50 • Coker 1.90'],['Missed points from one eligible swap','23.60 points']],'The largest single eligible bench-to-starter upgrade of the week belonged to Overdue Bills. Cooper for Coker would have raised Mick from 80.32 to 103.92 and turned the 0.90-point loss into a 22.70-point win. Swapping Harrison’s 7.60 for Douglas’ 5.30 as well would have produced the roster’s best possible 106.22.',closest)}
</div>
<section class="season-awards" aria-labelledby="week-7-results-heading"><div class="eyebrow">Around the league</div><h2 id="week-7-results-heading">Week 7 Results</h2><p class="recap-note">Daniel led the week with 169.34, earning his first weekly high-score win of the season. Slim’s 153.48 would have beaten every other team. Brett’s Week 5 score of 206.74 remains the season high.</p><div class="week-results">${raw.matchups.map(m=>{const names=m.ids.map(id=>identity[id][1]);return `<article><h3>${names.join(' vs. ')}</h3><p><strong>${m.scores.map(n=>n.toFixed(2)).join(' – ')}</strong> • Winner: ${names[m.scores[0]>m.scores[1]?0:1]}</p><p class="result-note">${recaps[m.ids[0]]}</p><a class="source-link" href="${source(m)}">View on Yahoo →</a></article>`;}).join('\n')}</div></section>
`;
let html=fs.readFileSync('weekly-updates.html','utf8');
const contentStart=html.indexOf('<div class="weekly-heading">',html.indexOf('<!-- WEEKLY JUMPS END -->'));
const contentEnd=html.indexOf('<!-- ALL-PLAY RECORDS START -->',contentStart);
if(contentStart<0||contentEnd<0)throw Error('Missing latest recap boundaries.');
if(!html.includes('Week 7 Highlights')){
  const old=html.slice(contentStart,contentEnd).replace('id="weekly-highlights"','id="week-6-highlights"');
  html=html.slice(0,contentStart)+intro+html.slice(contentEnd);
  html=html.replace(' id="weekly-archives"','');
  const target='<details class="season-awards"><summary>Week 5 recap archive';
  if(!html.includes(target))throw Error('Missing Week 5 archive.');
  html=html.replace(target,`<details class="season-awards" id="weekly-archives"><summary>Week 6 recap archive</summary>${old}</details>\n${target}`);
}else html=html.slice(0,contentStart)+intro+html.slice(contentEnd);
html=html.replace(/(<details class="season-awards" id="weekly-archives"><summary>Week 6 recap archive<\/summary>)([\s\S]*?)(<\/details>)/,(_,open,body,close)=>open+body.replace(/\b(closest|upset|bench)-heading\b/g,'week-6-$1-heading')+close);
fs.writeFileSync('weekly-updates.html',html);
console.log(rows.map(r=>({team:r.team,actual:r.actual,possible:r.possible,missed:r.missed})));
