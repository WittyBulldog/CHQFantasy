const fs=require('node:fs'),{createHash}=require('node:crypto');
const {calculateAllPlay,recordLabel}=require('./all-play-records.cjs');
const standings=calculateAllPlay(require('../season-awards-data.js'),require('../team-performance-data.js').teams);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const start='<!-- ALL-PLAY RECORDS START -->',end='<!-- ALL-PLAY RECORDS END -->';
const section=`${start}
<section class="season-awards all-play" aria-labelledby="all-play-heading">
  <div class="eyebrow">Everyone against everyone</div><h2 id="all-play-heading">Weekly Record vs All Teams</h2>
  <p class="recap-note" id="all-play-description">Your score against every other team in the same week, regardless of your scheduled opponent. Records are wins–losses; a third number appears for ties. Completed weeks only. Sorted by total wins (ties count as half a win); equal records are listed alphabetically.</p>
  ${standings.weeks.length?`<p class="all-play-scroll-note" id="all-play-scroll-note">On smaller screens, scroll across to see every week and the total.</p>
  <div class="all-play-scroll" role="region" aria-labelledby="all-play-heading" aria-describedby="all-play-scroll-note" tabindex="0">
  <table class="all-play-table" aria-describedby="all-play-description"><caption>${standings.season} season • Through Week ${standings.weeks.at(-1)}</caption>
    <thead><tr><th scope="col" rowspan="2">Team Name</th><th scope="colgroup" colspan="${standings.weeks.length}">Week</th><th scope="col" rowspan="2" class="all-play-total">Total</th></tr><tr>${standings.weeks.map(w=>`<th scope="col">${w}</th>`).join('')}</tr></thead>
    <tbody>${standings.rows.map(row=>`<tr><th scope="row">${escape(row.name)}</th>${row.records.map(r=>`<td>${recordLabel(r)}</td>`).join('')}<td class="all-play-total"><strong>${recordLabel(row)}</strong></td></tr>`).join('\n')}</tbody>
  </table></div>`:'<p class="recap-note">Records will appear after the first completed week.</p>'}
</section>
${end}`;
let html=fs.readFileSync('weekly-updates.html','utf8');
if(html.includes(start))html=html.slice(0,html.indexOf(start))+section+html.slice(html.indexOf(end)+end.length);
else{
  const target='  <section class="season-awards team-performance"';
  if(!html.includes(target))throw Error('Missing weekly table insertion point.');
  html=html.replace(target,section+'\n'+target);
}
const version=createHash('sha256').update(fs.readFileSync('all-play-records.css')).digest('hex').slice(0,12);
html=html.replace(/\n<link rel="stylesheet" href="all-play-records\.css[^"\n]*">/g,'');
html=html.replace('</head>',`<link rel="stylesheet" href="all-play-records.css?v=${version}">\n</head>`);
fs.writeFileSync('weekly-updates.html',html);
console.log(`All-play records generated for ${standings.rows.length} teams across ${standings.weeks.length} completed weeks.`);
