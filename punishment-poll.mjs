import {ENTRIES,INITIAL_MATCHES,ROUND_NAMES,POLL_ID,MATCHUP_THEMES} from './punishment-poll-data.mjs';
const byId=new Map(ENTRIES.map(e=>[e.id,e]));
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const admin=document.body.dataset.pollAdmin==='true';
const api=(window.CHQ_POLL_API||'').replace(/\/$/,'');
let state={id:POLL_ID,round:1,phase:'draft',revision:0,matches:INITIAL_MATCHES.map(m=>({...m,winner:null,counts:null,total:0,myVote:null}))};
let credential='',busy=false,online=false;
const bracket=document.getElementById('poll-bracket'),message=document.getElementById('poll-message');
function tell(text,error=false){message.textContent=text;message.classList.toggle('error',error);}
async function request(path,body){
  const response=await fetch(api+path,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(credential?{Authorization:'Bearer '+credential}:{})},...(body?{body:JSON.stringify(body)}:{}),cache:'no-store'});
  let data;try{data=await response.json();}catch{throw new Error('The poll is temporarily unavailable. Try refreshing in a moment.');}
  if(!response.ok)throw new Error(data.error||'The request could not be completed.');
  return data;
}
function describe(m){const details=el('details');details.append(el('summary',null,'What are we voting for?'));for(const id of [m.left,m.right]){const entry=byId.get(id);if(!entry)continue;const p=el('p');p.append(el('strong',null,entry.title+': '),document.createTextNode(entry.description));details.append(p);}return details;}
function matchCard(m,index){
  const current=m.round===state.round,canVote=!admin&&credential&&online&&!busy&&state.phase==='open'&&current;
  const card=el('article','poll-match'+(current?' current':''));card.append(el('h4',null,`Matchup ${index+1}`));
  if(MATCHUP_THEMES[m.id])card.append(el('p','poll-match-theme',MATCHUP_THEMES[m.id]));
  [m.left,m.right].forEach((id,i)=>{
    if(i)card.append(el('div','poll-vs','VS'));
    const entry=byId.get(id);if(!entry)return;
    const selected=m.myVote===id,winner=m.winner===id;
    const option=el(admin?'div':'button','poll-option'+(selected?' selected':'')+(winner?' winner':''));
    if(!admin){option.type='button';option.disabled=!canVote;option.setAttribute('aria-pressed',String(selected));option.setAttribute('aria-label',`Vote for ${entry.title}`);option.addEventListener('click',()=>vote(m.id,id));}
    const name=el('span','option-name',entry.title);
    if(selected||winner)name.append(el('span','choice-label',winner?'Advanced'+(state.phase==='complete'?' • Champion':''):'Your vote'));
    option.append(el('span','option-icon',entry.icon),name);
    if(m.counts!==null&&m.counts!==undefined)option.append(el('span','option-votes',`${m.counts[id]||0} ${(m.counts[id]||0)===1?'vote':'votes'}`));
    card.append(option);
  });
  const total=m.total??Object.values(m.counts||{}).reduce((a,b)=>a+b,0);
  card.append(el('p','poll-match-footer',m.winner?'Winner advanced':current&&state.phase==='draft'?'Voting opens soon':`${total} ${total===1?'vote':'votes'} cast`));
  card.append(describe(m));return card;
}
function render(){
  bracket.replaceChildren();
  document.getElementById('poll-status').textContent=!online?'Bracket preview':state.phase==='draft'?'Voting opens soon':state.phase==='complete'?'Champion decided':`${ROUND_NAMES[state.round-1]} • ${state.phase==='open'?'Voting open':'Voting closed'}`;
  document.getElementById('poll-round-title').textContent=state.phase==='complete'?'The league has spoken':online&&state.phase==='open'?'Pick their next problem':'Eight punishments. One unlucky champion.';
  for(let round=1;round<=3;round++){
    const section=el('section','poll-round'+(state.round===round?' active':''));const heading=el('h3');heading.append(el('span',null,String(round)),document.createTextNode(ROUND_NAMES[round-1]));section.append(heading);
    const matches=el('div','poll-round-matches');const actual=state.matches.filter(m=>m.round===round);
    if(actual.length)actual.forEach((m,i)=>matches.append(matchCard(m,i)));
    else for(let i=0;i<2**(3-round);i++)matches.append(el('div','poll-match poll-placeholder',round===2?`Winners of quarterfinals ${i*2+1} & ${i*2+2}`:'The two semifinal winners'));
    section.append(matches);bracket.append(section);
  }
  const champ=document.getElementById('poll-champion');champ.replaceChildren();champ.hidden=state.phase!=='complete';
  if(!champ.hidden){const entry=byId.get(state.matches.find(m=>m.round===3)?.winner);champ.append(el('div','eyebrow','The punishment champion'),el('h2',null,`${entry?.icon||'🏆'} ${entry?.title||''}`),el('p','poll-muted','The league has made its choice. The details are yours to settle.'));}
  document.getElementById('poll-access-form').hidden=Boolean(credential);
  document.getElementById('poll-connected').hidden=!credential;
  document.getElementById('poll-refresh').disabled=busy||!api;
  document.getElementById('poll-submit').disabled=busy||!api;
  if(admin)renderAdmin();
}
async function refresh(){
  if(!api)return;
  try{state=await request(admin&&credential?'/admin':credential?'/ballot':'/state',admin&&credential?{action:'state'}:credential?{}:undefined);online=true;render();}
  catch(error){online=false;tell(error.message,true);render();}
}
async function vote(matchId,choice){
  busy=true;render();
  try{state=await request('/vote',{matchId,choice});online=true;tell('Vote saved. You can change it until this round closes.');}
  catch(error){tell(error.message,true);}
  finally{busy=false;render();}
}
function renderAdmin(){
  const panel=document.getElementById('poll-admin-controls');panel.hidden=!credential||!online;
  const buttons=document.getElementById('poll-admin-actions');buttons.replaceChildren();
  const ties=document.getElementById('poll-ties');ties.replaceChildren();
  for(const id of ['poll-reset-toggle','poll-reset-confirmation','poll-reset-cancel','poll-reset-submit'])document.getElementById(id).disabled=busy;
  if(panel.hidden)hideReset();
  if(panel.hidden)return;
  document.getElementById('poll-admin-note').textContent=state.phase==='complete'?'The final result is locked. Voting is finished.':state.phase==='draft'?'Open the quarterfinals when the league is ready.':state.phase==='open'?'Close voting to lock the totals. You can then review ties and advance the round.':'Voting is closed. Resolve any tied matchups below, then advance. You can also reopen this round.';
  if(state.phase==='closed')for(const m of state.matches.filter(m=>m.round===state.round)){
    if((m.counts[m.left]||0)!==(m.counts[m.right]||0))continue;
    const label=el('label',null,`Tie: ${byId.get(m.left).title} vs. ${byId.get(m.right).title}`);const select=el('select');select.dataset.match=m.id;select.append(new Option('Choose the advancing entry',''),new Option(byId.get(m.left).title,m.left),new Option(byId.get(m.right).title,m.right));label.append(select);ties.append(label);
  }
  const actions=state.phase==='draft'?[['open','Open quarterfinal voting']]:state.phase==='open'?[['close','Close voting for this round']]:state.phase==='closed'?[['advance',state.round===3?'Confirm the champion':'Advance winners and open next round'],['reopen','Reopen this round']]:[];
  for(const [action,label]of actions){const button=el('button','poll-button'+(action==='reopen'?' secondary':''),label);button.type='button';button.disabled=busy;button.addEventListener('click',()=>adminAction(action));buttons.append(button);}
}
function hideReset(){
  document.getElementById('poll-reset-form').hidden=true;
  document.getElementById('poll-reset-toggle').setAttribute('aria-expanded','false');
  document.getElementById('poll-reset-confirmation').value='';
}
async function adminAction(action,confirmation){
  if(busy)return;
  const tieChoices=Object.fromEntries(Array.from(document.querySelectorAll('#poll-ties select')).filter(s=>s.value).map(s=>[s.dataset.match,s.value]));
  busy=true;render();
  try{state=await request('/admin',{action,revision:state.revision,tieChoices,...(action==='reset'?{confirmation}:{})});if(action==='reset')hideReset();tell(action==='reset'?'Bracket reset. All votes and results were erased. Quarterfinal voting is closed until you open it.':action==='advance'?'Winners advanced.':'Round updated.');}
  catch(error){tell(error.message,true);}
  finally{busy=false;render();}
}
if(admin){
  document.getElementById('poll-reset-toggle').addEventListener('click',()=>{
    const form=document.getElementById('poll-reset-form');
    if(!form.hidden){hideReset();return;}
    form.hidden=false;document.getElementById('poll-reset-toggle').setAttribute('aria-expanded','true');
    document.getElementById('poll-reset-confirmation').focus();
  });
  document.getElementById('poll-reset-cancel').addEventListener('click',()=>{hideReset();document.getElementById('poll-reset-toggle').focus();});
  document.getElementById('poll-reset-form').addEventListener('submit',event=>{
    event.preventDefault();const confirmation=document.getElementById('poll-reset-confirmation').value;
    if(confirmation==='RESET')adminAction('reset',confirmation);
  });
}
document.getElementById('poll-access-form').addEventListener('submit',async event=>{
  event.preventDefault();credential=document.getElementById('poll-code').value.trim();if(!credential)return;
  busy=true;render();
  try{state=await request(admin?'/admin':'/ballot',admin?{action:'state'}:{});online=true;document.getElementById('poll-code').value='';tell(admin?'Commissioner controls unlocked.':'You’re in. Choose one punishment in each open matchup.');}
  catch(error){credential='';tell(error.message,true);}
  finally{busy=false;render();}
});
document.getElementById('poll-signout').addEventListener('click',()=>{credential='';state.matches.forEach(m=>m.myVote=null);tell('Signed out.');render();refresh();});
document.getElementById('poll-refresh').addEventListener('click',refresh);
render();
if(api)refresh();else tell('The bracket is ready. Voting will open once the commissioner connects the poll.');
