import {snapshot,publicSnapshot,castVote,changePhase,advance,resetBracket,commissionerSnapshot} from './core.mjs';

const encoder=new TextEncoder();
async function digest(value){return new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value)));}
function same(a,b){let difference=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)difference|=(a[i]||0)^(b[i]||0);return difference===0;}
async function hash(value){return Array.from(await digest(value),n=>n.toString(16).padStart(2,'0')).join('');}
const normalize=code=>code.trim().replace(/[\s-]/g,'').toUpperCase();

export default {async fetch(request,env){
  const origin=request.headers.get('Origin');
  const allowed=(env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean);
  const headers={'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin'};
  if(origin&&allowed.includes(origin))Object.assign(headers,{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'Content-Type,Authorization','Access-Control-Allow-Methods':'GET,POST,OPTIONS'});
  const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
  if(origin&&!allowed.includes(origin))return json({error:'This website is not allowed to use the poll.'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  const path=new URL(request.url).pathname.replace(/\/$/,'');
  if(request.method==='GET'&&path==='/health')return json({ok:true});
  try{
    if(request.method==='GET'&&path==='/state')return json(publicSnapshot(await snapshot(env.DB)));
    if(request.method!=='POST')return json({error:'Not found.'},404);
    if(!['/ballot','/vote','/admin'].includes(path))return json({error:'Not found.'},404);
    const text=await request.text();
    if(text.length>4096)return json({error:'Request too large.'},413);
    let body;try{body=JSON.parse(text);}catch{return json({error:'Invalid request.'},400);}
    if(!body||typeof body!=='object'||Array.isArray(body))return json({error:'Invalid request.'},400);
    const token=request.headers.get('Authorization')?.replace(/^Bearer /,'')||'';
    if(token.length>256)return json({error:'Invalid code.'},401);
    if(path==='/admin'){
      if(!env.ADMIN_SECRET||env.ADMIN_SECRET.length<32)return json({error:'Commissioner access is not configured.'},503);
      if(!same(await digest(token),await digest(env.ADMIN_SECRET)))return json({error:'Commissioner key not recognized.'},401);
      const state=await snapshot(env.DB);
      const adminState=()=>commissionerSnapshot(env.DB,Object.keys(JSON.parse(env.VOTER_CODE_HASHES||'{}')));
      if(body.action==='state')return json(await adminState());
      if(!Number.isInteger(body.revision)||body.revision!==state.revision)return json({error:'The bracket changed. Refresh and try again.'},409);
      let changed;
      try{changed=body.action==='reset'?await resetBracket(env.DB,body.revision,body.confirmation):body.action==='advance'?await advance(env.DB,state,body.tieChoices||{}):await changePhase(env.DB,body.action,body.revision);}catch(error){return json({error:error.message},400);}
      if(!changed)return json({error:'The bracket changed. Refresh and try again.'},409);
      return json(await adminState());
    }
    const hashes=JSON.parse(env.VOTER_CODE_HASHES||'{}');
    if(!Object.keys(hashes).length)return json({error:'Voting codes have not been configured.'},503);
    const codeHash=await hash(normalize(token));
    const owner=Object.keys(hashes).find(id=>hashes[id]===codeHash);
    if(!owner)return json({error:'Voting code not recognized.'},401);
    if(path==='/vote'){
      if(typeof body.matchId!=='string'||typeof body.choice!=='string')return json({error:'Choose an option.'},400);
      if(!await castVote(env.DB,owner,body.matchId,body.choice))return json({error:'Voting has closed or this option is not in the active matchup.'},409);
    }
    return json(publicSnapshot(await snapshot(env.DB,owner)));
  }catch(error){console.error('Poll request failed',error.name);return json({error:'The poll could not be loaded. Please try again.'},503);}
}};
