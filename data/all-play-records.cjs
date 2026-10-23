function calculateAllPlay(data, teams) {
  const ids=new Set(teams.map(t=>t.id));
  if(ids.size!==teams.length||teams.length<2)throw Error('Expected unique teams for all-play records.');
  const weeks=data.weeks.filter(w=>w.complete).sort((a,b)=>a.week-b.week);
  if(new Set(weeks.map(w=>w.week)).size!==weeks.length)throw Error('Duplicate completed week.');
  const rows=teams.map(t=>({id:t.id,name:t.team,records:[],wins:0,losses:0,ties:0}));
  for(const week of weeks){
    if(week.scores.length!==ids.size||new Set(week.scores.map(s=>s.id)).size!==ids.size||week.scores.some(s=>!ids.has(s.id)||!Number.isFinite(s.points)))throw Error('Missing or invalid scores in Week '+week.week);
    const scores=new Map(week.scores.map(s=>[s.id,Math.round(s.points*100)]));
    for(const row of rows){
      const record={week:week.week,wins:0,losses:0,ties:0};
      for(const [id,points] of scores){
        if(id===row.id)continue;
        const result=scores.get(row.id)-points;
        if(result>0)record.wins++;else if(result<0)record.losses++;else record.ties++;
      }
      row.records.push(record);row.wins+=record.wins;row.losses+=record.losses;row.ties+=record.ties;
    }
  }
  rows.sort((a,b)=>(b.wins+b.ties/2)-(a.wins+a.ties/2)||a.name.localeCompare(b.name));
  return {season:data.season,weeks:weeks.map(w=>w.week),rows};
}
const recordLabel=r=>`${r.wins}-${r.losses}${r.ties?'-'+r.ties:''}`;
module.exports={calculateAllPlay,recordLabel};
