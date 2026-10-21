const GROUPS = [
  {label:'This Week',links:[['weekly-updates.html','Weekly Updates'],['matchup.html','Matchup of the Week'],['power-rankings.html','Power Rankings']]},
  {label:'League',links:[['players.html','Players'],['rules.html','Rules'],['payouts.html','Payouts']]},
  {label:'Records & History',links:[['records.html','Records'],['career.html','Career Records'],['history.html','History']]},
  // Add the punishment poll here when its separate publication is approved.
  {label:'League Fun',links:[['quotes.html','Quotes']]}
];
const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;');
function renderNavigation(page) {
  const link=([url,label])=>`<a href="${url}"${url===page?' class="active-nav" aria-current="page"':''}>${escape(label)}</a>`;
  return `<nav class="nav" aria-label="Main navigation">
  <div class="brand">CHQ <span>FANTASY</span> KEEPER LEAGUE</div>
  <button class="nav-toggle" type="button" aria-controls="site-navigation" aria-expanded="false" aria-label="Open navigation menu" hidden>
    <span class="nav-toggle-icon" aria-hidden="true"><span></span></span><span>Menu</span>
  </button>
  <div class="navlinks" id="site-navigation">
    ${link(['index.html','Home'])}
    ${GROUPS.map(group=>`<details class="nav-group${group.links.some(([url])=>url===page)?' active-group':''}"><summary>${escape(group.label)}<span class="nav-chevron" aria-hidden="true"></span></summary><div class="nav-submenu">${group.links.map(link).join('\n')}</div></details>`).join('\n')}
  </div>
</nav>`;
}
module.exports={GROUPS,renderNavigation};
