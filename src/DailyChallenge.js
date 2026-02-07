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
  const [activeView, setActiveView] = useState('zoom');


  const teamMembers = [
  { 
    id: 1, 
    name: 'Alex',
    role: 'Backend Dev',
    avatarUrl: 'https://i.pravatar.cc/200?img=12',
    status: 'camera-off',
    mood: 'stressed',
    issue: 'blocked-silent',
    details: 'Has been stuck on API endpoints for 2 days. Not asking for help. Camera off - red flag.'
  },
  { 
    id: 2, 
    name: 'Jordan',
    role: 'Frontend Dev',
    avatarUrl: 'https://i.pravatar.cc/200?img=32',
    status: 'online',
    mood: 'frustrated',
    issue: 'interrupts',
    details: 'Work is blocked waiting for Alex. Getting impatient. Interrupting constantly.'
  },
  { 
    id: 3, 
    name: 'Sam',
    role: 'QA Engineer',
    avatarUrl: 'https://i.pravatar.cc/200?img=47',
    status: 'online',
    mood: 'disengaged',
    issue: 'silent-frustrated',
    details: 'Silent, arms crossed, looking away. Something is bothering them but not speaking up.'
  },
  { 
    id: 4, 
    name: 'Casey',
    role: 'Designer',
    avatarUrl: 'https://i.pravatar.cc/200?img=68',
    status: 'online',
    mood: 'positive',
    issue: 'normal',
    details: 'Collaborative and positive. No issues detected.'
  },
  { 
    id: 5, 
    name: 'Morgan',
    role: 'Product Owner',
    avatarUrl: 'https://i.pravatar.cc/200?img=35',
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
  const slackMessages = [
  { id: 1, user: 'Jordan', time: '8:47 AM', text: 'Hey @Alex, any update on those API endpoints? Need them today.', reactions: ['👀'] },
  { id: 2, user: 'Alex', time: '8:52 AM', text: 'Working on it', reactions: [] },
  { id: 3, user: 'Jordan', time: '8:53 AM', text: 'That\'s what you said yesterday... I\'m completely blocked here.', reactions: ['😬'] },
  { id: 4, user: 'Sam', time: '8:55 AM', text: '...', reactions: [] },
  { id: 5, user: 'Casey', time: '9:01 AM', text: 'Morning team! 🎨 Just uploaded the new designs to Figma', reactions: ['🎉', '❤️'] },
  { id: 6, user: 'Jordan', time: '9:03 AM', text: '@Alex seriously, I need a real ETA. This is getting ridiculous.', reactions: ['😤'] },
];

const emails = [
  { id: 1, from: 'CEO', subject: 'RE: Q1 Feature Deadline', preview: 'I just heard from the client that the integration feature won\'t be ready for Friday\'s demo...', unread: true, priority: 'high' },
  { id: 2, from: 'Morgan (PO)', subject: 'Sprint Planning - Missing Items', preview: 'We still don\'t have estimates for 3 critical stories...', unread: true, priority: 'medium' },
  { id: 3, from: 'Alex', subject: 'Blocked on deployment', preview: 'Hey, I\'m running into some issues with the staging environment...', unread: false, priority: 'medium' },
];

const jiraTickets = [
  { id: 'PROJ-142', title: 'API endpoint integration', assignee: 'Alex', status: 'In Progress', priority: 'High', storyPoints: 8 },
  { id: 'PROJ-143', title: 'Frontend integration with API', assignee: 'Jordan', status: 'Blocked', priority: 'High', storyPoints: 5 },
  { id: 'PROJ-144', title: 'QA testing for new feature', assignee: 'Sam', status: 'To Do', priority: 'Medium', storyPoints: 3 },
  { id: 'PROJ-145', title: 'Update design mockups', assignee: 'Casey', status: 'Done', priority: 'Low', storyPoints: 2 },
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
              <img src={member.avatarUrl} alt={member.name} className="avatar-large" />
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
              <img src={selectedMember.avatarUrl} alt={selectedMember.name} className="avatar-huge" />
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
        <div className="view-tabs">
          <button 
            className={`view-tab ${activeView === 'zoom' ? 'active' : ''}`}
            onClick={() => setActiveView('zoom')}
          >
            📹 Zoom
          </button>
          <button 
            className={`view-tab ${activeView === 'slack' ? 'active' : ''}`}
            onClick={() => setActiveView('slack')}
          >
            💬 Slack
          </button>
          <button 
            className={`view-tab ${activeView === 'email' ? 'active' : ''}`}
            onClick={() => setActiveView('email')}
          >
            📧 Email
          </button>
          <button 
            className={`view-tab ${activeView === 'jira' ? 'active' : ''}`}
            onClick={() => setActiveView('jira')}
          >
            📋 Jira
          </button>
        </div>
      </div>

      {/* ZOOM VIEW */}
      {activeView === 'zoom' && (
        <>
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
                      <img src={member.avatarUrl} alt={member.name} className="avatar-zoom" />
                      <p>Camera Off</p>
                    </div>
                  ) : (
                    <img src={member.avatarUrl} alt={member.name} className="avatar-zoom" />
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
        </>
      )}

      {/* SLACK VIEW */}
      {activeView === 'slack' && (
        <div className="slack-view">
          <div className="slack-header">
            <h3>#team-standup</h3>
            <p className="channel-desc">Daily standup channel · 5 members</p>
          </div>
          <div className="slack-messages">
            {slackMessages.map(msg => (
              <div key={msg.id} className="slack-message">
                <div className="msg-header">
                  <strong>{msg.user}</strong>
                  <span className="msg-time">{msg.time}</span>
                </div>
                <div className="msg-text">{msg.text}</div>
                {msg.reactions.length > 0 && (
                  <div className="msg-reactions">
                    {msg.reactions.map((reaction, i) => (
                      <span key={i} className="reaction">{reaction}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EMAIL VIEW */}
      {activeView === 'email' && (
        <div className="email-view">
          <div className="email-header">
            <h3>Inbox</h3>
            <p className="inbox-count">3 messages</p>
          </div>
          <div className="email-list">
            {emails.map(email => (
              <div key={email.id} className={`email-item ${email.unread ? 'unread' : ''}`}>
                <div className="email-from">
                  {email.unread && <span className="unread-dot">●</span>}
                  <strong>{email.from}</strong>
                  {email.priority === 'high' && <span className="priority-badge">! High Priority</span>}
                </div>
                <div className="email-subject">{email.subject}</div>
                <div className="email-preview">{email.preview}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JIRA VIEW */}
      {activeView === 'jira' && (
        <div className="jira-view">
          <div className="jira-header">
            <h3>Sprint Board</h3>
            <p className="sprint-info">Sprint 12 · 3 days remaining</p>
          </div>
          <div className="jira-tickets">
            {jiraTickets.map(ticket => (
              <div key={ticket.id} className={`jira-ticket priority-${ticket.priority.toLowerCase()}`}>
                <div className="ticket-header">
                  <span className="ticket-id">{ticket.id}</span>
                  <span className={`ticket-status status-${ticket.status.toLowerCase().replace(' ', '-')}`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="ticket-title">{ticket.title}</div>
                <div className="ticket-footer">
                  <span className="ticket-assignee">👤 {ticket.assignee}</span>
                  <span className="ticket-points">{ticket.storyPoints} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentDialogue >= dialogue.length - 1 && (
        <button className="primary-btn" onClick={() => setStage('detection')}>
          Daily Ended - Analyze What Happened →
        </button>
      )}

      {selectedMember && (
        <div className="member-detail-modal" onClick={() => setSelectedMember(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedMember(null)}>×</button>
            <img src={selectedMember.avatarUrl} alt={selectedMember.name} className="avatar-huge" />
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