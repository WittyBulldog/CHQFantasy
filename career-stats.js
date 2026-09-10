(function(root){
 'use strict';
 function summarize(data, year='all', memberId=null, opponentId=null){
  const members=data.members.filter(m=>year==='all'||m.years.includes(Number(year)));
  const rows=new Map(members.map(m=>[m.id,{...m,wins:0,losses:0,ties:0,games:0,pf:0,pa:0}]));
  const games=data.games.filter(g=>(year==='all'||g.year===Number(year))&&(!memberId||g.a===memberId||g.b===memberId)&&(!opponentId||g.a===opponentId||g.b===opponentId));
  for(const g of games)for(const [id,pf,pa] of [[g.a,g.sa,g.sb],[g.b,g.sb,g.sa]]){
   const r=rows.get(id);r.games++;r.pf+=pf;r.pa+=pa;
   if(pf>pa)r.wins++;else if(pf<pa)r.losses++;else r.ties++;
  }
  for(const r of rows.values())r.pct=r.games?(r.wins+r.ties/2)/r.games:0;
  return {rows:[...rows.values()],games};
 }
 if(typeof module!=='undefined')module.exports={summarize};
 root.CareerStats={summarize};
})(typeof window==='undefined'?globalThis:window);
