import React, { useState, useEffect } from 'react';
import './DailyChallenge.css';

const DailyChallenge = () => {
  const [stage, setStage] = useState('intro');
  const [currentDialogue, setCurrentDialogue] = useState(0);
  const [detectedIssues, setDetectedIssues] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [teamHealth, setTeamHealth] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [selectedMember, setSelectedMember] = useState(null);
  const [priorities, setPriorities] = useState([
    { id: '1', text: 'Unblock Alex immediately' },
    { id: '2', text: 'Address team tension' },
    { id: '3', text: 'Sync with PO on priorities' },
    { id: '4', text: 'Check in with Sam (QA)' },
  ]);

  const teamMembers = [
    { 
      id: 1, 
      name: 'Alex',
      role: 'Backend Dev',
      avatar: '👨‍💻',
      status: 'camera-off',
      mood: 'stressed',
      issue: 'blocked-silent',
      details: 'Has been stuck on API endpoints for 2 days. Not asking for help. Camera off - red flag.'
    },
    { 
      id: 2, 
      name: 'Jordan',
      role: 'Frontend Dev',
      avatar: '👩‍💻',
      status: 'online',
      mood: 'frustrated',
      issue: 'interrupts',
      details: 'Work is blocked waiting for Alex. Getting impatient. Interrupting constantly.'
    },
    { 
      id: 3, 
      name: 'Sam',
      role: 'QA Engineer',
      avatar: '🧑‍🔬',
      status: 'online',
      mood: 'disengaged',
      issue: 'silent-frustrated',
      details: 'Silent, arms crossed, looking away. Something is bothering them but not speaking up.'
    },
    { 
      id: 4, 
      name: 'Casey',
      role: 'Designer',
      avatar: '🎨',
      status: 'online',
      mood: 'positive',
      issue: 'normal',
      details: 'Collaborative and positive. No issues detected.'
    },
    { 
      id: 5, 
      name: 'Morgan',
      role: 'Product Owner',
      avatar: '📊',
      status: 'late',
      mood: 'distracted',
      issue: 'distracted',
      details: 'Joined 5 minutes late. Looking at phone. Not fully present.'
    },
  ];

  const dialogue = [
    { speaker: 'You', speakerId: 0, text: 'Good morning team! Let\'s start the daily. Alex, how are things going?', emotion: 'neutral' },
    { speaker: 'Alex', speakerId: 1, text: 'Yeah, uh... good. Working on the API endpoints. Should be done soon.', emotion: 'evasive' },
    { speaker: 'Jordan', speakerId: 2, text: 'Wait, Alex are you almost done? Because I need those endpoints to finish the integration and—', emotion: 'impatient' },
    { speaker: 'You', speakerId: 0, text: 'Jordan, let Alex finish please.', emotion: 'calm' },
    { speaker: 'Alex', speakerId: 1, text: 'Yeah... almost. Just a few more things.', emotion: 'vague' },
    { speaker: 'Jordan', speakerId: 2, text: 'Okay but "soon" could mean today or next week, I need to know because—', emotion: 'frustrated' },
    { speaker: 'Sam', speakerId: 3, text: '...', emotion: 'silent' },
    { speaker: 'Casey', speakerId: 4, text: 'I finished the mockups yesterday! Uploaded to Figma. Jordan, let me know if you need anything!', emotion: 'positive' },
    { speaker: 'Morgan', speakerId: 5, text: 'Sorry I\'m late, what did I miss?', emotion: 'distracted' },
  ];

  useEffect(() => {
    if (stage === 'action' && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, timeRemaining]);

  useEffect(() => {
    if (stage === 'daily' && currentDialogue < dialogue.length - 1) {
      const timer = setTimeout(() => {
        setCurrentDialogue(currentDialogue + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage, currentDialogue, dialogue.length]);

  const movePriority = (index, direction) => {
    const newPriorities = [...priorities];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < priorities.length) {
      [newPriorities[index], newPriorities[newIndex]] = [newPriorities[newIndex], newPriorities[index]];
      setPriorities(newPriorities);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (stage === 'intro') {
    return (
      <div className="challenge-container">
        <div className="challenge-header">
          <h1>🎬 Challenge 1: The Daily From Hell</h1>
          <p className="challenge-desc">
            It's 9:00 AM. Time for the daily standup. You join the Zoom call and immediately sense something is... off.
          </p>
        </div>

        <div className="team-grid-intro">
          {teamMembers.map(member => (
            <div 
              key={member.id} 
              className={`team-card-intro ${member.status}`}
              onClick={() => setSelectedMember(member)}
            >
              <div className="avatar-large">{member.avatar}</div>
              <div className="member-info">
                <div className="member-name">{member.name}</div>
                <div className="member-role">{member.role}</div>
                <div className={`member-status status-${member.status}`}>
                  {member.status === 'camera-off' && '🔴 Camera OFF'}
                  {member.status === 'online' && '🟢 Online'}
                  {member.status === 'late' && '🟡 Joined Late'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedMember && (
          <div className="member-detail-modal" onClick={() => setSelectedMember(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedMember(null)}>×</button>
              <div className="avatar-huge">{selectedMember.avatar}</div>
              <h2>{selectedMember.name}</h2>
              <p className="role-badge">{selectedMember.role}</p>
              <p className="member-details">{selectedMember.details}</p>
            </div>
          </div>
        )}

        <button className="primary-btn pulse" onClick={() => setStage('daily')}>
          Join Daily Standup →
        </button>
      </div>
    );
  }

  if (stage === 'daily') {
    const activeSpeaker = dialogue[currentDialogue]?.speakerId;

    return (
      <div className="challenge-container">
        <div className="zoom-header">
          <h2>⏰ 9:05 AM - Daily Standup</h2>
          <div className="zoom-controls">
            <button className="zoom-btn">🎤 Mute</button>
            <button className="zoom-btn">📹 Stop Video</button>
            <button className="zoom-btn leave">Leave</button>
          </div>
        </div>

        <div className="zoom-grid">
          {teamMembers.map(member => (
            <div 
              key={member.id}
              className={`zoom-participant ${activeSpeaker === member.id ? 'speaking' : ''} ${member.status}`}
              onClick={() => setSelectedMember(member)}
            >
              <div className="participant-video">
                {member.status === 'camera-off' ? (
                  <div className="camera-off-screen">
                    <div className="avatar-zoom">{member.avatar}</div>
                    <p>Camera Off</p>
                  </div>
                ) : (
                  <div className="avatar-zoom">{member.avatar}</div>
                )}
                <div className="participant-name">{member.name}</div>
                {activeSpeaker === member.id && (
                  <div className="speaking-indicator">🔊 Speaking...</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="dialogue-feed">
          {dialogue.slice(0, currentDialogue + 1).map((line, index) => (
            <div 
              key={index} 
              className={`dialogue-bubble ${line.speakerId === 0 ? 'your-bubble' : ''} ${line.emotion}`}
            >
              <strong>{line.speaker}:</strong> {line.text}
            </div>
          ))}
        </div>

        {currentDialogue >= dialogue.length - 1 && (
          <button className="primary-btn" onClick={() => setStage('detection')}>
            Daily Ended - Analyze What Happened →
          </button>
        )}

        {selectedMember && (
          <div className="member-detail-modal" onClick={() => setSelectedMember(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedMember(null)}>×</button>
              <div className="avatar-huge">{selectedMember.avatar}</div>
              <h2>{selectedMember.name}</h2>
              <p className="role-badge">{selectedMember.role}</p>
              <p className="member-details">{selectedMember.details}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (stage === 'detection') {
    return (
      <div className="challenge-container">
        <div className="detection-header">
          <h2>🔍 What problems did you detect?</h2>
          <p className="hint">Click all issues you noticed (you'll be scored on accuracy)</p>
        </div>

        <div className="issues-interactive">
          {[
            { id: 'alex-blocked', label: '🚧 Alex is blocked but not saying it', correct: true },
            { id: 'jordan-impatient', label: '😤 Jordan is frustrated and interrupting', correct: true },
            { id: 'sam-silent', label: '🤐 Sam (QA) is disengaged/unhappy', correct: true },
            { id: 'morgan-distracted', label: '📱 Morgan (PO) is distracted', correct: true },
            { id: 'dependency', label: '🔗 Dependency blocker (Jordan waiting for Alex)', correct: true },
            { id: 'tension', label: '⚡ Tension building between team members', correct: true },
            { id: 'casey-problem', label: '❌ Casey has a problem (TRAP - this is wrong)', correct: false },
          ].map(issue => (
            <button
              key={issue.id}
              className={`issue-btn ${detectedIssues.includes(issue.id) ? 'selected' : ''}`}
              onClick={() => {
                if (detectedIssues.includes(issue.id)) {
                  setDetectedIssues(detectedIssues.filter(i => i !== issue.id));
                } else {
                  setDetectedIssues([...detectedIssues, issue.id]);
                }
              }}
            >
              {issue.label}
            </button>
          ))}
        </div>

        <button 
          className="primary-btn" 
          onClick={() => setStage('priority')}
          disabled={detectedIssues.length === 0}
        >
          Continue ({detectedIssues.length} issues detected) →
        </button>
      </div>
    );
  }

  if (stage === 'priority') {
    return (
      <div className="challenge-container">
        <div className="priority-header">
          <h2>📊 Prioritize Your Actions</h2>
          <p className="timer-large">⏱️ {formatTime(timeRemaining)} remaining</p>
          <p className="hint">Use arrows to reorder - what do you tackle FIRST?</p>
        </div>

        <div className="priority-list">
          {priorities.map((item, index) => (
            <div key={item.id} className="priority-item">
              <span className="priority-number">#{index + 1}</span>
              <span className="priority-text">{item.text}</span>
              <div className="priority-controls">
                <button 
                  onClick={() => movePriority(index, 'up')}
                  disabled={index === 0}
                  className="arrow-btn"
                >
                  ▲
                </button>
                <button 
                  onClick={() => movePriority(index, 'down')}
                  disabled={index === priorities.length - 1}
                  className="arrow-btn"
                >
                  ▼
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="primary-btn" onClick={() => setStage('action')}>
          Confirm Priorities →
        </button>
      </div>
    );
  }

  if (stage === 'action') {
    return (
      <div className="challenge-container">
        <div className="action-header">
          <h2>⚡ Execute Your #1 Priority</h2>
          <p className="priority-chosen">You chose: <strong>{priorities[0].text}</strong></p>
        </div>

        <div className="action-simulation">
          <p>Opening Slack DM with Alex...</p>
          <div className="slack-dm">
            <div className="dm-header">
              <span>👨‍💻 Alex (Backend Dev)</span>
              <span className="status-dot">🟢</span>
            </div>
            <div className="dm-body">
              <textarea 
                placeholder="Type your message to Alex..."
                className="dm-input"
                rows="4"
              />
              <button className="send-btn">Send Message</button>
              <button className="ai-draft-btn">🤖 Draft with AI</button>
            </div>
          </div>
        </div>

        <button className="primary-btn" onClick={() => setStage('result')}>
          Submit & See Results →
        </button>
      </div>
    );
  }

  if (stage === 'result') {
    const correctIssues = ['alex-blocked', 'jordan-impatient', 'sam-silent', 'dependency', 'tension', 'morgan-distracted'];
    const detectedCorrect = detectedIssues.filter(i => correctIssues.includes(i));
    const detectedWrong = detectedIssues.filter(i => !correctIssues.includes(i));
    const detectionScore = Math.round((detectedCorrect.length / correctIssues.length) * 10);

    return (
      <div className="challenge-container">
        <div className="results-hero">
          <h1>📊 Challenge Complete!</h1>
          <div className="final-score">{detectionScore}/10</div>
          <p className="score-label">Team Reading Score</p>
        </div>

        <div className="results-grid">
          <div className="result-card">
            <h3>✅ Correctly Detected</h3>
            {detectedCorrect.map(issue => (
              <div key={issue} className="result-item correct">• {issue.replace('-', ' ')}</div>
            ))}
          </div>

          <div className="result-card">
            <h3>❌ Missed</h3>
            {correctIssues.filter(i => !detectedIssues.includes(i)).map(issue => (
              <div key={issue} className="result-item missed">• {issue.replace('-', ' ')}</div>
            ))}
          </div>

          {detectedWrong.length > 0 && (
            <div className="result-card">
              <h3>⚠️ False Positives</h3>
              {detectedWrong.map(issue => (
                <div key={issue} className="result-item wrong">• {issue.replace('-', ' ')}</div>
              ))}
            </div>
          )}
        </div>

        <div className="priority-feedback">
          <h3>📊 Your Prioritization:</h3>
          <p>You chose to tackle: <strong>{priorities[0].text}</strong> first.</p>
          {priorities[0].id === '1' && <p className="feedback-good">✅ Excellent! Unblocking dependencies is critical.</p>}
          {priorities[0].id !== '1' && <p className="feedback-ok">🟡 Consider: Dependencies usually need immediate attention.</p>}
        </div>

        <button className="primary-btn" onClick={() => alert('Full assessment coming soon!')}>
          Continue to Challenge 2 →
        </button>
      </div>
    );
  }

  return null;
};

export default DailyChallenge;