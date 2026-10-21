const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'.private');
if(fs.existsSync(path.join(root,'secrets.json')))throw Error('Private codes already exist. Preserve them; changing them would replace owner access.');
const roster=require('../team-performance-data.js').teams;
if(roster.length!==12||new Set(roster.map(t=>t.id)).size!==12)throw Error('Expected the 12 current league owners.');
fs.mkdirSync(root,{recursive:true});
const hashes={},codes=roster.map(owner=>{
  const raw=crypto.randomBytes(20).toString('hex').toUpperCase();
  hashes[owner.id]=crypto.createHash('sha256').update(raw).digest('hex');
  return {owner:owner.team,code:raw.match(/.{1,5}/g).join('-')};
});
const admin=crypto.randomBytes(32).toString('hex');
fs.writeFileSync(path.join(root,'voting-codes.json'),JSON.stringify({commissionerKey:admin,owners:codes},null,2)+'\n',{mode:0o600,flag:'wx'});
fs.writeFileSync(path.join(root,'secrets.json'),JSON.stringify({ADMIN_SECRET:admin,VOTER_CODE_HASHES:JSON.stringify(hashes)},null,2)+'\n',{mode:0o600,flag:'wx'});
console.log('Private codes saved in poll-api/.private/voting-codes.json. Deployment secrets saved separately in poll-api/.private/secrets.json. Neither file belongs in GitHub.');
