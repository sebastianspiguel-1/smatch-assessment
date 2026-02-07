import React from 'react';
import './App.css';
import DailyChallenge from './DailyChallenge';

function App() {
  return (
    <div className="app-container">
      <DailyChallenge />
      <button className="ai-assistant">🤖 AI Assistant</button>
    </div>
  );
}

export default App;