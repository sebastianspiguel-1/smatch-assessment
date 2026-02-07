import React, { useState } from 'react';
import './App.css';
import DailyChallenge from './DailyChallenge';

function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="intro-screen">
        <div className="intro-content">
          <div className="glitch-text">
            <h1>YOUR WORST DAY</h1>
            <h2>AS A SCRUM MASTER</h2>
          </div>
          
          <div className="story">
            <p className="time">Monday, 9:00 AM</p>
            <p>You just arrived at the office with your coffee.</p>
            <p>Slack: <span className="highlight">47 unread messages</span></p>
            <p>Calendar: <span className="highlight">6 back-to-back meetings</span></p>
            <p>Sprint ends in 3 days. You're at <span className="danger">60% completion</span>.</p>
            <p className="final">Your phone vibrates. Message from the CEO.</p>
          </div>

          <div className="rules">
            <h3>THE RULES</h3>
            <ul>
              <li>⏱️ You have <strong>45 minutes</strong></li>
              <li>📹 Your camera and screen are <strong>recording</strong></li>
              <li>🤖 You can use <strong>any AI tool</strong> you want</li>
              <li>🎯 Your goal: Keep the team alive</li>
            </ul>
          </div>

          <button className="start-btn" onClick={() => setStarted(true)}>
            START ASSESSMENT
            <span className="arrow">→</span>
          </button>

          <p className="disclaimer">
            This simulation will test your real skills as a Scrum Master.<br/>
            Good luck. You'll need it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="header">
        <div className="team-health">
          <span>Team Health:</span>
          <div className="health-bar">
            <div className="health-fill" style={{width: '30%'}}></div>
          </div>
          <span className="health-percent">30%</span>
        </div>
        <div className="timer">
          <span>⏰ 9:00 AM - Monday</span>
          <span>⏳ 45:00 remaining</span>
        </div>
      </div>

      <div className="workspace">
        <div className="sidebar">
          <button className="app-btn active">💬 Slack</button>
          <button className="app-btn">📧 Email</button>
          <button className="app-btn">📋 Jira</button>
          <button className="app-btn">📹 Zoom</button>
        </div>

        <div className="main-content">
  <DailyChallenge />
</div>
      </div>

      <button className="ai-assistant">🤖 AI Assistant</button>
    </div>
  );
}

export default App;