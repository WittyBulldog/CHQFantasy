import { POLL_ID } from '../../punishment-poll-data.mjs';

export function selectWinners(matches, tieChoices = {}) {
  if (!tieChoices || typeof tieChoices !== 'object' || Array.isArray(tieChoices)) throw new Error('Invalid tie selections.');
  const tied = new Set();
  const winners = matches.map(m => {
    const left = m.counts[m.left] || 0, right = m.counts[m.right] || 0;
    if (left + right === 0) throw new Error('Every matchup needs at least one vote. Reopen voting to collect missing votes.');
    if (left !== right) return {id:m.id,winner:left>right?m.left:m.right};
    tied.add(m.id);
    if (![m.left,m.right].includes(tieChoices[m.id])) throw new Error('Choose a winner for each tied matchup.');
    return {id:m.id,winner:tieChoices[m.id]};
  });
  if (Object.keys(tieChoices).some(id=>!tied.has(id))) throw new Error('Only tied matchups can be decided by the commissioner.');
  return winners;
}

export async function snapshot(db, voterId = null) {
  const poll=await db.prepare('SELECT * FROM polls WHERE id=?').bind(POLL_ID).first();
  if (!poll) throw new Error('The poll has not been initialized.');
  const {results:matches}=await db.prepare('SELECT * FROM matches WHERE poll_id=? ORDER BY round,id').bind(POLL_ID).all();
  const {results:counts}=await db.prepare('SELECT match_id,choice,COUNT(*) AS n FROM votes WHERE poll_id=? GROUP BY match_id,choice').bind(POLL_ID).all();
  const own=voterId ? (await db.prepare('SELECT match_id,choice FROM votes WHERE poll_id=? AND voter_id=?').bind(POLL_ID,voterId).all()).results : [];
  return {...poll,matches:matches.map(m=>({id:m.id,round:m.round,left:m.left_id,right:m.right_id,winner:m.winner,counts:Object.fromEntries(counts.filter(c=>c.match_id===m.id).map(c=>[c.choice,c.n])),myVote:own.find(v=>v.match_id===m.id)?.choice||null}))};
}

export function publicSnapshot(state) {
  return {...state,matches:state.matches.map(m=>{
    const reveal=m.round<state.round || state.phase==='closed' || state.phase==='complete';
    const total=Object.values(m.counts).reduce((a,b)=>a+b,0);
    return {...m,counts:reveal?m.counts:null,total};
  })};
}

export async function castVote(db, voterId, matchId, choice) {
  const result=await db.prepare(`INSERT INTO votes(poll_id,match_id,voter_id,choice)
    SELECT p.id,m.id,?,? FROM polls p JOIN matches m ON m.poll_id=p.id
    WHERE p.id=? AND p.phase='open' AND m.id=? AND m.round=p.round AND ? IN (m.left_id,m.right_id)
    ON CONFLICT(poll_id,match_id,voter_id) DO UPDATE SET choice=excluded.choice`)
    .bind(voterId,choice,POLL_ID,matchId,choice).run();
  return result.meta.changes>0;
}

export async function changePhase(db, action, revision) {
  const phases={open:['draft','open'],close:['open','closed'],reopen:['closed','open']};
  const pair=phases[action];
  if(!pair) throw new Error('Unknown action.');
  return (await db.prepare('UPDATE polls SET phase=?,revision=revision+1 WHERE id=? AND phase=? AND revision=?').bind(pair[1],POLL_ID,pair[0],revision).run()).meta.changes>0;
}

export async function advance(db, state, tieChoices) {
  if(state.phase!=='closed') throw new Error('Close voting before advancing the round.');
  const active=state.matches.filter(m=>m.round===state.round);
  const winners=selectWinners(active,tieChoices);
  const statements=winners.map(w=>db.prepare(`UPDATE matches SET winner=? WHERE poll_id=? AND id=? AND EXISTS
    (SELECT 1 FROM polls WHERE id=? AND phase='closed' AND round=? AND revision=?)`)
    .bind(w.winner,POLL_ID,w.id,POLL_ID,state.round,state.revision));
  if(state.round<3) for(let i=0;i<winners.length;i+=2){
    const id=state.round===1?`sf${i/2+1}`:'final';
    statements.push(db.prepare(`INSERT INTO matches(poll_id,id,round,left_id,right_id)
      SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM polls WHERE id=? AND phase='closed' AND round=? AND revision=?)`)
      .bind(POLL_ID,id,state.round+1,winners[i].winner,winners[i+1].winner,POLL_ID,state.round,state.revision));
  }
  statements.push(db.prepare(`UPDATE polls SET round=?,phase=?,revision=revision+1
    WHERE id=? AND phase='closed' AND round=? AND revision=?`)
    .bind(Math.min(3,state.round+1),state.round===3?'complete':'open',POLL_ID,state.round,state.revision));
  const results=await db.batch(statements);
  return results.at(-1).meta.changes>0;
}
