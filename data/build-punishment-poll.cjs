const fs=require('node:fs');
const {renderNavigation}=require('./navigation.cjs');
// Keep the voting and commissioner pages in the site's existing visual system.
const base=fs.readFileSync('weekly-updates.html','utf8');
const style=base.match(/<style>[\s\S]*?<\/style>/)[0];
const nav=renderNavigation('punishment-poll.html');
function page(admin){return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${admin?'Commissioner Controls':'Punishment Bracket'} | CHQ Fantasy</title>
${style}<link rel="stylesheet" href="mobile-nav.css"><link rel="stylesheet" href="punishment-poll.css">
${admin?'<meta name="robots" content="noindex,nofollow">':''}<script src="mobile-nav.js" defer></script><script src="punishment-poll-config.js" defer></script><script type="module" src="punishment-poll.mjs"></script></head>
<body${admin?' data-poll-admin="true"':''}><header><div class="container">${nav}<div class="hero page-hero"><div class="kicker">${admin?'THE COMMISH IS IN CONTROL':'THE LEAGUE DECIDES'}</div><h1>${admin?'BRACKET CONTROL':'PUNISHMENT BRACKET'}</h1><p>${admin?'Open voting. Settle ties. Send the winners through.':'Eight questionable ways to spend a day. Help decide which one awaits the league’s last-place finisher.'}</p></div></div></header>
<main class="container poll-content"><div class="poll-intro"><div><div class="eyebrow">The road to last place</div><h2 id="poll-round-title">Eight punishments. One unlucky champion.</h2><p>Quarterfinals → Semifinals → The final</p></div><span class="poll-status" id="poll-status">Bracket preview</span></div>
<section class="poll-access" aria-labelledby="poll-access-heading"><h3 id="poll-access-heading">${admin?'Commissioner access':'Your vote. Their problem.'}</h3><p class="poll-muted">${admin?'Use your private commissioner key. Keep it separate from owner voting codes.':'Enter the private voting code supplied by the commissioner. One vote per matchup; change your pick until voting closes.'}</p>
<form class="poll-form" id="poll-access-form"><label for="poll-code">${admin?'Commissioner key':'Owner voting code'}<input id="poll-code" type="password" required autocomplete="off" spellcheck="false" maxlength="256"></label><button class="poll-button" id="poll-submit" type="submit">${admin?'Unlock controls':'Unlock voting'}</button></form>
<div id="poll-connected" hidden><p class="poll-muted">${admin?'Commissioner controls are unlocked.':'Your private ballot is unlocked. Your identity is not shown on the bracket.'}</p><button id="poll-signout" class="poll-button secondary" type="button">Sign out</button></div>
<p class="poll-message" id="poll-message" role="status" aria-live="polite"></p><button id="poll-refresh" class="poll-button secondary" type="button">Refresh bracket</button></section>
${admin?'<section class="poll-admin-panel" id="poll-admin-controls" hidden><h3>Round controls</h3><p class="poll-muted" id="poll-admin-note"></p><div class="poll-ties" id="poll-ties"></div><div class="poll-actions" id="poll-admin-actions"></div></section>':''}
<section class="poll-champion" id="poll-champion" hidden></section><div class="poll-bracket" id="poll-bracket" aria-label="Punishment tournament bracket"></div>
<section class="poll-rules"><h3>The bracket rules</h3><ul><li>Opening matchups follow the order of the league’s eight suggestions.</li><li>Each owner gets one vote per matchup. You can change it while the round is open.</li><li>Vote totals appear when the commissioner closes the round.</li><li>The commissioner settles ties and advances the winners.</li><li>Vote on the concept. The league will agree on the exact rules, timing, and arrangements before the punishment is carried out.</li></ul></section>
<noscript><p class="poll-muted">Enable JavaScript to view the bracket and vote.</p></noscript></main><footer>CHQ FANTASY KEEPER LEAGUE · EST. 2020</footer></body></html>`;}
fs.writeFileSync('punishment-poll.html',page(false));
fs.writeFileSync('punishment-poll-admin.html',page(true));
console.log('Punishment bracket and commissioner pages generated.');
