const fs = require('node:fs');
const path = require('node:path');
const data = require('./swami-picks.json');
// Append each week's picks; set winner to a listed team after the final result,
// or "tie" for a tied matchup. Leave null while pending. Keep past weeks.
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const weeks = data.weeks.filter(w => w.week >= Math.max(2, data.startWeek)).sort((a,b) => b.week-a.week);
const totals = {correct:0, incorrect:0, ties:0, pending:0};
function result(p) {
  if (!p.teams.includes(p.pick) || (p.winner !== null && p.winner !== 'tie' && !p.teams.includes(p.winner))) throw Error('Invalid Swami pick or winner');
  return p.winner === null ? 'pending' : p.winner === 'tie' ? 'ties' : p.winner === p.pick ? 'correct' : 'incorrect';
}
for (const week of weeks) for (const pick of week.picks) totals[result(pick)]++;
const graded = totals.correct + totals.incorrect;
const labels = {correct:'Correct', incorrect:'Incorrect', ties:'Tie', pending:'Pending'};
const output = `<section class="swami-section" aria-labelledby="swami-heading">
  <div class="swami-heading"><div class="kicker">THE COMMISH'S WEEKLY PICKS • ${escape(data.season)}</div>
  <h2 id="swami-heading">Commish Swami Sez</h2>
  <p>A little Swami spirit. A lot of league trash talk. Let's see if the Commish can back it up.</p></div>
  <dl class="swami-totals" aria-label="Season prediction totals">
    <div><dt>Season record</dt><dd>${totals.correct}–${totals.incorrect}${totals.ties ? '–'+totals.ties : ''}</dd></div>
    <div><dt>Accuracy</dt><dd>${graded ? (100*totals.correct/graded).toFixed(1)+'%' : '—'}</dd></div>
    <div><dt>Correct picks</dt><dd>${totals.correct}</dd></div>
    <div><dt>Pending</dt><dd>${totals.pending}</dd></div>
  </dl>
  <p class="swami-note">Season tracking starts with Week 2; Week 1 is excluded. Only matchup winners count toward the record, including the featured pick above. Score margins and player predictions are for bragging rights. Ties are excluded from accuracy; pending picks are not graded.</p>
  ${weeks.map(w => `<h3 class="swami-week">Week ${w.week} predictions</h3><div class="swami-grid">${w.picks.map(p => `<article class="matchup-panel"><span class="swami-status">${labels[result(p)]}</span><h4>${p.teams.map(escape).join(' vs. ')}</h4><p class="swami-winner">Swami sez: ${escape(p.pick)}</p><p>${escape(p.comment)}</p>${p.winner !== null ? `<p>Final result: ${escape(p.winner)}</p>` : ''}</article>`).join('\n')}</div>`).join('\n')}
</section>`;
const file = path.join(__dirname, '..', 'matchup.html');
const html = fs.readFileSync(file,'utf8');
const marker = /<!-- SWAMI:START -->[\s\S]*?<!-- SWAMI:END -->/;
if (!marker.test(html)) throw Error('Missing Swami section markers');
fs.writeFileSync(file, html.replace(marker, `<!-- SWAMI:START -->\n${output}\n<!-- SWAMI:END -->`));
console.log(`Swami totals: ${totals.correct} correct, ${totals.incorrect} incorrect, ${totals.ties} ties, ${totals.pending} pending.`);
