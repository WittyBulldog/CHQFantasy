// Shared by the static page builder and the edition selector.
(function (root) {
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render(edition, previous) {
    const prior = new Map((previous?.teams || []).map((team, index) => [team.id, index + 1]));
    return edition.teams.map((team, index) => {
      const rank = index + 1;
      const displayRank = team.displayRank ?? String(rank).padStart(2, '0');
      const oldRank = prior.get(team.id);
      const delta = oldRank === undefined ? 0 : oldRank - rank;
      const state = delta > 0 ? 'up' : delta < 0 ? 'down' : 'even';
      const label = previous && oldRank === undefined ? 'New' : delta > 0 ? `+${delta}` : delta < 0 ? String(delta) : '— Even';
      const accessible = delta ? `${delta > 0 ? 'Up' : 'Down'} ${Math.abs(delta)} ${Math.abs(delta) === 1 ? 'place' : 'places'}` : label;
      return `<li><article class="ranking-card${team.displayRank ? ' custom-rank' : ''}"><div class="ranking-number" aria-label="Rank ${escape(displayRank)}">${escape(displayRank)}</div><div class="ranking-copy"><div class="ranking-title"><h2>${escape(team.name)}</h2><span class="movement ${state}" aria-label="${escape(accessible)}">${label}</span></div><p>${escape(team.comment)}</p></div></article>${team.breakAfter ? `<p class="tier-break">${escape(team.breakAfter)}</p>` : ''}</li>`;
    }).join('\n');
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { render };
  else {
    const editions = root.POWER_RANKINGS.editions;
    const select = document.getElementById('ranking-edition');
    select.addEventListener('change', () => {
      const index = Number(select.value);
      const edition = editions[index];
      const previous = editions[index - 1]?.season === edition.season ? editions[index - 1] : undefined;
      document.getElementById('rankings').innerHTML = render(edition, previous);
      document.getElementById('edition-note').textContent = previous ? `Movement since ${previous.label.toLowerCase()}.` : 'First edition • Everyone starts even.';
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
