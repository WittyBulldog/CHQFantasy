const fs=require('node:fs');
const raw=require('./week-9-results.json'),prior=require('../team-performance-data.js'),awards=require('../season-awards-data.js');
const identity={1:['tylor-c','Silence of the Lamb'],2:['nick-n','Beast Infection'],3:['chris-m','Chris’s Team'],4:['dan-e','Daniel’s Primo Team'],5:['dillon-m','Dillon’s Team'],6:['brett-d','DonkeyWoodDean'],7:['jason-h','Gotham Knights'],8:['mark-ma','Mark’s Team'],9:['mark-me','Mels-16'],10:['mickey-b','Overdue Bills'],11:['jason-b','Slim Pickens'],12:['dusty-d','West Coast']};
const members=require('./league-members.json').members;
if(prior.week!==9){
 if(prior.week!==8)throw Error('Expected Week 8 before importing Week 9.');
 if(!fs.existsSync('data/team-performance-week-8.js'))fs.copyFileSync('team-performance-data.js','data/team-performance-week-8.js');
}
const source=m=>`https://football.fantasysports.yahoo.com/f1/317429/matchup?week=9&amp;mid1=${m.ids[0]}&amp;mid2=${m.ids[1]}`;
const award={week:9,phase:'Regular season',complete:true,label:'Week 9 • final results',source:'https://football.fantasysports.yahoo.com/f1/317429?matchup_week=9',scores:raw.matchups.flatMap(m=>m.ids.map((id,i)=>({id:identity[id][0],name:members.find(p=>p.id===identity[id][0]).name,points:m.scores[i]})))};
awards.weeks=awards.weeks.filter(w=>w.week!==9).concat(award).sort((a,b)=>a.week-b.week);
const performance={season:2026,week:9,slots:prior.slots,teams:raw.matchups.flatMap(m=>m.ids.map((id,i)=>({id:identity[id][0],team:identity[id][1],matchup:`${m.ids[0]}&mid2=${m.ids[1]}`,players:m.rosters[i]})))};
require('../team-performance.js').calculateTeamPerformance(performance,awards);
fs.writeFileSync('season-awards-data.js','// Yahoo results through Week 9 verified November 10, 2026; corrections may apply through November 12.\nconst CHQ_SEASON_AWARDS = '+JSON.stringify(awards,null,2)+";\nif(typeof module !== 'undefined') module.exports=CHQ_SEASON_AWARDS;\n");
fs.writeFileSync('team-performance-data.js','// Yahoo Week 9 starters and benches verified November 10, 2026. IR excluded.\n// Bye-week bench scores are zero. First nine players are starters.\nconst CHQ_TEAM_PERFORMANCE = '+JSON.stringify(performance,null,2)+";\nif(typeof module !== 'undefined') module.exports=CHQ_TEAM_PERFORMANCE;\n");
const recaps={
 1:'Five straight for the Commish, but Nick made him earn this one. Lamb’s 36.50 and Javonte Williams’ 25.40 helped Silence win by 8.04 despite Jacobs’ 0.50. Walker delivered 39.30 for Beast and Shough added 19.70. Nick used almost every available point: even his best possible 133.00 would have fallen 7.14 short. Sometimes the lineup is fine and the opponent is the problem.',
 3:'Chris keeps finding points through the air. Chase (34.50) and Watson (33.10) combined for 67.60 in a 24.78-point win. Bowers’ 25.30 and McCaffrey’s 22.70 kept Mark scoring, but the receivers could not match Chris’s output. Mark’s best possible 137.48 would still have finished 8.38 short. Chris missed the weekly high score by just 1.32.',
 4:'Dan makes it three straight with 38.00 from Puka and 21.26 from Maye. The running backs combined for only 9.70, but 111.66 was enough to beat Mick by 29.70. Concepcion’s 18.80 and Douglas’ 18.20 watched from the bench while Mitchell scored zero and Coker managed 6.60. A fully optimized lineup would have given Overdue Bills 118.76 and a 7.10-point win. The points were there; the lineup was not.',
 5:'Golden’s 35.40 and Burden’s 20.70 helped Slim win by 27.54 despite McConkey’s zero. Higgins scored 20.20 and Cook added 19.70 for Dillon, but Evans’ zero hurt with Boston’s 15.80 on the bench. That swap alone would not have caught Slim, and even Dillon’s best possible 115.76 would have fallen 8.34 short.',
 6:'Mels stops a three-game skid while Brett’s losing streak reaches two. Burrow (29.54) and Bijan (29.70) combined for 59.24 in a 32.32-point win. Olave’s 16.80 was Brett’s highest starter score, and Goff managed only 6.30. Kelce’s 17.30 stayed on Mels’ bench, but Brett had no available lineup that would have made this close: his best possible total was 91.92.',
 7:'Dusty led the league with 147.18 and won by 68.16, the biggest margin of the week. Love’s 39.18 and Irving’s 28.50 supplied the foundation. Gotham’s highest scorer was Fairbairn at 17.80, with Sutton’s 15.50 left on the bench. Even the best possible Gotham lineup would have reached only 89.52. West Coast turned a 2.07-point projected deficit into a very comfortable win.'
};
const card=(id,title,headline,stats,note,m)=>`<section class="weekly-card" aria-labelledby="${id}-heading"><div class="category"><h3 id="${id}-heading">${title}</h3></div><p class="result-title">${headline}</p><dl>${stats.map(([a,b])=>`<div class="weekly-stat"><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl><p class="result-note">${note}</p><a class="source-link" href="${source(m)}">View matchup on Yahoo →</a></section>`;
const closest=raw.matchups[0],upset=raw.matchups.find(m=>m.ids[0]===7),bench=raw.matchups.find(m=>m.ids[0]===4);
const intro=`<div class="weekly-heading"><div><div class="eyebrow">November 3–9, 2026</div><h2 id="weekly-highlights">Week 9 Highlights</h2></div><p class="status">Week 9 • Final results</p></div>
<p class="recap-note">Week 9 is complete. Scores, final original projections, starters, and benches verified on Yahoo November 10. Stat corrections may apply through November 12. Upsets use Yahoo’s final displayed original projections. Bye-week players score zero; IR players are excluded from lineup efficiency.</p>
<div class="weekly-grid">
${card('closest','Closest Matchup','Silence survives Beast by 8.04',[['Matchup','Silence of the Lamb vs. Beast Infection'],['Final score','Tylor 140.14 • Nick 132.10'],['Winning margin','8.04 points']],'Lamb’s 36.50 and Javonte Williams’ 25.40 helped the Commish claim a fifth straight win. Walker’s 39.30 kept Nick close, but even Beast’s best possible 133.00 would not have caught Silence. Nick left only 0.90 on the bench from the available roster. An excellent lineup decision rate is unfortunately not a tiebreaker for this matchup.',closest)}
${card('upset','Biggest Upset','West Coast wins by 68.16 as a 2.07-point underdog',[['Yahoo’s final original projections','Gotham Knights 122.76 • West Coast 120.69'],['Final score','Gotham 79.02 • West Coast 147.18'],['Underdog deficit','2.07 projected points']],'Love and Irving combined for 67.68 as Dusty posted the weekly high score and largest winning margin. A projected 2.07-point defeat became a 68.16-point win: a 70.23-point swing. Daniel also won as a 1.30-point underdog, while Silence won as a 0.57-point underdog. West Coast’s projected deficit was the largest of the three.',upset)}
${card('bench','Worst Bench Decision','Concepcion’s 18.80 sits behind Mitchell’s zero',[['Owner &amp; benched player','Mickey B • KC Concepcion Jr.'],['Bench vs. starter','Concepcion 18.80 • Adonai Mitchell 0.00'],['Missed points from one eligible swap','18.80 points']],'The largest single eligible swap belonged to Overdue Bills. Concepcion for Mitchell would have raised 81.96 to 100.76, still short of Daniel’s 111.66. Adding Douglas for Coker and Justice Hill for Corum would have produced the best possible 118.76 and flipped the result into a 7.10-point win. Mick left 36.80 points behind in total.',bench)}
</div>
<section class="season-awards" aria-labelledby="week-9-results-heading"><div class="eyebrow">Around the league</div><h2 id="week-9-results-heading">Week 9 Results</h2><p class="recap-note">West Coast led the week with 147.18, giving Dusty his first weekly high-score win of the season. Chris finished 1.32 behind. Brett’s Week 5 score of 206.74 remains the season high.</p><div class="week-results">${raw.matchups.map(m=>{const names=m.ids.map(id=>identity[id][1]);return `<article><h3>${names.join(' vs. ')}</h3><p><strong>${m.scores.map(n=>n.toFixed(2)).join(' – ')}</strong> • Winner: ${names[m.scores[0]>m.scores[1]?0:1]}</p><p class="result-note">${recaps[m.ids[0]]}</p><a class="source-link" href="${source(m)}">View on Yahoo →</a></article>`;}).join('\n')}</div></section>
<p class="recap-note"><strong>No Week 9 Swami picks are recorded.</strong> No prediction grade is added for this week. The season record remains 21–15 (58.3%), with Weeks 1, 7, and 9 excluded. <a href="matchup.html#swami-heading">View the latest recorded picks and results →</a></p>
`;
let html=fs.readFileSync('weekly-updates.html','utf8');
const start=html.indexOf('<div class="weekly-heading">',html.indexOf('<!-- WEEKLY JUMPS END -->')),end=html.indexOf('<!-- ALL-PLAY RECORDS START -->',start);
if(start<0||end<0)throw Error('Missing recap boundaries.');
const old=html.slice(start,end);html=html.slice(0,start)+intro+html.slice(end);
if(!old.includes('Week 9 Highlights')){
 const archive=old.replace('id="weekly-highlights"','id="week-8-highlights"').replace(/\b(closest|upset|bench)-heading\b/g,'week-8-$1-heading');
 html=html.replace(' id="weekly-archives"','');
 const target='<details class="season-awards"><summary>Week 7 recap archive';
 if(!html.includes(target))throw Error('Missing Week 7 archive.');
 html=html.replace(target,`<details class="season-awards" id="weekly-archives"><summary>Week 8 recap archive</summary>${archive}</details>\n${target}`);
}
fs.writeFileSync('weekly-updates.html',html);
console.log('Week 9 imported; no Swami picks created or graded.');
