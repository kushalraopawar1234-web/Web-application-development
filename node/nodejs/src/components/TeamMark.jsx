const teamColors = {
  CSK: 'gold',
  MI: 'dark blue',
  RCB: 'red',
  KKR: 'violet',
  RR: 'pink',
  SRH: 'orange',
  GT: 'teal',
  PBKS: 'red',
  LSG: 'aqua',
  DC: 'aqua',
}

function TeamMark({ team }) {
  return <span className={`team-mark team-mark--${teamColors[team]}`}>{team}</span>
}

export default TeamMark