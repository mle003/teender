import React from 'react';

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
      <div className="match-card"></div>
    </div>
  )
}

export default Match