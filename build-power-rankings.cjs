const fs = require('node:fs');
const { render } = require('../power-rankings.js');
const data = JSON.parse(fs.readFileSync('data/power-rankings.json', 'utf8'));
data.editions.sort((a, b) => a.season - b.season || a.week - b.week);
const seen = new Set();
for (const edition of data.editions) {
  const key = `${edition.season}-${edition.week}`;
  if (seen.has(key)) throw Error(`Duplicate ranking edition: ${key}`);
  seen.add(key);
  if (edition.teams.length !== 12 || new Set(edition.teams.map(t => t.id)).size !== 12) throw Error(`Expected 12 unique teams: ${key}`);
}
const latest = data.editions.at(-1);
const previous = data.editions.at(-2)?.season === latest.season ? data.editions.at(-2) : undefined;
const base = fs.readFileSync('weekly-updates.html', 'utf8');
const nav = base.match(/<nav class="nav"[\s\S]*?<\/nav>/)[0].replace('href="weekly-updates.html" class="active-nav" aria-current="page"', 'href="weekly-updates.html"').replace('href="power-rankings.html"', 'href="power-rankings.html" class="active-nav" aria-current="page"');
const styles = base.match(/<style>[\s\S]*?<\/style>/)[0];
const note = previous ? `Movement since ${previous.label.toLowerCase()}.` : 'First edition • Everyone starts even.';
fs.writeFileSync('power-rankings-data.js', `// Generated from data/power-rankings.json.\nwindow.POWER_RANKINGS = ${JSON.stringify(data)};\n`);
fs.writeFileSync('power-rankings.html', `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CHQ Fantasy Keeper League — Power Rankings</title>
${styles}
<link rel="stylesheet" href="mobile-nav.css"><link rel="stylesheet" href="power-rankings.css">
<script src="mobile-nav.js" defer></script><script src="power-rankings-data.js" defer></script><script src="power-rankings.js" defer></script>
</head><body><header><div class="container">${nav}
<div class="hero"><div class="kicker">The Commish has spoken</div><h1>POWER RANKINGS</h1><p>Twelve teams. One very opinionated list. The weekly pecking order, straight from the Commish.</p></div></div></header>
<main class="container rankings-content"><div class="rankings-toolbar"><label for="ranking-edition">Edition<select id="ranking-edition">${data.editions.map((e,i)=>`<option value="${i}"${e===latest?' selected':''}>${e.season} · ${e.label}</option>`).reverse().join('')}</select></label><p id="edition-note" aria-live="polite">${note}</p></div>
<p class="legend"><span><span class="movement up">+1</span> Moved up</span><span><span class="movement down">-1</span> Moved down</span><span><span class="movement even">— Even</span> No change</span></p>
<ol class="rankings-list" id="rankings">${render(latest,previous)}</ol>
<noscript><p>The latest rankings are shown. Enable JavaScript to browse earlier editions.</p></noscript></main>
<footer>CHQ FANTASY KEEPER LEAGUE · EST. 2020</footer></body></html>`);
console.log('Power rankings generated with weekly movement and edition archive.');
