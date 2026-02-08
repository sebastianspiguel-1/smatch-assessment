import React from 'react';
import './App.css';
import ChallengeMenu from './ChallengeMenu';

function App() {
  return (
    <div className="app-container">
      <ChallengeMenu />
      <button className="ai-assistant">🤖 AI Assistant</button>
    </div>
  );
}

export default App;