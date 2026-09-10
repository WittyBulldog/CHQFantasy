const fs=require('node:fs');
const base=fs.readFileSync('records.html','utf8');
let prefix=base.slice(0,base.indexOf('<main'));
prefix=prefix.replace('CHQ Fantasy Keeper League — RECORDS & LEADERS','CHQ Fantasy Keeper League — Career Records');
prefix=prefix.replace('<h1>RECORDS & LEADERS</h1>','<h1>CAREER <em>RECORDS</em></h1>').replace('See the all-time money leaderboard and the records built across every season.','Every season. Every rival. Regular-season records from 2020–2025.');
prefix=prefix.replace('href="records.html" class="active-nav" aria-current="page"','href="records.html"');
prefix=prefix.replace('</head>','<link rel="stylesheet" href="career.css">\n<meta name="description" content="CHQ Fantasy Keeper League career standings and head-to-head records for all 15 members, covering 2020–2025 regular seasons.">\n<script src="data/career-data.js" defer></script>\n<script src="career-stats.js" defer></script>\n<script src="career-page.js" defer></script>\n</head>');
const main=`<main class="container career-main">
<noscript><p class="notice">Enable JavaScript to explore the career standings and matchup records.</p></noscript>
<p id="load-error" class="notice" hidden>The records could not load. Please refresh the page.</p>
<div id="career-content">
<section aria-labelledby="standings-title">
<div class="career-toolbar"><div><div class="eyebrow">Regular season archive</div><h2 id="standings-title">Career standings</h2><p id="summary" aria-live="polite"></p></div>
<div class="filters"><label>Season<select id="season"><option value="all">All seasons</option><option>2025</option><option>2024</option><option>2023</option><option>2022</option><option>2021</option><option>2020</option></select></label><label>Sort by<select id="sort"><option value="wins">Most wins</option><option value="pct">Win percentage</option><option value="pf">Points for</option><option value="pa">Points against</option></select></label></div></div>
<p class="table-help">Select a member to explore their opponent records. Swipe tables sideways on smaller screens.</p>
<div class="table-scroll" role="region" aria-label="Career standings" tabindex="0"><table class="career-table"><caption class="sr-only">Regular-season standings. Records are wins, losses, ties.</caption><thead><tr><th scope="col">Rank</th><th scope="col">Member</th><th scope="col">Seasons</th><th scope="col">W–L–T</th><th scope="col">Win %</th><th scope="col">Points for</th><th scope="col">Points against</th></tr></thead><tbody id="standings"></tbody></table></div>
</section>
<section id="head-to-head" aria-labelledby="h2h-title">
<div class="career-toolbar"><div><div class="eyebrow">The rivalry ledger</div><h2 id="h2h-title">Head-to-head</h2><p id="member-years"></p></div><div class="filters"><label>Member<select id="member"></select></label><label>Opponent<select id="opponent"></select></label></div></div>
<div class="series"><strong id="series-record"></strong><span id="series-caption" aria-live="polite"></span></div>
<div class="table-scroll" role="region" aria-label="Records against each opponent" tabindex="0"><table class="career-table"><caption class="sr-only">Records from the selected member's perspective. A dash means no meetings in the selected season range.</caption><thead><tr><th scope="col">Opponent</th><th scope="col">W–L–T</th><th scope="col">Win %</th><th scope="col">Points for</th><th scope="col">Points against</th></tr></thead><tbody id="opponent-records"></tbody></table></div>
<p class="table-help">A dash means no meetings in this season range. Select an opponent to filter the game history.</p>
</section>
<section id="game-history" aria-labelledby="history-title"><h2 id="history-title">Game history</h2><p class="table-help">Scores and results are shown from the selected member's perspective, most recent first.</p><p id="no-games" class="notice" hidden>No matchups for this selection.</p>
<div class="table-scroll" role="region" aria-label="Individual matchup results" tabindex="0"><table class="career-table"><thead><tr><th scope="col">Season</th><th scope="col">Week</th><th scope="col">Opponent</th><th scope="col">Result</th><th scope="col">Score</th><th scope="col">Source</th></tr></thead><tbody id="games"></tbody></table></div>
</section>
<p class="archive-note">Includes completed regular seasons from 2020–2025: 13 weeks in 2020 and 14 weeks in each later season. Playoffs, consolation games and byes are excluded. Former members remain in the archive; records follow people across team-name changes. Win percentage counts a tie as half a win. Yahoo source links may require sign-in. This archive is updated manually.</p>
</div></main><footer class="career-footer container">CHQ FANTASY KEEPER LEAGUE · EST. 2020</footer></body></html>`;
fs.writeFileSync('career.html',prefix+main);
for(const file of fs.readdirSync('.').filter(f=>f.endsWith('.html'))){let html=fs.readFileSync(file,'utf8');if(!html.includes('href="career.html"'))html=html.replace(/(<a href="records\.html"[^>]*>Records<\/a>)/,'$1\n        <a href="career.html"'+(file==='career.html'?' class="active-nav" aria-current="page"':'')+'>Career Records</a>');fs.writeFileSync(file,html);}
console.log('Career page created; navigation updated across the site.');
