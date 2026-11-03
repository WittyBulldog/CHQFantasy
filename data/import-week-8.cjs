const fs=require('node:fs');
const raw=require('./week-8-results.json'),prior=require('../team-performance-data.js'),awards=require('../season-awards-data.js'),swami=require('./swami-picks.json');
const identity={1:['tylor-c','Silence of the Lamb'],2:['nick-n','Beast Infection'],3:['chris-m','Chris’s Team'],4:['dan-e','Daniel’s Primo Team'],5:['dillon-m','Dillon’s Team'],6:['brett-d','DonkeyWoodDean'],7:['jason-h','Gotham Knights'],8:['mark-ma','Mark’s Team'],9:['mark-me','Mels-16'],10:['mickey-b','Overdue Bills'],11:['jason-b','Slim Pickens'],12:['dusty-d','West Coast']};
const members=require('./league-members.json').members;
const source=m=>`https://football.fantasysports.yahoo.com/f1/317429/matchup?week=8&mid1=${m.ids[0]}&mid2=${m.ids[1]}`;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if(prior.week!==8){
  if(prior.week!==7)throw Error('Expected Week 7 before importing Week 8.');
  if(!fs.existsSync('data/team-performance-week-7.js'))fs.copyFileSync('team-performance-data.js','data/team-performance-week-7.js');
}
const award={week:8,phase:'Regular season',complete:true,label:'Week 8 • final results',source:'https://football.fantasysports.yahoo.com/f1/317429?matchup_week=8',scores:raw.matchups.flatMap(m=>m.ids.map((id,i)=>({id:identity[id][0],name:members.find(p=>p.id===identity[id][0]).name,points:m.scores[i]})))};
awards.weeks=awards.weeks.filter(w=>w.week!==8).concat(award).sort((a,b)=>a.week-b.week);
const performance={season:2026,week:8,slots:prior.slots,teams:raw.matchups.flatMap(m=>m.ids.map((id,i)=>({id:identity[id][0],team:identity[id][1],matchup:`${m.ids[0]}&mid2=${m.ids[1]}`,players:m.rosters[i]})))};
require('../team-performance.js').calculateTeamPerformance(performance,awards);
fs.writeFileSync('season-awards-data.js','// Yahoo results through Week 8 verified November 3, 2026; corrections may apply through November 5.\nconst CHQ_SEASON_AWARDS = '+JSON.stringify(awards,null,2)+";\nif(typeof module !== 'undefined') module.exports=CHQ_SEASON_AWARDS;\n");
fs.writeFileSync('team-performance-data.js','// Yahoo Week 8 starters and benches verified November 3, 2026. IR excluded.\n// Bye-week bench scores are zero. First nine players are starters.\nconst CHQ_TEAM_PERFORMANCE = '+JSON.stringify(performance,null,2)+";\nif(typeof module !== 'undefined') module.exports=CHQ_TEAM_PERFORMANCE;\n");
const recaps={
  1:'The older brother backed up the talk. Cousins supplied 28.18, Jacobs added 23.20, and Gesicki chipped in 17.60 as Silence beat Brett by 11.54. Gibbs and Warren combined for 52.10 for DonkeyWoodDean, but Flowers scored zero and Coleman managed 1.40. The featured pick was correct; the closest-game prediction was not. Brett’s best possible lineup from the available roster was 106.34, enough to have flipped the result with several changes.',
  2:'Cook and Higgins did exactly what the preview asked: 58.60 combined points, including Higgins’ 40.50, powered Dillon to a 48.88-point win. Hockenson added 15.80 and Chase Brown supplied 16.10. Nick’s starters topped out at Geno Smith’s 19.00, and even his best possible lineup would have reached only 92.30. Correct winner, considerably less drama than the predicted second-closest game.',
  3:'The Swami said this would not be particularly close. That part was right; the winner was not. Chase scored 34.10, Swift added 27.90, and Fannin supplied 26.40 as Chris posted the week’s highest score and beat Mels by 49.40. Burrow’s 45.48 could not cover for a 34.50 total from Bijan, Henry, and Kyren. Mels has now lost three straight. Chris won despite a 20.11-point projected deficit.',
  4:'The running backs the Swami questioned supplied another reminder that predictions are harder before the games. Pollard scored 31.70, Wilson added 29.80, and Puka delivered 25.00 in Daniel’s 31.86-point win. Allgeier’s 39.10 stayed on the bench, so Dan still had another gear available. Tuten’s 32.90 and JSN’s 26.80 kept Gotham scoring, but Lamar’s zero hurt. Keenan Allen finished with 13.70. Picking Gotham was the wrong call.',
  8:'The lock of the week immediately became evidence against the person who made it. Mahomes (28.44) and Bowers (28.20) helped Mark overcome the running-back byes and beat West Coast by 4.32. Irving’s 24.00 and Love’s 22.52 kept Dusty close. Starting Downs for Washington would have added 8.70 and turned the loss into a 4.38-point win. Mark used his best possible lineup and won as a 17.13-point underdog.',
  10:'Slim won by 27.94 behind Braelon Allen’s 26.30, Golden’s 20.90, and 20.00 from the Jaguars defense. Josh Allen and Hubbard combined for 52.46 for Mick, but Cooper’s zero and Myers’ 2.70 left too much to cover. Douglas scored 16.60 on the bench; even Mick’s best possible 137.66 would have finished 6.64 short. The Slim pick landed, although this was not one of the week’s closest finishes.'
};
const week=swami.weeks.find(w=>w.week===8);
if(!week||week.picks.length!==6)throw Error('Expected six original Week 8 picks.');
for(const pick of week.picks){
  const match=raw.matchups.find(m=>m.ids.every(id=>pick.teams.includes(identity[id][1])));
  if(!match)throw Error('Unmatched original prediction.');
  pick.scores=pick.teams.map(name=>match.scores[match.ids.findIndex(id=>identity[id][1]===name)]);
  pick.finalOriginalProjections=pick.teams.map(name=>match.originalProjections[match.ids.findIndex(id=>identity[id][1]===name)]);
  pick.winner=identity[match.ids[match.scores[0]>match.scores[1]?0:1]][1];
  pick.source=source(match);pick.recap=recaps[match.ids[0]];
}
week.editorialNote='Original Week 8 picks and wording are preserved. Final scores, original projections, starters, and benches checked on Yahoo November 3, 2026; stat corrections may apply through November 5. Week 7 had no submitted picks and remains excluded.';
week.summary='Week 8: 3–3 (50.0%). Silence of the Lamb, Dillon’s Team, and Slim Pickens delivered. Chris and Daniel won against the picks, while Mark beat the West Coast lock. Season record: 21–15 (58.3%), with Weeks 1 and 7 excluded.';
week.verified='November 3, 2026';
fs.writeFileSync('data/swami-picks.json',JSON.stringify(swami,null,2)+'\n');
const card=(id,title,headline,stats,note,match)=>`<section class="weekly-card" aria-labelledby="${id}-heading"><div class="category"><h3 id="${id}-heading">${title}</h3></div><p class="result-title">${headline}</p><dl>${stats.map(([a,b])=>`<div class="weekly-stat"><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl><p class="result-note">${note}</p><a class="source-link" href="${escape(source(match))}">View matchup on Yahoo →</a></section>`;
const closest=raw.matchups.find(m=>m.ids[0]===8),upset=raw.matchups.find(m=>m.ids[0]===3),bench=raw.matchups.find(m=>m.ids[0]===4);
const intro=`<div class="weekly-heading"><div><div class="eyebrow">October 27–November 2, 2026</div><h2 id="weekly-highlights">Week 8 Highlights</h2></div><p class="status">Week 8 • Final results</p></div>
<p class="recap-note">Week 8 is complete. Scores, final original projections, starters, and benches verified on Yahoo November 3. Stat corrections may apply through November 5. Upsets use Yahoo’s final displayed original projections. Bye-week players score zero; IR players are excluded from lineup efficiency.</p>
<div class="weekly-grid">
${card('closest','Closest Matchup','Mark breaks the West Coast lock by 4.32',[['Matchup','Mark’s Team vs. West Coast'],['Final score','Mark 128.44 • Dusty 124.12'],['Winning margin','4.32 points']],'Mahomes and Bowers combined for 56.64, helping Mark survive the running-back byes and the Swami’s lock against him. Dusty had the answer on the bench: Downs’ 12.30 instead of Washington’s 3.60 would have produced 132.82 and a 4.38-point win. Mark left no points behind from his available roster.',closest)}
${card('upset','Biggest Upset','Chris wins by 49.40 as a 20.11-point underdog',[['Yahoo’s final original projections','Chris’s Team 119.08 • Mels-16 139.19'],['Final score','Chris 170.98 • Mels 121.58'],['Underdog deficit','20.11 projected points']],'A projected 20.11-point defeat became a 49.40-point win: a 69.51-point swing. Chase, Swift, and Fannin combined for 88.40, and Chris led the league in scoring. Burrow’s 45.48 could not save Mels from a third straight loss. Mark also won as a projected underdog, but his deficit was the smaller 17.13.',upset)}
${card('bench','Worst Bench Decision','Allgeier’s 39.10 sits behind Jones’ 6.00',[['Owner &amp; benched player','Dan E • Tyler Allgeier'],['Bench vs. starter','Allgeier 39.10 • Aaron Jones Sr. 6.00'],['Missed points from one eligible swap','33.10 points']],'The biggest single eligible upgrade belonged to Daniel, who won anyway. Allgeier for Jones would have lifted 160.46 to 193.56. With the full lineup optimized, Dan could have reached 203.76. Dusty’s smaller mistake changed a result: Downs for Washington would have flipped the week’s closest matchup.',bench)}
</div>
<section class="season-awards" aria-labelledby="week-8-results-heading"><div class="eyebrow">Around the league</div><h2 id="week-8-results-heading">Week 8 Results</h2><p class="recap-note">Chris led the week with 170.98, earning his first weekly high-score win this season. Brett’s Week 5 mark of 206.74 remains the season high.</p><div class="week-results">${raw.matchups.map(m=>{const names=m.ids.map(id=>identity[id][1]);return `<article><h3>${names.join(' vs. ')}</h3><p><strong>${m.scores.map(n=>n.toFixed(2)).join(' – ')}</strong> • Winner: ${names[m.scores[0]>m.scores[1]?0:1]}</p><p class="result-note">${recaps[m.ids[0]]}</p><a class="source-link" href="${escape(source(m))}">View on Yahoo →</a></article>`;}).join('\n')}</div></section>
<p class="recap-note"><strong>Commish Swami Sez: 3–3 this week; 21–15 for the season (58.3%).</strong> Weeks 1 and 7 are excluded. <a href="matchup.html#swami-heading">See the original picks and final report cards →</a></p>
`;
let html=fs.readFileSync('weekly-updates.html','utf8');
const start=html.indexOf('<div class="weekly-heading">',html.indexOf('<!-- WEEKLY JUMPS END -->')),end=html.indexOf('<!-- ALL-PLAY RECORDS START -->',start);
if(start<0||end<0)throw Error('Missing current recap boundaries.');
const old=html.slice(start,end);
html=html.slice(0,start)+intro+html.slice(end);
if(!old.includes('Week 8 Highlights')){
  const archived=old.replace('id="weekly-highlights"','id="week-7-highlights"').replace(/\b(closest|upset|bench)-heading\b/g,'week-7-$1-heading');
  html=html.replace(' id="weekly-archives"','');
  const target='<details class="season-awards"><summary>Week 6 recap archive';
  if(!html.includes(target))throw Error('Missing Week 6 recap archive.');
  html=html.replace(target,`<details class="season-awards" id="weekly-archives"><summary>Week 7 recap archive</summary>${archived}</details>\n${target}`);
}
fs.writeFileSync('weekly-updates.html',html);
console.log('Week 8 results imported; original picks preserved and graded 3–3.');
