// Yahoo Week 1 matchup rosters, verified September 15, 2026.
// First nine entries are starters in slots order; remaining entries are BN.
// IR players are excluded. Retain historical weekly rosters, not current rosters.
const CHQ_TEAM_PERFORMANCE = {
  season:2026, week:1,
  slots:['QB','RB','RB','WR','WR','TE','W/R/T','K','DEF'],
  teams:[
    {id:'tylor-c',team:'Grim Reaper',matchup:'1&mid2=10',players:[
      ['Justin Herbert','QB',14.26],['Ashton Jeanty','RB',35.70],['Jadarian Price','RB',7.80],['CeeDee Lamb','WR',15.40],['Drake London','WR',5.50],['Isaiah Likely','TE',27.80],['Javonte Williams','RB',24.20],['Spencer Shrader','K',7.80],['Eagles','DEF',3],
      ['Jordan Mason','RB',11.90],['Jakobi Meyers','WR',12.20],['Xavier Worthy','WR',4.80],['Rashid Shaheed','WR',1.40],['Keaton Mitchell','RB',0.90],['Emmett Johnson','RB',8.80]]},
    {id:'mickey-b',team:'Overdue Bills',matchup:'1&mid2=10',players:[
      ['Josh Allen','QB',38.66],['Blake Corum','RB',5.40],['Chuba Hubbard','RB',23.70],['Jalen Coker','WR',36.80],['Jordan Addison','WR',0],['Dalton Kincaid','TE',21],['Marvin Harrison Jr.','WR',4.30],['Tyler Bass','K',14.30],['Seahawks','DEF',13],
      ['Alec Pierce','WR',10.10],['KC Concepcion Jr.','WR',7.80],['Jacory Croskey-Merritt','RB',12.60],['Tyjae Spears','RB',4.40],['Khalil Shakir','WR',9],['Cyrus Allen','WR',0]]},
    {id:'nick-n',team:'Beast Infection',matchup:'2&mid2=12',players:[
      ['Jaxson Dart','QB',26.60],['Kenneth Walker','RB',37.10],['Rhamondre Stevenson','RB',14.50],['A.J. Brown','WR',5.60],['Emeka Egbuka','WR',11.30],['Juwan Johnson','TE',14.40],['Nico Collins','WR',21.20],['Cam Little','K',12.70],['Lions','DEF',10],
      ['MarShawn Lloyd','RB',3.70],['Quentin Johnston','WR',3.70],['Mike Washington Jr.','RB',4.10],['Tre Tucker','WR',4.70],['Terrance Ferguson','TE',0],['Baker Mayfield','QB',11.64]]},
    {id:'dusty-d',team:'West Coast',matchup:'2&mid2=12',players:[
      ['Kyler Murray','QB',0.62],['Saquon Barkley','RB',9],['De\'Von Achane','RB',10.60],['Malik Nabers','WR',12.90],['Amon-Ra St. Brown','WR',28.70],['Tucker Kraft','TE',9.50],['Bucky Irving','RB',20.30],['Cameron Dicker','K',2],['Rams','DEF',2],
      ['Parker Washington','WR',19.30],['Josh Downs','WR',5.70],['Michael Pittman Jr.','WR',8.80],['Jordan Love','QB',23.48],['Deebo Samuel Sr.','WR',18],['Hunter Henry','TE',5.60]]},
    {id:'chris-m',team:"Chris's Team",matchup:'3&mid2=6',players:[
      ['Caleb Williams','QB',37.26],['Breece Hall','RB',22.80],['D\'Andre Swift','RB',35.40],['Ja\'Marr Chase','WR',3.20],['Rashee Rice','WR',9.90],['Harold Fannin Jr.','TE',4.10],['Christian Watson','WR',35.70],['Tyler Loop','K',15.20],['Texans','DEF',-2],
      ['Carnell Tate','WR',7.80],['Kyle Monangai','RB',23.40],['Jonah Coleman','RB',0],['Braelon Allen','RB',4],['Ryan Flournoy','WR',4.20],['Michael Mayer','TE',9.20]]},
    {id:'brett-d',team:'DonkeyWoodDean',matchup:'3&mid2=6',players:[
      ['Jared Goff','QB',16.44],['Jahmyr Gibbs','RB',36.60],['Jaylen Warren','RB',10.30],['Zay Flowers','WR',29],['Garrett Wilson','WR',13.90],['Sam LaPorta','TE',9.80],['Chris Olave','WR',31.20],['Will Reichard','K',7.80],['Vikings','DEF',8],
      ['Bo Nix','QB',6.44],['Brian Thomas Jr.','WR',7],['Jonathon Brooks','RB',7.20],['Matthew Stafford','QB',5.10],['Dallas Goedert','TE',23.70],['Jayden Higgins','WR',0]]},
    {id:'dan-e',team:"daniel's Primo Team",matchup:'4&mid2=9',players:[
      ['Drake Maye','QB',12.82],['Tony Pollard','RB',4.40],['J.K. Dobbins','RB',3.60],['Puka Nacua','WR',12.40],['Chris Godwin Jr.','WR',8.30],['Trey McBride','TE',24.50],['DK Metcalf','WR',8],['Evan McPherson','K',19.50],['Patriots','DEF',6],
      ['RJ Harvey','RB',8.10],['Aaron Jones Sr.','RB',10],['Michael Wilson','WR',10.60],['Tyler Allgeier','RB',9],['Kayshon Boutte','WR',3.10],['Tank Bigsby','RB',0.30]]},
    {id:'mark-me',team:'Mels-16',matchup:'4&mid2=9',players:[
      ['Joe Burrow','QB',15.16],['Bijan Robinson','RB',31.30],['Derrick Henry','RB',38.30],['Tetairoa McMillan','WR',10.50],['Jaylen Waddle','WR',1.20],['Tyler Warren','TE',10.30],['Kyren Williams','RB',15.50],['Jason Myers','K',6.60],['Broncos','DEF',3],
      ['Rome Odunze','WR',7.20],['Brock Purdy','QB',22.10],['Stefon Diggs','WR',15.50],['Travis Kelce','TE',10.10]]},
    {id:'dillon-m',team:'Dillon M',matchup:'5&mid2=7',players:[
      ['Jayden Daniels','QB',17.66],['James Cook III','RB',9.90],['Chase Brown','RB',18.80],['Tee Higgins','WR',8.90],['Mike Evans','WR',16.90],['George Kittle','TE',3.20],['Quinshon Judkins','RB',7],['Chase McLaughlin','K',11.50],['Chargers','DEF',1],
      ['DJ Moore','WR',24],['De\'Zhaun Stribling','WR',0],['Makai Lemon','WR',2.50],['Malik Willis','QB',17.70],['Denzel Boston','WR',13.90],['Kaelon Black','RB',8]]},
    {id:'jason-h',team:'Gotham Knights',matchup:'5&mid2=7',players:[
      ['Lamar Jackson','QB',27.96],['Travis Etienne Jr.','RB',14.80],['Bhayshul Tuten','RB',9.80],['Jaxon Smith-Njigba','WR',29.20],['Jameson Williams','WR',8.50],['Kyle Pitts Sr.','TE',0],['Terry McLaurin','WR',3.40],['Ka\'imi Fairbairn','K',9.80],['Steelers','DEF',18],
      ['Rico Dowdle','RB',4.10],['David Montgomery','RB',28.90],['Jayden Reed','WR',5],['Woody Marks','RB',5],['Wan\'Dale Robinson','WR',8.80],['Mark Andrews','TE',8.90]]},
    {id:'mark-ma',team:"Mark's Team",matchup:'8&mid2=11',players:[
      ['Jalen Hurts','QB',24.72],['Christian McCaffrey','RB',13.80],['Cam Skattebo','RB',14.10],['Justin Jefferson','WR',31.20],['DeVonta Smith','WR',8.30],['Jake Ferguson','TE',2.60],['Courtland Sutton','WR',3.10],['Eddy Pineiro','K',10.60],['Jaguars','DEF',13],
      ['Kenny Gainwell','RB',2.80],['Rachaad White','RB',4.70],['Patrick Mahomes','QB',22.66],['Dylan Sampson','RB',0],['Romeo Doubs','WR',0],['Jalen Nailor','WR',5.70]]},
    {id:'jason-b',team:'Slim Pickens',matchup:'8&mid2=11',players:[
      ['Dak Prescott','QB',15.40],['Jonathan Taylor','RB',25.10],['Omarion Hampton','RB',8.30],['Ladd McConkey','WR',19.20],['Davante Adams','WR',5.60],['Colston Loveland','TE',0],['George Pickens','WR',5.80],['Brandon Aubrey','K',2],['Ravens','DEF',6],
      ['Luther Burden III','WR',9.50],['Jeremiyah Love','RB',13],['Trevor Lawrence','QB',26.10],['Matthew Golden','WR',15.50],['Chris Rodriguez Jr.','RB',2.30],['Chiefs','DEF',12]]}
  ]
};
if(typeof module !== 'undefined') module.exports=CHQ_TEAM_PERFORMANCE;
