function calculateTeamPerformance(data, awards) {
  const week=awards.weeks.find(w=>w.week===data.week);
  if(awards.season!==data.season || !week?.complete) throw Error('Performance requires a matching completed week.');
  const slots=data.slots, cents=n=>Math.round(n*100);
  if(!slots.length || slots.length>16) throw Error('Invalid lineup slots.');
  const eligible=(position,slot)=>position.split('/').some(p=>slot==='W/R/T'?['WR','RB','TE'].includes(p):p===slot);
  const ids=new Set();
  const result=data.teams.map(team=>{
    if(ids.has(team.id)) throw Error('Duplicate team.');
    ids.add(team.id);
    const score=week.scores.find(s=>s.id===team.id);
    const players=team.players.map(([name,position,points],index)=>({name,position,points,index}));
    if(!score || players.length<slots.length || new Set(players.map(p=>p.name)).size!==players.length || players.some(p=>!p.name || !Number.isFinite(p.points) || !slots.some(s=>eligible(p.position,s)))) throw Error('Invalid roster: '+team.id);
    const actual=players.slice(0,slots.length).reduce((sum,p,i)=>{
      if(!eligible(p.position,slots[i])) throw Error('Ineligible starter: '+p.name);
      return sum+cents(p.points);
    },0);
    if(actual!==cents(score.points)) throw Error('Starter scores do not match Yahoo total: '+team.id);
    // Assign players to slot masks. Copy the previous layer to prevent reusing a
    // player in more than one slot. All slots must be filled, even with negatives.
    let dp=new Map([[0,{total:0,lineup:[]}]]);
    for(const player of players){
      const next=new Map(dp);
      for(const [mask,state] of dp) for(let s=0;s<slots.length;s++){
        if((mask & (1<<s)) || !eligible(player.position,slots[s])) continue;
        const key=mask|(1<<s),total=state.total+cents(player.points);
        if(!next.has(key) || total>next.get(key).total){
          const lineup=state.lineup.slice(); lineup[s]=player;
          next.set(key,{total,lineup});
        }
      }
      dp=next;
    }
    const best=dp.get((1<<slots.length)-1);
    if(!best || best.total<actual) throw Error('Invalid optimal lineup.');
    return {...team,name:score.name,actual:actual/100,possible:best.total/100,
      missed:(best.total-actual)/100,efficiency:best.total>0?actual/best.total*100:null,lineup:best.lineup};
  });
  if(result.length!==week.scores.length) throw Error('Missing team rosters.');
  return result;
}

if(typeof module!=='undefined') module.exports={calculateTeamPerformance};
if(typeof document!=='undefined'){
  const list=document.getElementById('performance-list'),sort=document.getElementById('performance-sort');
  const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
  try{
    const rows=calculateTeamPerformance(CHQ_TEAM_PERFORMANCE,CHQ_SEASON_AWARDS);
    document.getElementById('performance-week').textContent=`Week ${CHQ_TEAM_PERFORMANCE.week} • ${CHQ_TEAM_PERFORMANCE.season}`;
    function render(){
      const key=sort.value;
      const ordered=rows.slice().sort((a,b)=>(b[key]??-Infinity)-(a[key]??-Infinity)||b.actual-a.actual||a.name.localeCompare(b.name));
      list.replaceChildren();
      ordered.forEach((team,index)=>{
        const item=el('li','performance-row'),rank=el('span','performance-rank',String(index+1)),body=el('div','performance-body');
        rank.setAttribute('aria-hidden','true');
        body.append(el('h3','',team.team),el('p','performance-owner',team.name));
        const points=el('p','performance-points');
        points.append(el('strong','',team.actual.toFixed(2)),document.createTextNode(` of ${team.possible.toFixed(2)} possible points`));
        const bar=el('div','performance-track'),fill=el('span','performance-fill');
        bar.setAttribute('aria-hidden','true');
        fill.style.width=`${Math.max(0,Math.min(100,team.efficiency??0))}%`;bar.append(fill);
        const metrics=el('p','performance-metrics');
        metrics.append(el('strong','',team.efficiency===null?'Efficiency N/A':`${team.efficiency.toFixed(1)}% efficiency`),el('span','',`${team.missed.toFixed(2)} points left`));
        const details=el('details','performance-details');
        details.append(el('summary','', 'View best possible lineup'));
        const lineup=el('ul','performance-lineup');
        team.lineup.forEach((p,i)=>{
          const row=el('li','');
          row.append(el('span','performance-slot',CHQ_TEAM_PERFORMANCE.slots[i]),el('span','',p.name+(p.index>=CHQ_TEAM_PERFORMANCE.slots.length?' • Bench':'')),el('strong','',p.points.toFixed(2)));
          lineup.append(row);
        });
        const source=el('a','source-link','View roster on Yahoo');
        source.href=`https://football.fantasysports.yahoo.com/f1/317429/matchup?week=${CHQ_TEAM_PERFORMANCE.week}&mid1=${team.matchup}`;
        details.append(lineup,source);body.append(points,bar,metrics,details);item.append(rank,body);list.append(item);
      });
    }
    sort.addEventListener('change',render);render();
  }catch(error){
    list.replaceChildren(el('li','','Team performance is awaiting verified roster data.'));
    sort.disabled=true;console.error(error);
  }
}
