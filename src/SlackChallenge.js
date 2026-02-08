import React, { useState, useEffect } from 'react';
import './SlackChallenge.css';

const SlackChallenge = ({ language, onBack }) => {
  const [stage, setStage] = useState('intro'); // intro, tutorial, crisis, outcome
  const [timeRemaining, setTimeRemaining] = useState(720); // 12 minutes
  const [demoTimeRemaining, setDemoTimeRemaining] = useState(1800); // 30 minutes
  const [startTime, setStartTime] = useState(null);
  
  // Tracking
  const [responseTimes, setResponseTimes] = useState({});
  const [responseOrder, setResponseOrder] = useState([]);
  const [coordinationAchieved, setCoordinationAchieved] = useState(false);
  const [outcomes, setOutcomes] = useState({
    productionStatus: 'down',
    demoStatus: 'pending',
    jordanStatus: 'frustrated',
    dataLoss: false,
    ceoSatisfied: false
  });
  
  // Active threads and messages
  const [threads, setThreads] = useState([
    {
      id: 'alex-critical',
      channel: '#production-critical',
      from: 'Alex',
      avatar: '😱',
      role: 'Backend Developer',
      priority: 'critical',
      status: 'pending',
      unread: 4,
      responded: false,
      firstResponseTime: null,
      messages: [
        { id: 1, from: 'Alex', text: 'PRODUCTION IS DOWN 🚨', timestamp: '4:31 PM', reactions: [] },
        { id: 2, from: 'Alex', text: 'Users are getting 500 errors everywhere', timestamp: '4:31 PM', reactions: [] },
        { id: 3, from: 'Alex', text: 'I think it\'s the DB migration we just deployed', timestamp: '4:31 PM', reactions: [] },
        { id: 4, from: 'Alex', text: 'Should I rollback??? This is critical!!!', timestamp: '4:32 PM', reactions: [] }
      ],
      startTime: Date.now()
    },
    {
      id: 'jordan-conflict',
      channel: '#production-critical',
      from: 'Jordan',
      avatar: '😤',
      role: 'Frontend Developer',
      priority: 'medium',
      status: 'pending',
      unread: 3,
      responded: false,
      firstResponseTime: null,
      messages: [
        { id: 1, from: 'Jordan', text: 'My frontend code is FINE', timestamp: '4:32 PM', reactions: [] },
        { id: 2, from: 'Jordan', text: 'This is 100% a backend issue', timestamp: '4:32 PM', reactions: [] },
        { id: 3, from: 'Jordan', text: 'Why did we deploy without proper testing???', timestamp: '4:32 PM', reactions: [] }
      ],
      startTime: Date.now() + 60000
    },
    {
      id: 'taylor-devops',
      channel: '#production-critical',
      from: 'Taylor',
      avatar: '⚙️',
      role: 'DevOps Engineer',
      priority: 'critical',
      status: 'pending',
      unread: 3,
      responded: false,
      firstResponseTime: null,
      messages: [
        { id: 1, from: 'Taylor', text: 'I can see the issue in the logs', timestamp: '4:33 PM', reactions: [] },
        { id: 2, from: 'Taylor', text: 'But I need DB access to fix it', timestamp: '4:33 PM', reactions: [] },
        { id: 3, from: 'Taylor', text: 'Alex has the credentials - can someone coordinate this?', timestamp: '4:33 PM', reactions: [] }
      ],
      startTime: Date.now() + 120000
    },
    {
      id: 'morgan-po',
      channel: '#general',
      from: 'Morgan',
      avatar: '😨',
      role: 'Product Owner',
      priority: 'high',
      status: 'pending',
      unread: 3,
      responded: false,
      firstResponseTime: null,
      messages: [
        { id: 1, from: 'Morgan', text: 'Hey, the client is asking about the demo', timestamp: '4:33 PM', reactions: [] },
        { id: 2, from: 'Morgan', text: 'It\'s in 27 minutes!!! 😰', timestamp: '4:33 PM', reactions: [] },
        { id: 3, from: 'Morgan', text: 'What should I tell them???', timestamp: '4:34 PM', reactions: [] }
      ],
      startTime: Date.now() + 180000
    },
    {
      id: 'casey-qa',
      channel: '#general',
      from: 'Casey',
      avatar: '🤔',
      role: 'QA Engineer',
      priority: 'low',
      status: 'pending',
      unread: 2,
      responded: false,
      firstResponseTime: null,
      messages: [
        { id: 1, from: 'Casey', text: 'Um... should I stop testing?', timestamp: '4:34 PM', reactions: [] },
        { id: 2, from: 'Casey', text: 'The staging environment is also down', timestamp: '4:34 PM', reactions: [] }
      ],
      startTime: Date.now() + 240000
    }
  ]);
  
  const [activeThread, setActiveThread] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [ceoThreadAdded, setCeoThreadAdded] = useState(false);
  const autoFinishTriggered = React.useRef(false);
  
  const [score, setScore] = useState({
    responseTime: 0,
    prioritization: 0,
    communication: 0,
    coordination: 0,
    stakeholderMgmt: 0,
    total: 0
  });

  // Timer countdown
  useEffect(() => {
    if (stage === 'crisis' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
        setDemoTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeRemaining === 0 && stage === 'crisis') {
      calculateFinalScore();
      setStage('outcome');
    }
  }, [stage, timeRemaining]);

  // Add CEO thread if taking too long
  useEffect(() => {
    if (stage === 'crisis' && timeRemaining < 480 && !ceoThreadAdded) { // After 4 minutes
      const alexResponded = threads.find(t => t.id === 'alex-critical')?.responded;
      if (!alexResponded) {
        addCEOThread();
        setCeoThreadAdded(true);
      }
    }
  }, [stage, timeRemaining, ceoThreadAdded, threads]);

  // Auto-finish when crisis is resolved
useEffect(() => {
  if (stage === 'crisis' && !autoFinishTriggered.current) {
    const allCriticalHandled = threads
      .filter(t => t.priority === 'critical')
      .every(t => t.responded);
    
    const productionRestored = outcomes.productionStatus === 'restored' || outcomes.productionStatus === 'restoring';
    const demoHandled = outcomes.demoStatus === 'rescheduled' || outcomes.demoStatus === 'cancelled';
    
    // If everything critical is resolved
    if (allCriticalHandled && productionRestored && demoHandled && coordinationAchieved) {
      autoFinishTriggered.current = true; // Mark as triggered
      
      // Auto-finish after 3 seconds
      setTimeout(() => {
        if (stage === 'crisis') {
          calculateFinalScore();
          setStage('outcome');
        }
      }, 3000);
    }
  }
  
  // Reset if stage changes away from crisis
  if (stage !== 'crisis') {
    autoFinishTriggered.current = false;
  }
}, [stage, threads, outcomes, coordinationAchieved]);

  const addCEOThread = () => {
    const ceoThread = {
      id: 'ceo-escalation',
      channel: '#production-critical',
      from: 'Sam (CEO)',
      avatar: '👔',
      role: 'CEO',
      priority: 'critical',
      status: 'pending',
      unread: 2,
      responded: false,
      firstResponseTime: null,
      messages: [
        { id: 1, from: 'Sam (CEO)', text: 'I heard production is down', timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), reactions: [] },
        { id: 2, from: 'Sam (CEO)', text: 'What\'s the status? Client demo is in 25 min.', timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), reactions: [] }
      ],
      startTime: Date.now()
    };
    setThreads(prev => [...prev, ceoThread]);
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Send message
  const handleSendMessage = () => {
  if (!messageInput.trim() || !activeThread) {
    console.log('Cannot send: empty message or no active thread');
    return;
  }

  console.log('Sending message:', messageInput);
  console.log('Active thread:', activeThread.id);

  const now = Date.now();
  const message = {
    id: now,
    from: 'You',
    text: messageInput,
    timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    reactions: []
  };

  // Save message text before clearing
  const messageText = messageInput;
  const threadId = activeThread.id;

  // Clear input immediately
  setMessageInput('');

  // Track response time
  if (!activeThread.responded) {
    const threadStartTime = startTime || activeThread.startTime || now;
    const responseTime = Math.round((now - threadStartTime) / 1000);
    
    setResponseTimes(prev => ({
      ...prev,
      [threadId]: responseTime
    }));
    
    setResponseOrder(prev => [...prev, threadId]);
  }

  // Update threads with new message
  setThreads(prev => {
    const updated = prev.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          messages: [...thread.messages, message],
          responded: true,
          unread: 0
        };
      }
      return thread;
    });
    
    console.log('Updated threads:', updated);
    
    // Update active thread reference
    const newActiveThread = updated.find(t => t.id === threadId);
    setActiveThread(newActiveThread);
    
    return updated;
  });

  // Analyze and respond
  analyzeAndRespond(threadId, messageText, now);
};

  // Analyze message and generate response
const analyzeAndRespond = (threadId, userMessage, timestamp) => {
  const lowerMsg = userMessage.toLowerCase();
  let responseText = '';
  let reactions = [];
  let scoreChange = 0;

  // Advanced keyword detection
  const mentionsNames = /alex|taylor|jordan|morgan|casey|sam/i.test(userMessage);
  const mentionsRoles = /backend|frontend|devops|po|product owner|qa|ceo/i.test(userMessage);
  
  // Action detection
  const hasAction = /please|need you to|can you|could you|let's|coordinate|share|send|dm|message/i.test(userMessage);
  const hasCoordination = /coordinate|connect|sync|work with|team up|pair|together|collaborate/i.test(userMessage);
  const hasTimeline = /min|minute|hour|now|asap|eta|when|soon|quick|fast|immediately/i.test(userMessage);
  
  // Wait/pause detection
  const suggestsWait = /wait|hold|pause|don't|stop|before|first|let me|let's think|assess|careful/i.test(userMessage);
  
  // Tone detection
  const isPanic = /omg|disaster|oh no|wtf|!!!|fuck|shit|crisis/i.test(userMessage);
  const isCalm = /let's|together|we can|step by step|coordinate|breath|calm|assess|carefully|think through/i.test(userMessage);
  const isEmpathetic = /know|understand|see|hear you|appreciate|thanks|get it|with you/i.test(userMessage);
  const isSpecific = userMessage.length > 25 && (mentionsNames || mentionsRoles || hasAction);
  
  // Clarity detection
  const givesDirection = /do this|go ahead|proceed|start|begin|take|make|create|update|tell|inform/i.test(userMessage);
  const asksQuestion = /\?|what|how|when|where|why|can you|could you|would you/i.test(userMessage);

  // Base scoring
  if (isSpecific) scoreChange += 5;
  if (isCalm) scoreChange += 5;
  if (isEmpathetic) scoreChange += 3;
  if (hasTimeline) scoreChange += 3;
  if (isPanic) scoreChange -= 5;
  if (mentionsNames || mentionsRoles) scoreChange += 5;
  if (hasCoordination) scoreChange += 5;

  // Thread-specific responses
  switch(threadId) {
    case 'alex-critical':
      // Best case: Don't rollback + coordinate with Taylor
      if ((suggestsWait || lowerMsg.includes("don't")) && 
          (lowerMsg.includes('rollback') || lowerMsg.includes('roll back')) &&
          (lowerMsg.includes('taylor') || hasCoordination)) {
        responseText = 'Got it! I\'ll hold off and coordinate with Taylor first 👍';
        reactions = ['👍', '🤝'];
        scoreChange += 15;
      }
      // Share credentials with Taylor
      else if ((lowerMsg.includes('taylor') || hasCoordination) && 
               (lowerMsg.includes('credential') || lowerMsg.includes('access') || 
                lowerMsg.includes('share') || lowerMsg.includes('dm') || 
                lowerMsg.includes('send') || lowerMsg.includes('give'))) {
        responseText = 'Perfect! Sharing DB credentials with Taylor in DM right now 🔑';
        reactions = ['👍', '💪', '🚀'];
        scoreChange += 25;
        
        // Trigger coordination sequence
        setTimeout(() => {
          setCoordinationAchieved(true);
          addTaylorFixMessage();
          setOutcomes(prev => ({ ...prev, productionStatus: 'restoring' }));
        }, 3000);
      }
      // Just wait/don't rollback
      else if ((suggestsWait || lowerMsg.includes("don't")) && 
               (lowerMsg.includes('rollback') || lowerMsg.includes('roll back'))) {
        responseText = 'Ok, holding off on rollback. What should I do instead?';
        reactions = ['👍'];
        scoreChange += 10;
      }
      // Approve rollback
      else if ((lowerMsg.includes('yes') || lowerMsg.includes('go ahead') || lowerMsg.includes('rollback') || givesDirection) && 
               !suggestsWait && !lowerMsg.includes("don't")) {
        responseText = 'Rolling back now... Done. Production is back but we lost 10 min of data 😬';
        reactions = ['⚠️', '😬'];
        scoreChange -= 10;
        setOutcomes(prev => ({ ...prev, productionStatus: 'restored', dataLoss: true }));
      }
      // Calming/empathetic but no direction
      else if (isEmpathetic || isCalm) {
        responseText = 'Thanks, but I need direction. Should I rollback or wait for Taylor?';
        reactions = [];
        scoreChange += 2;
      }
      // Generic/unclear
      else {
        responseText = 'I need clearer direction here. Rollback or coordinate with Taylor first?';
        reactions = [];
        scoreChange -= 3;
      }
      break;

    case 'taylor-devops':
      // Perfect: coordinate with Alex for credentials
      if ((lowerMsg.includes('alex') || hasCoordination) && 
          (lowerMsg.includes('credential') || lowerMsg.includes('access') || 
           lowerMsg.includes('db') || lowerMsg.includes('database') ||
           lowerMsg.includes('share') || lowerMsg.includes('coordinate'))) {
        responseText = 'Perfect! Once Alex shares credentials I can fix this in 5 min 🚀';
        reactions = ['💪', '⚡'];
        scoreChange += 20;
      }
      // Ask about timeline
      else if (lowerMsg.includes('fix') || lowerMsg.includes('eta') || 
               lowerMsg.includes('how long') || lowerMsg.includes('time')) {
        responseText = 'I can fix it in ~5 min once I have DB access from Alex';
        reactions = ['👍'];
        scoreChange += 8;
      }
      // Ask what they need
      else if (asksQuestion && (lowerMsg.includes('need') || lowerMsg.includes('require'))) {
        responseText = 'I need DB credentials from Alex to access the production database';
        reactions = ['🔑'];
        scoreChange += 5;
      }
      // Generic
      else {
        responseText = 'Still waiting on DB access from Alex... can you help coordinate?';
        reactions = [];
        scoreChange += 1;
      }
      break;

    case 'jordan-conflict':
      // Best: empathetic + focus on fixing first
      if ((isEmpathetic || isCalm) && 
          (lowerMsg.includes('later') || lowerMsg.includes('after') || 
           lowerMsg.includes('first') || lowerMsg.includes('focus') ||
           lowerMsg.includes('prod') || lowerMsg.includes('fix'))) {
        responseText = 'You\'re right. Let\'s fix prod first, we can debrief on process after. What can I do to help? 💪';
        reactions = ['❤️', '🙏'];
        scoreChange += 20;
        setOutcomes(prev => ({ ...prev, jordanStatus: 'supportive' }));
      }
      // Acknowledge feelings
      else if (isEmpathetic && (lowerMsg.includes('frustrat') || lowerMsg.includes('understand') || 
                                 lowerMsg.includes('hear you') || lowerMsg.includes('get it'))) {
        responseText = 'Thanks for understanding. Yeah, this is frustrating for everyone.';
        reactions = ['🙏'];
        scoreChange += 10;
      }
      // Blame or aggressive
      else if (lowerMsg.includes('fault') || lowerMsg.includes('blame') || 
               lowerMsg.includes('your') && lowerMsg.includes('problem')) {
        responseText = 'Wow. I\'m logging off. Good luck with your crisis. 😡';
        reactions = ['😡', '👋'];
        scoreChange -= 25;
        setOutcomes(prev => ({ ...prev, jordanStatus: 'quit' }));
      }
      // Short/dismissive
      else if (userMessage.length < 15 || isPanic) {
        responseText = 'Seriously? That\'s your response?? 🙄';
        reactions = ['😒'];
        scoreChange -= 10;
      }
      // Generic
      else {
        responseText = 'Fine. I\'ll wait.';
        reactions = [];
        scoreChange += 2;
      }
      break;

    case 'morgan-po':
      // Best: reschedule with specific time + transparency
      if ((lowerMsg.includes('reschedule') || lowerMsg.includes('postpone') || 
           lowerMsg.includes('delay') || lowerMsg.includes('move')) &&
          (lowerMsg.includes('hour') || lowerMsg.includes('tomorrow') || 
           lowerMsg.includes('later') || lowerMsg.includes('10') || lowerMsg.includes('am'))) {
        responseText = 'Great idea. I\'ll reach out to client and propose tomorrow 10 AM. I\'ll explain it\'s to ensure quality. Thanks for the transparency! 🙏';
        reactions = ['✅', '👍'];
        scoreChange += 25;
        setOutcomes(prev => ({ ...prev, demoStatus: 'rescheduled' }));
      }
      // Reschedule but vague
      else if (lowerMsg.includes('reschedule') || lowerMsg.includes('postpone') || 
               lowerMsg.includes('delay')) {
        responseText = 'Ok, when should I propose? Tomorrow? In a few hours?';
        reactions = ['🤔'];
        scoreChange += 10;
      }
      // Transparent update with timeline
      else if ((lowerMsg.includes('prod') || lowerMsg.includes('issue') || 
                lowerMsg.includes('problem') || lowerMsg.includes('down')) &&
               (lowerMsg.includes('min') || lowerMsg.includes('fix') || 
                lowerMsg.includes('working') || hasTimeline)) {
        responseText = 'Got it. Should I tell client we\'re fixing it now and can do demo in 30 min? Or reschedule?';
        reactions = ['👍'];
        scoreChange += 15;
      }
      // Proceed with demo anyway
      else if (lowerMsg.includes('fine') || lowerMsg.includes('proceed') || 
               lowerMsg.includes('go ahead') || lowerMsg.includes('do it')) {
        responseText = 'Are you sure? Prod is still down... this could go badly 😬';
        reactions = ['⚠️', '😬'];
        scoreChange -= 5;
      }
      // Cancel
      else if (lowerMsg.includes('cancel')) {
        responseText = 'Client just cancelled. They\'re pretty upset about this 😞';
        reactions = ['😞', '💔'];
        scoreChange -= 20;
        setOutcomes(prev => ({ ...prev, demoStatus: 'cancelled' }));
      }
      // Generic/unclear
      else {
        responseText = 'I need a clear answer for the client. Should I reschedule or try to proceed?';
        reactions = [];
        scoreChange -= 2;
      }
      break;

    case 'casey-qa':
      // Any reasonable response
      if (givesDirection || hasAction) {
        responseText = 'Got it, pausing testing now. I\'ll wait for your update. Thanks! 👍';
        reactions = ['👍', '✅'];
        scoreChange += 8;
      } else if (isEmpathetic) {
        responseText = 'No problem! Let me know when staging is back up.';
        reactions = ['🙏'];
        scoreChange += 5;
      } else {
        responseText = 'Ok, should I stop testing or keep going?';
        reactions = [];
        scoreChange += 2;
      }
      break;

    case 'ceo-escalation':
      // Best: status + ETA + next steps
      if ((lowerMsg.includes('prod') || lowerMsg.includes('issue') || lowerMsg.includes('down')) &&
          (lowerMsg.includes('taylor') || lowerMsg.includes('fix') || lowerMsg.includes('team')) &&
          (lowerMsg.includes('min') || lowerMsg.includes('eta') || hasTimeline)) {
        responseText = 'Excellent update. Keep me posted every 15 min. Let me know if you need escalation. 👍';
        reactions = ['✅', '💼'];
        scoreChange += 25;
        setOutcomes(prev => ({ ...prev, ceoSatisfied: true }));
      }
      // Status but missing timeline
      else if (lowerMsg.includes('prod') || lowerMsg.includes('issue') || 
               lowerMsg.includes('fix') || lowerMsg.includes('working')) {
        responseText = 'Ok, but I need a timeline. When will this be resolved?';
        reactions = ['⏰'];
        scoreChange += 5;
      }
      // Too short
      else if (userMessage.length < 30) {
        responseText = 'I need more details. What\'s the actual status, who\'s working on it, and what\'s the ETA?';
        reactions = [];
        scoreChange -= 8;
      }
      // Generic
      else {
        responseText = 'Thanks for the update. Keep me in the loop.';
        reactions = ['👍'];
        scoreChange += 8;
      }
      break;

    default:
      responseText = 'Got it 👍';
      reactions = ['👍'];
      break;
  }

  setScore(prev => ({ ...prev, communication: prev.communication + scoreChange }));

  // Add NPC response after 2 seconds
  setTimeout(() => {
    setThreads(prev => prev.map(thread => 
      thread.id === threadId
        ? {
            ...thread,
            messages: [
              ...thread.messages,
              {
                id: Date.now(),
                from: thread.from,
                text: responseText,
                timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                reactions: reactions
              }
            ]
          }
        : thread
    ));
  }, 2000);
};

  const addTaylorFixMessage = () => {
    setTimeout(() => {
      setThreads(prev => prev.map(thread =>
        thread.id === 'taylor-devops'
          ? {
              ...thread,
              messages: [
                ...thread.messages,
                {
                  id: Date.now(),
                  from: 'Taylor',
                  text: 'Got DB access! Working on the fix now...',
                  timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                  reactions: ['🚀']
                }
              ]
            }
          : thread
      ));

      setTimeout(() => {
        setThreads(prev => prev.map(thread =>
          thread.id === 'taylor-devops'
            ? {
                ...thread,
                messages: [
                  ...thread.messages,
                  {
                    id: Date.now() + 1,
                    from: 'Taylor',
                    text: 'Fixed! Production is back up 🎉',
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                    reactions: ['✅', '🎉']
                  }
                ]
              }
            : thread
        ));
        setOutcomes(prev => ({ ...prev, productionStatus: 'restored' }));
      }, 120000); // 2 min later
    }, 30000); // 30 sec after getting access
  };

  const handleMarkAsHandled = (threadId) => {
    setThreads(prev => prev.map(thread =>
      thread.id === threadId ? { ...thread, status: 'handled', unread: 0 } : thread
    ));
  };

  const calculateFinalScore = () => {
    let responseTimeScore = 0;
    let prioritizationScore = 0;
    let coordinationScore = 0;
    let stakeholderScore = 0;

    // Response time scoring
    const alexTime = responseTimes['alex-critical'] || 999;
    const taylorTime = responseTimes['taylor-devops'] || 999;
    const morganTime = responseTimes['morgan-po'] || 999;

    if (alexTime < 30) responseTimeScore += 30;
    else if (alexTime < 60) responseTimeScore += 20;
    else if (alexTime < 120) responseTimeScore += 10;

    if (taylorTime < 60) responseTimeScore += 20;
    else if (taylorTime < 120) responseTimeScore += 10;

    // Prioritization scoring
    const idealOrder = ['alex-critical', 'taylor-devops', 'morgan-po', 'jordan-conflict', 'casey-qa'];
    const userOrder = responseOrder.slice(0, 5);
    
    let correctPositions = 0;
    userOrder.forEach((id, idx) => {
      if (idealOrder[idx] === id) correctPositions++;
    });
    
    prioritizationScore = (correctPositions / 5) * 100;

    // Coordination
    if (coordinationAchieved) {
      coordinationScore = score.coordination + 30;
    }

    // Stakeholder
    if (outcomes.demoStatus === 'rescheduled') stakeholderScore += 20;
    if (outcomes.ceoSatisfied) stakeholderScore += 20;

    const finalScore = {
      responseTime: responseTimeScore,
      prioritization: Math.round(prioritizationScore),
      communication: score.communication,
      coordination: coordinationScore,
      stakeholderMgmt: stakeholderScore,
      total: Math.round(responseTimeScore + prioritizationScore + score.communication + coordinationScore + stakeholderScore)
    };

    setScore(finalScore);
  };

  // Intro screen
  if (stage === 'intro') {
    return (
      <div className="slack-intro">
        <div className="slack-intro-content">
          <h1 className="slack-intro-title">🔥 CHALLENGE 2: SLACK ON FIRE</h1>
          <div className="slack-intro-scenario">
            <p className="slack-intro-time">Thursday, 4:30 PM</p>
            <p className="slack-intro-text">
              Your team just deployed to production.<br/>
              You have a client demo in 30 minutes.
            </p>
            <div className="slack-intro-alert">
              <span className="alert-icon">🚨</span>
              <span className="alert-text">PRODUCTION JUST WENT DOWN</span>
            </div>
            <p className="slack-intro-text">
              Your Slack is <strong>EXPLODING</strong>.<br/>
              5 people need your immediate attention.<br/>
              The clock is ticking.
            </p>
            <div className="slack-intro-skills">
              <div className="skill-tag">Crisis Management</div>
              <div className="skill-tag">Real-time Prioritization</div>
              <div className="skill-tag">Written Communication</div>
              <div className="skill-tag">Coordination</div>
            </div>
          </div>
          <div className="slack-intro-buttons">
            {onBack && (
              <button className="back-to-menu-btn" onClick={onBack}>
                ← Back to Menu
              </button>
            )}
            <button className="start-btn" onClick={() => setStage('tutorial')}>
              CONTINUE →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tutorial screen
  if (stage === 'tutorial') {
    return (
      <div className="slack-tutorial">
        <div className="tutorial-content">
          <div className="tutorial-header">
            <h2>📋 Before You Start</h2>
            <p>Here's what you need to know:</p>
          </div>

          <div className="tutorial-sections">
            <div className="tutorial-section">
              <div className="section-icon">🎯</div>
              <h3>Your Goal</h3>
              <p>Restore production, handle the client demo, and keep your team coordinated. There are no "correct answers" — this is a real crisis situation.</p>
            </div>

            <div className="tutorial-section">
              <div className="section-icon">✍️</div>
              <h3>How It Works</h3>
              <p><strong>Write your own messages.</strong> Click on threads to read them, then type your response. Your team will react based on what you say and how quickly you respond.</p>
            </div>

            <div className="tutorial-section">
              <div className="section-icon">⚡</div>
              <h3>What We're Measuring</h3>
              <ul>
                <li><strong>Response time:</strong> Do you address critical issues fast?</li>
                <li><strong>Prioritization:</strong> Do you respond in the right order?</li>
                <li><strong>Communication:</strong> Are your messages clear and actionable?</li>
                <li><strong>Coordination:</strong> Do you connect people who need to work together?</li>
                <li><strong>Stakeholder mgmt:</strong> How do you handle the client situation?</li>
              </ul>
            </div>

            <div className="tutorial-section">
              <div className="section-icon">💡</div>
              <h3>Pro Tips</h3>
              <ul>
                <li>Read all threads quickly to understand the full situation</li>
                <li>Production down = highest priority</li>
                <li>Mention people by name and be specific about next steps</li>
                <li>Coordinate between Alex (has DB access) and Taylor (can fix)</li>
                <li>Be transparent with stakeholders (Morgan, CEO)</li>
              </ul>
            </div>
          </div>

          <div className="tutorial-footer">
            <button className="tutorial-back-btn" onClick={() => setStage('intro')}>
              ← Back
            </button>
            <button className="tutorial-start-btn" onClick={() => {
              setStage('crisis');
              setStartTime(Date.now());
            }}>
              START CHALLENGE 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Crisis screen (same as before)
  if (stage === 'crisis') {
    return (
      <div className="slack-container">
        {/* Header */}
        <div className="slack-header">
          <div className="slack-header-left">
            <span className="slack-logo">Slack</span>
            <span className="workspace-name">TechCorp Workspace</span>
          </div>
          <div className="slack-header-center">
            <div className="timer-display">
              <span className="timer-label">TIME:</span>
              <span className="timer-value">{formatTime(timeRemaining)}</span>
            </div>
<div className={`demo-timer ${demoTimeRemaining < 600 ? 'critical' : ''}`}>
              <span className="demo-label">DEMO IN:</span>
              <span className="demo-value">{formatTime(demoTimeRemaining)}</span>
            </div>
          </div>
          <div className="slack-header-right">
  <button 
    className="finish-btn"
    onClick={() => {
      calculateFinalScore();
      setStage('outcome');
    }}
  >
    🎯 FINISH CHALLENGE
  </button>
  <button className="help-btn" onClick={() => alert('Escalating to manager would show you can\'t handle crisis independently. Try resolving first!')}>
    🆘 ESCALATE
  </button>
</div>
        </div>

        {/* Main content */}
        <div className="slack-main">
          {/* Sidebar with threads */}
          <div className="slack-sidebar">
            <div className="sidebar-header">
              <h3>Channels</h3>
              <div className="pending-count">{threads.filter(t => !t.responded).length} pending</div>
            </div>
            <div className="threads-list">
              {threads.map(thread => (
                <div
                  key={thread.id}
className={`thread-item ${activeThread?.id === thread.id ? 'active' : ''} ${thread.priority}`}                  onClick={() => setActiveThread(thread)}
                >
                  <div className="thread-header">
                    <span className="thread-avatar">{thread.avatar}</span>
                    <div className="thread-info">
                      <div className="thread-from">{thread.from}</div>
                      <div className="thread-role">{thread.role}</div>
                    </div>
                    {thread.unread > 0 && (
                      <span className="unread-badge">{thread.unread}</span>
                    )}
                  </div>
                  <div className="thread-status">
                    <span className={`priority-badge ${thread.priority}`}>
                      {thread.priority === 'critical' && '🔴'}
                      {thread.priority === 'high' && '🟡'}
                      {thread.priority === 'medium' && '🟠'}
                      {thread.priority === 'low' && '🟢'}
                    </span>
                    <span className={`status-badge ${thread.status}`}>
                      {thread.responded ? '✓' : '⏰'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active thread */}
          <div className="slack-thread">
            {activeThread ? (
              <>
                <div className="thread-header-bar">
                  <div className="thread-title">
                    <span className="thread-avatar-large">{activeThread.avatar}</span>
                    <div>
                      <div className="thread-name">{activeThread.from}</div>
                      <div className="thread-channel-name">{activeThread.channel} • {activeThread.role}</div>
                    </div>
                  </div>
                  <div className="thread-actions">
                    <button 
                      className="action-btn handled"
                      onClick={() => handleMarkAsHandled(activeThread.id)}
                    >
                      ✓ Mark Handled
                    </button>
                  </div>
                </div>

                <div className="messages-container">
                  {activeThread.messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.from === 'You' ? 'user-message' : 'npc-message'}`}>
                      <div className="message-header">
                        <span className="message-from">{msg.from}</span>
                        <span className="message-time">{msg.timestamp}</span>
                      </div>
                      <div className="message-text">{msg.text}</div>
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="message-reactions">
                          {msg.reactions.map((r, i) => <span key={i}>{r}</span>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="message-input-container">
                  <textarea
                    className="message-input"
                    placeholder={`Message ${activeThread.from}... (be specific and actionable)`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button 
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                  >
                    Send →
                  </button>
                </div>
              </>
            ) : (
              <div className="no-thread-selected">
                <div className="placeholder-icon">💬</div>
                <p>Select a thread to start responding</p>
                <p className="hint-text">Tip: Start with the 🔴 critical threads</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  // Transition screen
if (stage === 'transition') {
  return (
    <div className="slack-transition">
      <div className="transition-content">
        <div className="transition-icon">🎉</div>
        <h1 className="transition-title">Crisis Resolved!</h1>
        <div className="transition-stats">
          <div className="transition-stat">
            <div className="stat-icon">✅</div>
            <div className="stat-text">Production Restored</div>
          </div>
          {outcomes.demoStatus === 'rescheduled' && (
            <div className="transition-stat">
              <div className="stat-icon">📅</div>
              <div className="stat-text">Demo Rescheduled</div>
            </div>
          )}
          {coordinationAchieved && (
            <div className="transition-stat">
              <div className="stat-icon">🤝</div>
              <div className="stat-text">Team Coordinated</div>
            </div>
          )}
        </div>
        <p className="transition-text">Calculating your performance...</p>
        <div className="loading-bar">
          <div className="loading-fill"></div>
        </div>
      </div>
    </div>
  );
}

  // Outcome screen
  if (stage === 'outcome') {
    const getRecommendation = (score) => {
      if (score >= 200) return { text: 'EXCELLENT', color: '#10b981', desc: 'Outstanding crisis management' };
      if (score >= 150) return { text: 'STRONG', color: '#3b82f6', desc: 'Solid performance under pressure' };
      if (score >= 100) return { text: 'GOOD', color: '#f59e0b', desc: 'Handled the crisis adequately' };
      return { text: 'NEEDS IMPROVEMENT', color: '#ef4444', desc: 'Struggled with prioritization' };
    };

    const rec = getRecommendation(score.total);

    return (
      <div className="slack-outcome">
        <div className="outcome-container">
          <h1 className="outcome-title">Crisis Outcome</h1>
          
          <div className="outcome-summary">
            <div className="outcome-main-score">
              <div className="main-score-value">{score.total}</div>
              <div className="main-score-label">Total Score</div>
              <div className="recommendation-tag" style={{ color: rec.color, borderColor: rec.color }}>
                {rec.text}
              </div>
              <div className="rec-description">{rec.desc}</div>
            </div>
          </div>

          <div className="outcome-breakdown">
            <h3>📊 Score Breakdown</h3>
            <div className="score-grid">
              <div className="score-item">
                <div className="score-item-label">⏱️ Response Time</div>
                <div className="score-item-value">{score.responseTime}</div>
                <div className="score-item-bar">
                  <div className="score-item-fill" style={{ width: `${(score.responseTime / 50) * 100}%` }}></div>
                </div>
              </div>
              <div className="score-item">
                <div className="score-item-label">🎯 Prioritization</div>
                <div className="score-item-value">{score.prioritization}</div>
                <div className="score-item-bar">
                  <div className="score-item-fill" style={{ width: `${score.prioritization}%` }}></div>
                </div>
              </div>
              <div className="score-item">
                <div className="score-item-label">💬 Communication</div>
                <div className="score-item-value">{score.communication}</div>
                <div className="score-item-bar">
                  <div className="score-item-fill" style={{ width: `${(score.communication / 50) * 100}%` }}></div>
                </div>
              </div>
              <div className="score-item">
                <div className="score-item-label">🤝 Coordination</div>
                <div className="score-item-value">{score.coordination}</div>
                <div className="score-item-bar">
                  <div className="score-item-fill" style={{ width: `${(score.coordination / 50) * 100}%` }}></div>
                </div>
              </div>
              <div className="score-item">
                <div className="score-item-label">📊 Stakeholder Mgmt</div>
                <div className="score-item-value">{score.stakeholderMgmt}</div>
                <div className="score-item-bar">
                  <div className="score-item-fill" style={{ width: `${(score.stakeholderMgmt / 40) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="outcome-results">
            <h3>📋 What Happened</h3>
            <div className="results-grid">
              <div className={`result-item ${outcomes.productionStatus === 'restored' ? 'success' : 'warning'}`}>
                <div className="result-icon">{outcomes.productionStatus === 'restored' ? '✅' : '⚠️'}</div>
                <div className="result-text">
                  <div className="result-label">Production</div>
                  <div className="result-value">
                    {outcomes.productionStatus === 'restored' ? 'Restored' : 'Still Down'}
                    {outcomes.dataLoss && ' (with data loss)'}
                  </div>
                </div>
              </div>
              <div className={`result-item ${outcomes.demoStatus === 'rescheduled' ? 'success' : outcomes.demoStatus === 'cancelled' ? 'error' : 'warning'}`}>
                <div className="result-icon">
                  {outcomes.demoStatus === 'rescheduled' ? '✅' : outcomes.demoStatus === 'cancelled' ? '❌' : '⏰'}
                </div>
                <div className="result-text">
                  <div className="result-label">Client Demo</div>
                  <div className="result-value">
                    {outcomes.demoStatus === 'rescheduled' ? 'Rescheduled' : 
                     outcomes.demoStatus === 'cancelled' ? 'Cancelled' : 'Pending'}
                  </div>
                </div>
              </div>
              <div className={`result-item ${outcomes.jordanStatus === 'supportive' ? 'success' : outcomes.jordanStatus === 'quit' ? 'error' : 'warning'}`}>
                <div className="result-icon">
                  {outcomes.jordanStatus === 'supportive' ? '✅' : outcomes.jordanStatus === 'quit' ? '❌' : '😤'}
                </div>
                <div className="result-text">
                  <div className="result-label">Team Morale (Jordan)</div>
                  <div className="result-value">
                    {outcomes.jordanStatus === 'supportive' ? 'Supportive' : 
                     outcomes.jordanStatus === 'quit' ? 'Quit' : 'Frustrated'}
                  </div>
                </div>
              </div>
              <div className={`result-item ${coordinationAchieved ? 'success' : 'warning'}`}>
                <div className="result-icon">{coordinationAchieved ? '✅' : '⚠️'}</div>
                <div className="result-text">
                  <div className="result-label">Coordination</div>
                  <div className="result-value">
                    {coordinationAchieved ? 'Alex ↔ Taylor Connected' : 'No Coordination'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="outcome-footer">
            <button className="back-to-menu-btn" onClick={onBack}>
              ← Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SlackChallenge;