export const POLL_ID = 'punishment-2026';
export const ROUND_NAMES = ['Quarterfinals', 'Semifinals', 'The final'];
export const ENTRIES = [
  {id:'calendar',title:'Loser of the Month',icon:'📸',description:'Pose for 12 ridiculous, fully clothed photos for a digital league calendar. Each owner gets a month to choose the pose.'},
  {id:'bowling',title:'Bowl a 300',icon:'🎳',description:'Work toward a total of 300 pins. Food items or alcoholic drinks can reduce the target, with deductions agreed by the league.'},
  {id:'5k',title:'The Fantasy Failure 5K',icon:'🏃',description:'Run a 5K wearing something that makes it very clear you are not good at fantasy football.'},
  {id:'dinner',title:'Dinner Is on the Loser',icon:'🍽️',description:'Host and cook a three-course dinner for league members who can attend. Agree on an alternative for owners who live far away.'},
  {id:'sat',title:'Back to the SAT',icon:'✏️',description:'Register for and take the SAT exam. Fantasy football has apparently assigned homework.'},
  {id:'pancakes',title:'Six Hours of Pancakes',icon:'🥞',description:'Spend six hours at a place that serves pancakes. Each pancake eaten reduces the time, with the reduction agreed by the league.'},
  {id:'chip',title:'One Chip Challenge',icon:'🌶️',description:'Complete the One Chip Challenge.'},
  {id:'plunge',title:'Polar Plunge',icon:'🧊',description:'Take part in a polar plunge.'}
];
export const INITIAL_MATCHES = [
  {id:'qf1',round:1,left:'calendar',right:'bowling'},
  {id:'qf2',round:1,left:'5k',right:'dinner'},
  {id:'qf3',round:1,left:'sat',right:'pancakes'},
  {id:'qf4',round:1,left:'chip',right:'plunge'}
];
