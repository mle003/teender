import React from 'react';
import 'src/style/match.scss'

function Match() {
  return (
    <div className="match-part">
      <MatchCard/>
      <MatchCard/>
      <MatchCard/>
      <MatchCard/>
    </div>
  )
}

function MatchCard() {
  return (
    <div className="match-card-container">
      <div className="match-card">
        <div className="match-card-filter"><div className="match-card-name">Hello Hello Hello</div></div>
      </div>
    </div>
  )
}

export default Match