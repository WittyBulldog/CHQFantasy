// Verified Yahoo snapshot from September 14, 2026, before Monday Night Football.
// Replace a week's scores after verification; mark complete only after all games.
// Include playoff weeks. For a tied weekly high, commissioner-approved credit
// can be recorded as creditedWinnerIds: ['owner-id']; otherwise it stays pending.
const CHQ_SEASON_AWARDS = { season:2026, weeks:[{
  week:1, phase:'Regular season', complete:false,
  label:'Week 1 • entering Monday Night Football, September 14',
  source:'https://football.fantasysports.yahoo.com/f1/317429?matchup_week=1',
  scores:[
    {id:'tylor-c',name:'Tylor C',points:141.46},
    {id:'mickey-b',name:'Mickey B',points:157.16},
    {id:'nick-n',name:'Nick N',points:116.30},
    {id:'dusty-d',name:'Dusty D',points:95.62},
    {id:'chris-m',name:'Chris M',points:151.66},
    {id:'brett-d',name:'Brett D',points:163.04},
    {id:'dan-e',name:'Dan E',points:95.92},
    {id:'mark-me',name:'Mark Me',points:127.66},
    {id:'dillon-m',name:'Dillon M',points:94.86},
    {id:'jason-h',name:'Jason H',points:121.46},
    {id:'mark-ma',name:'Mark Ma',points:118.32},
    {id:'jason-b',name:'Jason B',points:87.40}
  ]
}]};
if (typeof module !== 'undefined') module.exports = CHQ_SEASON_AWARDS;
