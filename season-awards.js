function calculateSeasonAwards(data) {
  const totals = new Map(), performances = [], unresolved = [], seen = new Set();
  for (const week of data.weeks) {
    if (seen.has(week.week)) throw Error('Duplicate week');
    seen.add(week.week);
    const ids = new Set();
    if (!week.scores.length) throw Error('Missing weekly scores');
    for (const s of week.scores) {
      if (!s.id || ids.has(s.id) || !Number.isFinite(s.points)) throw Error('Invalid score');
      ids.add(s.id);
      if (!totals.has(s.id)) totals.set(s.id,{name:s.name,wins:0,sum:0,weeks:[]});
    }
    if (!week.complete) continue;
    const rows = week.scores.map(s=>({...s,cents:Math.round(s.points*100),week:week.week,phase:week.phase}));
    performances.push(...rows);
    const high = Math.max(...rows.map(s=>s.cents));
    let winners = rows.filter(s=>s.cents===high);
    if (winners.length>1) {
      if (!week.creditedWinnerIds?.length) { unresolved.push(week.week); continue; }
      if (new Set(week.creditedWinnerIds).size!==week.creditedWinnerIds.length || week.creditedWinnerIds.some(id=>!winners.some(s=>s.id===id))) throw Error('Invalid tie credit');
      winners = winners.filter(s=>week.creditedWinnerIds.includes(s.id));
    }
    for (const s of winners) {
      const row = totals.get(s.id);
      row.wins++; row.sum+=s.cents; row.weeks.push(week.week);
    }
  }
  const rankings = [...totals.values()].map(r=>({...r,average:r.wins?r.sum/r.wins/100:null}));
  rankings.sort((a,b)=>b.wins-a.wins || (b.average??0)-(a.average??0) || a.name.localeCompare(b.name));
  let last;
  rankings.forEach((r,i)=>{r.rank=last && r.wins===last.wins && r.sum===last.sum?last.rank:i+1;last=r;});
  const max = performances.length?Math.max(...performances.map(s=>s.cents)):null;
  return {highest:performances.filter(s=>s.cents===max),rankings,unresolved,
    completed:data.weeks.filter(w=>w.complete).length,pending:data.weeks.filter(w=>!w.complete)};
}
if (typeof module !== 'undefined') module.exports = {calculateSeasonAwards};
if (typeof document !== 'undefined') {
  const result = calculateSeasonAwards(CHQ_SEASON_AWARDS);
  const add = (parent,tag,text,cls) => {
    const el=document.createElement(tag); el.textContent=text;
    if(cls)el.className=cls; parent.appendChild(el); return el;
  };
  const high=document.getElementById('season-high-score'); high.replaceChildren();
  if(!result.highest.length)add(high,'p','No completed weeks yet.');
  for(const s of result.highest){
    add(high,'p',`${s.name} — ${s.points.toFixed(2)} points`,'result-title');
    add(high,'p',`Week ${s.week} • ${s.phase}`);
  }
  document.getElementById('season-award-progress').textContent=`${CHQ_SEASON_AWARDS.season} season • ${result.completed} completed weeks counted`;
  const pending=document.getElementById('season-award-pending');
  for(const w of result.pending){
    const max=Math.max(...w.scores.map(s=>s.points));
    const names=w.scores.filter(s=>s.points===max).map(s=>s.name).join(' / ');
    add(pending,'p',`${w.label}: ${names} leads with ${max.toFixed(2)} points in this snapshot. Not yet counted toward either award.`);
  }
  if(result.unresolved.length)add(pending,'p',`Weekly high-score ties awaiting commissioner ruling: ${result.unresolved.join(', ')}. Those weekly wins are not yet credited.`);
  const list=document.getElementById('weekly-win-standings');list.replaceChildren();
  for(const r of result.rankings.filter(r=>r.wins>0)){
    const item=add(list,'li','');add(item,'h4',`${r.rank}. ${r.name}`);
    add(item,'p',`${r.wins} high-score ${r.wins===1?'week':'weeks'} • Winning-week average: ${r.average.toFixed(2)}`);
    add(item,'p',`Winning weeks: ${r.weeks.join(', ')}`);
  }
  if(!list.children.length)add(list,'li','No weekly high-score wins awarded yet.');
}
