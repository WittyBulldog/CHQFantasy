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

function combineTeamPerformance(weeks, awards) {
  const teams=new Map(),seen=new Set();
  for(const data of weeks.slice().sort((a,b)=>a.week-b.week)){
    if(seen.has(data.week)) throw Error('Duplicate performance week.');
    seen.add(data.week);
    for(const row of calculateTeamPerformance(data,awards)){
      const total=teams.get(row.id)||{id:row.id,actualCents:0,possibleCents:0,weeks:[]};
      total.name=row.name;total.team=row.team;
      total.actualCents+=Math.round(row.actual*100);total.possibleCents+=Math.round(row.possible*100);
      total.weeks.push({...row,week:data.week,slots:data.slots});teams.set(row.id,total);
    }
  }
  return Array.from(teams.values(),t=>({...t,actual:t.actualCents/100,possible:t.possibleCents/100,
    missed:(t.possibleCents-t.actualCents)/100,efficiency:t.possibleCents>0?t.actualCents/t.possibleCents*100:null}));
}
if(typeof module!=='undefined') module.exports={calculateTeamPerformance,combineTeamPerformance};
if(typeof document!=='undefined'){
  const list=document.getElementById('performance-list'),sort=document.getElementById('performance-sort'),period=document.getElementById('performance-period');
  const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
  try{
    const weeks=CHQ_TEAM_PERFORMANCE_WEEKS;
    const combined=combineTeamPerformance(weeks,CHQ_SEASON_AWARDS);
    for(const week of weeks){const option=el('option','', 'Week '+week.week);option.value=String(week.week);period.append(option);}
    function render(){
      const selected=weeks.find(w=>String(w.week)===period.value);
      const rows=selected?combined.map(t=>t.weeks.find(w=>w.week===selected.week)).filter(Boolean):combined;
      document.getElementById('performance-week').textContent=selected
        ? 'Week '+selected.week+' • '+selected.season
        : 'All weeks • '+CHQ_SEASON_AWARDS.season+' • '+weeks.length+' completed weeks';
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
        details.append(el('summary','', selected?'View best possible lineup':'View weekly breakdown'));
        const breakdown=selected?[team]:team.weeks;
        for(const entry of breakdown){
          if(!selected) details.append(el('p','performance-points','Week '+entry.week+' • '+entry.actual.toFixed(2)+' / '+entry.possible.toFixed(2)+' points • '+(entry.efficiency===null?'N/A':entry.efficiency.toFixed(1)+'%')));
          const lineup=el('ul','performance-lineup');
          entry.lineup.forEach((p,i)=>{
            const row=el('li','');
            row.append(el('span','performance-slot',entry.slots[i]),el('span','',p.name+(p.index>=entry.slots.length?' • Bench':'')),el('strong','',p.points.toFixed(2)));
            lineup.append(row);
          });
          const source=el('a','source-link','View Week '+entry.week+' roster on Yahoo');
          source.href='https://football.fantasysports.yahoo.com/f1/317429/matchup?week='+entry.week+'&mid1='+entry.matchup;
          details.append(lineup,source);
        }
        body.append(points,bar,metrics,details);item.append(rank,body);list.append(item);
      });
    }
    sort.addEventListener('change',render);period.addEventListener('change',render);render();
  }catch(error){
    list.replaceChildren(el('li','','Team performance is awaiting verified roster data.'));
    sort.disabled=true;period.disabled=true;console.error(error);
  }
}
