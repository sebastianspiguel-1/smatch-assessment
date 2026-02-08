import React, { useState } from 'react';
import './ChallengeMenu.css';
import DailyChallenge from './DailyChallenge';
import SlackChallenge from './SlackChallenge';

const ChallengeMenu = () => {
  const [language, setLanguage] = useState('en');
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Si seleccionó un challenge, renderizarlo
  if (selectedChallenge === 1) {
  return <DailyChallenge language={language} onBack={() => setSelectedChallenge(null)} />;
}

if (selectedChallenge === 2) {
  return <SlackChallenge language={language} onBack={() => setSelectedChallenge(null)} />;
}

  // Menú principal
  return (
    <div className="challenge-menu">
      <div className="menu-header">
        <h1 className="menu-title">Your Worst Day as a Scrum Master</h1>
        <p className="menu-subtitle">Complete 5 challenges. Each one tests different critical skills.</p>
        
        {/* LANGUAGE SELECTOR */}
        <div className="language-selector">
          <button 
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
          <button 
            className={`lang-btn ${language === 'es' ? 'active' : ''}`}
            onClick={() => setLanguage('es')}
          >
            ES
          </button>
        </div>
      </div>

      <div className="challenges-grid">
        {/* CHALLENGE 1 */}
        <div className="challenge-card available" onClick={() => setSelectedChallenge(1)}>
          <div className="challenge-number">01</div>
          <div className="challenge-icon">📹</div>
          <h3>The Daily From Hell</h3>
          <p className="challenge-skill">Team Reading & Conflict Detection</p>
          <div className="challenge-status">
            <span className="status-badge available">Available</span>
            <span className="duration">⏱️ 10 min</span>
          </div>
        </div>

        {/* CHALLENGE 2 */}
<div className="challenge-card available" onClick={() => setSelectedChallenge(2)}>
  <div className="challenge-number">02</div>
  <div className="challenge-icon">💬</div>
  <h3>Slack on Fire</h3>
  <p className="challenge-skill">Crisis Management & Communication</p>
  <div className="challenge-status">
    <span className="status-badge available">Available</span>
    <span className="duration">⏱️ 12 min</span>
  </div>
</div>

        {/* CHALLENGE 3 */}
        <div className="challenge-card locked">
          <div className="challenge-number">03</div>
          <div className="challenge-icon">📧</div>
          <h3>CEO Email Bomb</h3>
          <p className="challenge-skill">Stakeholder Management</p>
          <div className="challenge-status">
            <span className="status-badge locked">🔒 Locked</span>
            <span className="duration">⏱️ 12 min</span>
          </div>
        </div>

        {/* CHALLENGE 4 */}
        <div className="challenge-card locked">
          <div className="challenge-number">04</div>
          <div className="challenge-icon">📋</div>
          <h3>Priority Chaos</h3>
          <p className="challenge-skill">Backlog Prioritization</p>
          <div className="challenge-status">
            <span className="status-badge locked">🔒 Locked</span>
            <span className="duration">⏱️ 10 min</span>
          </div>
        </div>

        {/* CHALLENGE 5 */}
        <div className="challenge-card locked">
          <div className="challenge-number">05</div>
          <div className="challenge-icon">🔄</div>
          <h3>The Retro That Doesn't Work</h3>
          <p className="challenge-skill">Process Improvement & Facilitation</p>
          <div className="challenge-status">
            <span className="status-badge locked">🔒 Locked</span>
            <span className="duration">⏱️ 15 min</span>
          </div>
        </div>
      </div>

      <div className="menu-footer">
        <div className="total-time">
          <span>⏱️ Total Assessment Time: ~55 minutes</span>
        </div>
        <div className="progress-info">
          <span>Progress: 0/5 challenges completed</span>
        </div>
      </div>
    </div>
  );
};

export default ChallengeMenu;