export const POLL_ID = 'punishment-2026';
export const ROUND_NAMES = ['Quarterfinals', 'Semifinals', 'The final'];
export const ENTRIES = [
  {id:'calendar',title:'Loser of the Month',icon:'📸',description:'Pose for 12 ridiculous, fully clothed photos for a digital league calendar. Each owner gets a month to choose the pose.'},
  {id:'bowling',title:'Bowl a 300',icon:'🎳',description:'Work toward a total of 300 pins. Food items or alcoholic drinks can reduce the target, with deductions agreed by the league.'},
  {id:'5k',title:'The Fantasy Failure 5K',icon:'🏃',description:'Run a 5K wearing something that makes it very clear you are not good at fantasy football.'},
  {id:'sign',title:'Wear the Shame',icon:'🪧',description:'Wear an embarrassing sign at a public event. The league chooses the message and agrees on the event.'},
  {id:'apology',title:'The Public Apology',icon:'🎥',description:'Record and share a public apology explaining why your fantasy team failed. Own the bad picks, questionable decisions, and season that followed.'},
  {id:'pancakes',title:'Six Hours of Pancakes',icon:'🥞',description:'Spend six hours at a place that serves pancakes. Each pancake eaten reduces the time, with the reduction agreed by the league.'},
  {id:'two-mile',title:'Two Miles, Eight Stops',icon:'🥤',description:'Run two miles, stopping to eat or drink something every quarter mile. The league agrees on the food, drinks, and portions beforehand.'},
  {id:'plunge',title:'Polar Plunge',icon:'🧊',description:'Take part in a polar plunge.'}
];
export const INITIAL_MATCHES = [
  {id:'qf1',round:1,left:'calendar',right:'apology'},
  {id:'qf2',round:1,left:'sign',right:'5k'},
  {id:'qf3',round:1,left:'bowling',right:'pancakes'},
  {id:'qf4',round:1,left:'two-mile',right:'plunge'}
];
export const MATCHUP_THEMES = {
  qf1:'Public humiliation · On camera',
  qf2:'Public humiliation · Out in public',
  qf3:'Food & endurance',
  qf4:'Physical challenges'
};
