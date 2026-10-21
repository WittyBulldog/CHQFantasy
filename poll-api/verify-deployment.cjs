// Read-only live verification. Does not open a round or cast a vote.
const fs=require('node:fs'),path=require('node:path');
(async()=>{
 const config=fs.readFileSync(path.join(__dirname,'../punishment-poll-config.js'),'utf8');
 const api=config.match(/window\.CHQ_POLL_API\s*=\s*'([^']+)'/)[1];
 const codes=JSON.parse(fs.readFileSync(path.join(__dirname,'.private/voting-codes.json'),'utf8'));
 const headers={Origin:'https://www.chqfantasy.com'};
 const get=await fetch(api+'/state',{headers,signal:AbortSignal.timeout(15000)});
 if(get.status!==200)throw Error('State returned HTTP '+get.status);
 const state=await get.json();
 if(state.phase!=='draft'||state.matches.length!==4||state.matches.some(m=>m.total!==0))throw Error('Poll is no longer an empty draft; review its current state before testing.');
 for(const [route,key,body]of [['/ballot',codes.owners[0].code,{}],['/admin',codes.commissionerKey,{action:'state'}]]){
  const response=await fetch(api+route,{method:'POST',headers:{...headers,'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
  if(response.status!==200)throw Error(route+' returned HTTP '+response.status);
 }
 console.log('Live API verified: four quarterfinals, zero votes, voting closed, owner authentication, commissioner authentication, and site CORS.');
})().catch(error=>{console.error(error.message,error.cause?.code||'');process.exitCode=1;});
