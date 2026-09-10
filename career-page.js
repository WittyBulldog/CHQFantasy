(() => {
 'use strict';
 const data=window.CHQ_CAREER_DATA, stats=window.CareerStats;
 const el=id=>document.getElementById(id);
 if(!data||!stats){el('career-content').hidden=true;el('load-error').hidden=false;return;}
 const names=Object.fromEntries(data.members.map(m=>[m.id,m.name]));
 const record=r=>`${r.wins}–${r.losses}–${r.ties}`;
 const number=n=>n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
 const pct=r=>r.games?`${(r.pct*100).toFixed(1)}%`:'—';
 const option=(id,label)=>{const o=document.createElement('option');o.value=id;o.textContent=label;return o;};
 for(const m of data.members.slice().sort((a,b)=>a.name.localeCompare(b.name)))el('member').append(option(m.id,m.name));
 el('member').value='tylor-c';
 function cell(row,value){const td=document.createElement('td');td.textContent=value;row.append(td);return td;}
 function updateOpponents(){const chosen=el('member').value,prev=el('opponent').value;el('opponent').replaceChildren(option('','All opponents'));for(const m of data.members.filter(m=>m.id!==chosen).sort((a,b)=>a.name.localeCompare(b.name)))el('opponent').append(option(m.id,m.name));if(prev!==chosen)el('opponent').value=prev;}
 function render(){
  const year=el('season').value,chosen=el('member').value,opponent=el('opponent').value;
  const all=stats.summarize(data,year),sort=el('sort').value;
  const sortKey=['wins','pct','pf','pa'].includes(sort)?sort:'wins';
  all.rows.sort((a,b)=>(b[sortKey]-a[sortKey])||b.wins-a.wins||a.losses-b.losses||a.name.localeCompare(b.name));
  el('standings').replaceChildren();
  all.rows.forEach((r,i)=>{const tr=document.createElement('tr');cell(tr,i+1);const td=cell(tr,'');const b=document.createElement('button');b.className='member-link';b.textContent=r.name;b.title=`View ${r.name}'s opponent records`;b.onclick=()=>{el('member').value=r.id;updateOpponents();render();el('head-to-head').scrollIntoView({behavior:'smooth',block:'start'});el('member').focus({preventScroll:true});};td.append(b);cell(tr,year==='all'?r.years.length:1);cell(tr,record(r));cell(tr,pct(r));cell(tr,number(r.pf));cell(tr,number(r.pa));el('standings').append(tr);});
  el('summary').textContent=`${all.games.length} games · ${all.rows.length} members · ${year==='all'?'2020–2025':year}`;
  el('standings-title').textContent=year==='all'?'Career standings':`${year} standings`;
  el('opponent-records').replaceChildren();
  const selected=data.members.find(m=>m.id===chosen);
  el('member-years').textContent=`${selected.name} · Seasons played: ${selected.years.join(', ')}`;
  for(const o of data.members.filter(m=>m.id!==chosen).sort((a,b)=>a.name.localeCompare(b.name))){
   const result=stats.summarize(data,year,chosen,o.id),r=result.rows.find(r=>r.id===chosen);
   const tr=document.createElement('tr');if(opponent===o.id)tr.className='selected-row';
   const td=cell(tr,'');const b=document.createElement('button');b.className='member-link';b.textContent=o.name;b.onclick=()=>{el('opponent').value=o.id;render();el('game-history').scrollIntoView({behavior:'smooth',block:'start'});el('opponent').focus({preventScroll:true});};td.append(b);
   cell(tr,r?.games?record(r):'—');cell(tr,r?.games?pct(r):'—');cell(tr,r?.games?number(r.pf):'—');cell(tr,r?.games?number(r.pa):'—');el('opponent-records').append(tr);
  }
  const result=stats.summarize(data,year,chosen,opponent||null),r=result.rows.find(r=>r.id===chosen);
  el('series-record').textContent=r?.games?record(r):'No games';
  el('series-caption').textContent=`${names[chosen]} ${opponent?'vs. '+names[opponent]:'vs. all opponents'} · ${result.games.length} games`;
  el('games').replaceChildren();
  for(const g of result.games.sort((a,b)=>b.year-a.year||b.week-a.week)){
   const first=g.a===chosen,own=first?g.sa:g.sb,against=first?g.sb:g.sa;const tr=document.createElement('tr');
   cell(tr,g.year);cell(tr,g.week);cell(tr,names[first?g.b:g.a]);const outcome=cell(tr,own>against?'Win':own<against?'Loss':'Tie');outcome.className=own>against?'win':own<against?'loss':'';cell(tr,`${number(own)} – ${number(against)}`);const td=cell(tr,'');const a=document.createElement('a');a.href=g.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Yahoo ↗';a.setAttribute('aria-label',`Yahoo matchup, ${g.year} week ${g.week}`);td.append(a);el('games').append(tr);
  }
  el('no-games').hidden=result.games.length>0;
 }
 el('season').onchange=render;el('sort').onchange=render;el('opponent').onchange=render;el('member').onchange=()=>{updateOpponents();render();};updateOpponents();render();
})();
