const fs=require('node:fs');
const data=require('./swami-picks.json');
const week=data.weeks.slice().sort((a,b)=>b.week-a.week)[0];
const pick=week?.picks.find(p=>p.featured);
if(!pick)return;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pending=pick.winner===null;
const title=pending?`WEEK ${week.week} FEATURED MATCHUP • THE COMMISH’S PICK`:`WEEK ${week.week} FEATURED MATCHUP • FINAL RESULT`;
const feature=`<section class="matchup-feature"><div class="matchup-label">${title}</div><div class="matchup-teams">${pick.teams.map((team,i)=>`${i?'<div class="matchup-vs">VS</div>':''}<div class="matchup-team"><h2>${escape(team.toUpperCase())}</h2><div class="matchup-record">${pending?'Week '+week.week:team===pick.winner?'Winner':'Final result'}</div>${!pending&&pick.scores?`<div class="team-projection">${pick.scores[i].toFixed(2)} points</div>`:''}</div>`).join('')}</div><div class="projection-callout"><div><span>${pending?'PREDICTED WINNER':'FINAL WINNER'}</span><strong>${escape(pending?pick.pick:pick.winner)}</strong></div><div class="projection-note">${pending?'Prediction • Results pending':'Original Swami pick: '+escape(pick.pick)}</div></div><div class="matchup-sections"><div class="matchup-panel full-width"><h3>The Commish’s Notes</h3><p>${escape(pick.comment)}</p>${pick.recap?`<p>${escape(pick.recap)}</p>`:''}</div></div></section>`;
const start='<!-- MATCHUP FEATURE:START -->',end='<!-- MATCHUP FEATURE:END -->';
let html=fs.readFileSync('matchup.html','utf8');
if(html.includes(start))html=html.slice(0,html.indexOf(start))+start+'\n'+feature+'\n'+end+html.slice(html.indexOf(end)+end.length);
else{
  const old=html.match(/<section class="matchup-feature">[\s\S]*?<\/section>/);
  if(!old)throw Error('Featured matchup not found.');
  html=html.replace(old[0],`${start}\n${feature}\n${end}\n<details class="swami-section"><summary>Week 6 featured matchup archive • Beast Infection vs. Daniel’s Primo Team</summary>${old[0]}</details>`);
}
html=html.replace(/<div class="kicker">WEEKLY FEATURE • WEEK \d+ (?:RESULTS|PICKS)<\/div>/,`<div class="kicker">WEEKLY FEATURE • WEEK ${week.week} ${pending?'PICKS':'RESULTS'}</div>`);
html=html.replace(/(<h1>MATCHUP OF THE WEEK<\/h1>\s*)<p>[\s\S]*?<\/p>/,`$1<p>${escape(pick.teams.join(' vs. '))}</p>`);
fs.writeFileSync('matchup.html',html);
