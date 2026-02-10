import React, { useState, useEffect, useRef } from 'react';
import './RetroChallenge.css';

// ============================================================
// CHALLENGE 3 – THE RETRO THAT DOESN'T WORK
// ============================================================

const RetroChallenge = ({ language = 'en', onBack }) => {
  const [stage, setStage] = useState('intro'); // intro | setup | format | facilitation | rootcause | prioritize | actions | outcome
  const [timeRemaining, setTimeRemaining] = useState(2700); // 45 min retro
  const [startTime, setStartTime] = useState(null);
  const [energyLevel, setEnergyLevel] = useState(45); // 0-100
  const [psychSafety, setPsychSafety] = useState(50);  // 0-100
  const [focusLevel, setFocusLevel] = useState(60);    // 0-100

  // Phase 1 – Format
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [formatReason, setFormatReason] = useState('');
  const [formatGoal, setFormatGoal] = useState('');
  const [formatSubmitted, setFormatSubmitted] = useState(false);

  // Phase 2 – Facilitation
  const [currentComment, setCurrentComment] = useState(0);
  const [facilitationChoices, setFacilitationChoices] = useState([]); // [{commentId, action, outcome}]
  const [activeGroupedTopics, setActiveGroupedTopics] = useState([]);
  const [facilitationDone, setFacilitationDone] = useState(false);

  // Phase 3 – Root cause
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [doubleClickDepth, setDoubleClickDepth] = useState(0); // 0=surface, 1=layer1, 2=layer2, 3=root
  const [rootCauseChoices, setRootCauseChoices] = useState([]);

  // Phase 4 – Prioritize
  const [votes, setVotes] = useState({});
  const [priorityDone, setPriorityDone] = useState(false);
  const [topicsPrioritized, setTopicsPrioritized] = useState([]);

  // Phase 5 – Action items
  const [actionItems, setActionItems] = useState([
    { id: 1, text: '', owner: '', tracking: '' }
  ]);
  const [actionSubmitted, setActionSubmitted] = useState(false);

  // Scoring dimensions
  const [scores, setScores] = useState({
    formatIntention: 0,    // 0-25
    facilitationQuality: 0, // 0-25
    depthAnalysis: 0,       // 0-25
    prioritization: 0,      // 0-15
    actionQuality: 0,       // 0-10
  });

  const timerRef = useRef(null);

  useEffect(() => {
    if (stage === 'facilitation' || stage === 'rootcause' || stage === 'prioritize' || stage === 'actions') {
      if (timeRemaining > 0) {
        timerRef.current = setInterval(() => {
          setTimeRemaining(prev => Math.max(0, prev - 1));
        }, 1000);
      }
      return () => clearInterval(timerRef.current);
    }
  }, [stage]);

  useEffect(() => {
    if (timeRemaining === 0 && stage !== 'outcome' && stage !== 'intro' && stage !== 'setup' && stage !== 'format') {
      setStage('outcome');
    }
  }, [timeRemaining]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ──────────────────────────────────────────────
  // DATA
  // ──────────────────────────────────────────────

  const retroFormats = [
    {
      id: 'start-stop-continue',
      icon: '🔄',
      name: 'Start / Stop / Continue',
      desc: 'Identify new practices, things to drop, and what to keep.',
      bestFor: 'Teams that need clarity on habits',
    },
    {
      id: 'mad-sad-glad',
      icon: '🎭',
      name: 'Mad / Sad / Glad',
      desc: 'Surface emotional responses to the sprint.',
      bestFor: 'Teams with unspoken tension',
    },
    {
      id: 'timeline',
      icon: '📅',
      name: 'Sprint Timeline',
      desc: 'Map events and feelings chronologically.',
      bestFor: 'Understanding sequence of events',
    },
    {
      id: '4ls',
      icon: '💡',
      name: '4Ls (Liked, Learned, Lacked, Longed For)',
      desc: 'Structured four-quadrant reflection.',
      bestFor: 'Teams wanting balanced feedback',
    },
    {
      id: 'focused-actions',
      icon: '🎯',
      name: 'Action-Focused Retro',
      desc: 'Skip the venting. Go straight to "what do we change?"',
      bestFor: 'Teams stuck in problem-listing without action',
    },
    {
      id: 'open',
      icon: '🌊',
      name: 'Open / Unstructured',
      desc: 'No format. Let the team decide the conversation.',
      bestFor: 'High-trust, self-organizing teams',
    },
  ];

  // Team comments that appear during facilitation
  const teamComments = [
    {
      id: 'tc1',
      speaker: 'Lena',
      role: 'Backend Dev',
      avatar: '👩‍💻',
      text: 'The deployments were a mess again. Same as last sprint.',
      type: 'vague-repetition',
      mood: 'frustrated',
      subtext: 'Same topic raised in last 3 retros. No action was taken.',
    },
    {
      id: 'tc2',
      speaker: 'Marcus',
      role: 'Frontend Dev',
      avatar: '🧑‍💻',
      text: '...I just didn\'t have enough info when stories arrived.',
      type: 'silence-then-vague',
      mood: 'disengaged',
      subtext: 'Took 40 seconds before speaking. Trailing off.',
    },
    {
      id: 'tc3',
      speaker: 'Priya',
      role: 'Designer',
      avatar: '🎨',
      text: 'Honestly the sprint went fine for me. I completed everything.',
      type: 'deflection-positive',
      mood: 'positive',
      subtext: 'She\'s protecting herself. Design changes caused 2 rework cycles.',
    },
    {
      id: 'tc4',
      speaker: 'Dante',
      role: 'QA Engineer',
      avatar: '🔍',
      text: 'We just need to communicate better. It\'s always the same issue.',
      type: 'generic-complaint',
      mood: 'resigned',
      subtext: '"Communicate better" is a symptom, not a cause.',
    },
    {
      id: 'tc5',
      speaker: 'Lena',
      role: 'Backend Dev',
      avatar: '👩‍💻',
      text: 'Can we talk about what happened on Tuesday? That day was really bad.',
      type: 'specific-incident',
      mood: 'urgent',
      subtext: 'Tuesday = deployment failure + late rework. High-value thread.',
    },
    {
      id: 'tc6',
      speaker: 'Marcus',
      role: 'Frontend Dev',
      avatar: '🧑‍💻',
      text: '(silence)',
      type: 'silence',
      mood: 'withdrawn',
      subtext: 'Second silence from Marcus. Something is unspoken.',
    },
  ];

  const facilitationActions = {
    'tc1': [
      { id: 'a', label: 'Ask: "What specifically went wrong with deployments?"', score: 15, energyDelta: +5, focusDelta: +10, safetyDelta: +5, outcome: 'Lena opens up: "The pipeline broke twice and no one owned the fix."' },
      { id: 'b', label: 'Acknowledge it and move on to hear from others', score: 5, energyDelta: 0, focusDelta: -5, safetyDelta: 0, outcome: 'Topic passes without depth. Pattern continues.' },
      { id: 'c', label: 'Note it as a topic to prioritize later', score: 10, energyDelta: +3, focusDelta: +5, safetyDelta: +3, outcome: 'Lena nods. Deployment goes on the board for voting.' },
      { id: 'd', label: 'Say "We talked about this last sprint — let\'s focus on new things."', score: -5, energyDelta: -10, focusDelta: -5, safetyDelta: -15, outcome: 'Lena goes quiet. Others feel dismissed.' },
    ],
    'tc2': [
      { id: 'a', label: 'Wait silently for Marcus to continue', score: 12, energyDelta: +3, focusDelta: +5, safetyDelta: +8, outcome: 'Marcus adds: "The acceptance criteria were written the morning of grooming."' },
      { id: 'b', label: 'Ask: "Can you give me an example of a story that had that problem?"', score: 15, energyDelta: +5, focusDelta: +8, safetyDelta: +10, outcome: 'Marcus shares PROJ-149. Pattern becomes visible.' },
      { id: 'c', label: 'Rephrase: "Sounds like you\'d like better story refinement before sprint start?"', score: 8, energyDelta: +2, focusDelta: +5, safetyDelta: +3, outcome: 'He agrees weakly. Real root cause stays buried.' },
      { id: 'd', label: 'Move to next person — time is short', score: -8, energyDelta: -5, focusDelta: 0, safetyDelta: -10, outcome: 'Marcus disengages for the rest of the retro.' },
    ],
    'tc3': [
      { id: 'a', label: 'Ask: "What made it work for you this sprint?"', score: 8, energyDelta: +5, focusDelta: +3, safetyDelta: +5, outcome: 'Priya highlights what worked. Positive anchor for the team.' },
      { id: 'b', label: 'Say: "There were 2 design rework cycles — what happened there?"', score: 15, energyDelta: -5, focusDelta: +15, safetyDelta: -5, outcome: 'Tension rises. Priya gets defensive. But root cause emerges.' },
      { id: 'c', label: 'Thank her and move on', score: 3, energyDelta: +2, focusDelta: -5, safetyDelta: +2, outcome: 'Positive feeling but a real issue goes unaddressed.' },
      { id: 'd', label: 'Ask others: "Does the team agree the sprint went fine?"', score: 5, energyDelta: -3, focusDelta: +5, safetyDelta: -3, outcome: 'Dante mutters "not really". Mild friction.' },
    ],
    'tc4': [
      { id: 'a', label: 'Ask: "When you say communicate better — what would that look like specifically?"', score: 18, energyDelta: +5, focusDelta: +10, safetyDelta: +5, outcome: 'Dante: "Someone should flag blockers before standup, not during."' },
      { id: 'b', label: 'Agree and write "Communication" on the board', score: -5, energyDelta: 0, focusDelta: -8, safetyDelta: 0, outcome: '"Communication" is a ghost topic — vague, repeated, never actioned.' },
      { id: 'c', label: 'Say: "That\'s the third time we\'ve raised this — what\'s different now?"', score: 15, energyDelta: +3, focusDelta: +12, safetyDelta: +3, outcome: 'Team gets uncomfortable. But Dante pinpoints: "Because no one ever owns it."' },
      { id: 'd', label: 'Redirect: "Let\'s hear from the people who haven\'t spoken yet"', score: 5, energyDelta: +3, focusDelta: -3, safetyDelta: +5, outcome: 'Dante\'s thread is dropped. Communication remains a vague topic.' },
    ],
    'tc5': [
      { id: 'a', label: 'Say: "Good call. Walk us through what happened on Tuesday."', score: 18, energyDelta: +8, focusDelta: +15, safetyDelta: +5, outcome: 'Lena describes the deployment chain in detail. Key thread emerges.' },
      { id: 'b', label: 'Park it: "Let\'s add that to the board and come back if we have time."', score: 3, energyDelta: -3, focusDelta: -5, safetyDelta: -3, outcome: 'There\'s never enough time. Tuesday gets skipped.' },
      { id: 'c', label: 'Ask: "Who else was there on Tuesday?" — widen the thread', score: 15, energyDelta: +10, focusDelta: +10, safetyDelta: +8, outcome: 'Marcus and Dante both respond. Multiple perspectives surface.' },
      { id: 'd', label: 'Gently stop her: "We\'re running low on time — let\'s go deeper in priorities."', score: -3, energyDelta: -5, focusDelta: +5, safetyDelta: -8, outcome: 'Lena shuts down. Energy drops.' },
    ],
    'tc6': [
      { id: 'a', label: 'Name it softly: "Marcus, I notice you\'ve been quiet — is there something you want to add?"', score: 20, energyDelta: +5, focusDelta: +5, safetyDelta: +15, outcome: 'Marcus opens up: "I feel like my input on grooming doesn\'t go anywhere."' },
      { id: 'b', label: 'Wait 5 seconds and move on', score: -5, energyDelta: -5, focusDelta: 0, safetyDelta: -8, outcome: 'Marcus is invisible for the rest of the retro.' },
      { id: 'c', label: 'Ask the group: "Anyone else feeling like that?"', score: 10, energyDelta: +3, focusDelta: +5, safetyDelta: +8, outcome: 'Others admit similar feelings. Systemic pattern visible.' },
      { id: 'd', label: 'Use humour: "Marcus is saving the best for last, right?"', score: -10, energyDelta: +5, focusDelta: -5, safetyDelta: -12, outcome: 'Awkward laugh. Marcus doesn\'t speak for the rest of the retro.' },
    ],
  };

  // Root cause exploration
  const rootCauseLayers = {
    deployments: {
      label: '🔴 Deployment failures (recurring)',
      surface: 'Pipelines broke twice. No clear owner. Fixed manually.',
      layer1: 'DevOps tasks not in sprint backlog. Treated as "automatic".',
      layer2: 'No acceptance criteria for infrastructure work. PO doesn\'t prioritize it.',
      root: 'The team has never defined a Definition of Done for release readiness. Infrastructure is invisible until it fails.',
      questions: [
        { depth: 0, q: '"What broke specifically?"', type: 'clarifying' },
        { depth: 1, q: '"Who was responsible for fixing it?"', type: 'accountability' },
        { depth: 2, q: '"Why wasn\'t this in the sprint plan?"', type: 'systemic' },
        { depth: 3, q: '"What would have to be true for this not to happen?"', type: 'root-cause' },
      ]
    },
    stories: {
      label: '🟡 Stories arriving without context',
      surface: 'Marcus got stories the morning of grooming with no detail.',
      layer1: 'PO writes stories day-of. No refinement buffer.',
      layer2: 'Refinement sessions are optional — Marcus often skips them.',
      root: 'Grooming is decoupled from delivery. Marcus and PO don\'t have a shared definition of "ready".',
      questions: [
        { depth: 0, q: '"Which stories specifically had this problem?"', type: 'clarifying' },
        { depth: 1, q: '"When are stories written relative to grooming?"', type: 'process' },
        { depth: 2, q: '"What does \'ready for sprint\' mean to you vs. the PO?"', type: 'alignment' },
        { depth: 3, q: '"What would a story need to have for you to start without questions?"', type: 'root-cause' },
      ]
    },
    communication: {
      label: '🟠 Communication failures (generic)',
      surface: 'Team says "communication was poor" — generic, recurring.',
      layer1: 'Blockers were raised in standup, not before. No async channel for early flags.',
      layer2: 'People assume others know about blockers. Implicit expectations.',
      root: 'No agreed protocol for escalating blockers before standup. The team relies on verbal check-ins in a partially async setup.',
      questions: [
        { depth: 0, q: '"Can you give me a concrete example of a communication failure?"', type: 'clarifying' },
        { depth: 1, q: '"When should blockers be raised — and when were they actually raised?"', type: 'timing' },
        { depth: 2, q: '"What stops people from flagging early?"', type: 'barrier' },
        { depth: 3, q: '"If we had the right communication, what would the team notice first?"', type: 'root-cause' },
      ]
    },
    rework: {
      label: '🔵 Design rework cycles (2 this sprint)',
      surface: 'Two features needed rework after designs changed mid-sprint.',
      layer1: 'Priya updated designs based on stakeholder feedback without notifying dev.',
      layer2: 'No change management process for design during sprint.',
      root: 'Design and development are working in parallel with no integration checkpoint. Changes happen silently.',
      questions: [
        { depth: 0, q: '"What triggered the rework?"', type: 'clarifying' },
        { depth: 1, q: '"When did designs change and who knew about it?"', type: 'visibility' },
        { depth: 2, q: '"What\'s the handoff process between design and dev?"', type: 'process' },
        { depth: 3, q: '"What would zero-rework look like — and what would have to exist for that?"', type: 'root-cause' },
      ]
    },
  };

  const allTopics = Object.entries(rootCauseLayers).map(([id, data]) => ({ id, ...data }));

  // ──────────────────────────────────────────────
  // STAGE HANDLERS
  // ──────────────────────────────────────────────

  const handleFormatSubmit = () => {
    if (!selectedFormat || !formatReason.trim() || !formatGoal.trim()) return;

    // Score the format choice based on context fit
    let intentionScore = 0;
    const format = retroFormats.find(f => f.id === selectedFormat);

    // The team has recurring tension + unspoken issues → best fit: mad-sad-glad, timeline, 4ls
    const highFitFormats = ['mad-sad-glad', 'timeline', '4ls'];
    const medFitFormats = ['start-stop-continue'];
    const lowFitFormats = ['focused-actions', 'open'];

    if (highFitFormats.includes(selectedFormat)) intentionScore += 12;
    else if (medFitFormats.includes(selectedFormat)) intentionScore += 8;
    else intentionScore += 4;

    // Check reason quality
    const reasonWords = formatReason.trim().split(' ').length;
    const goalWords = formatGoal.trim().split(' ').length;
    if (reasonWords >= 10) intentionScore += 7;
    else if (reasonWords >= 5) intentionScore += 4;
    if (goalWords >= 8) intentionScore += 6;
    else if (goalWords >= 4) intentionScore += 3;

    setScores(prev => ({ ...prev, formatIntention: Math.min(25, intentionScore) }));
    setFormatSubmitted(true);
    setTimeout(() => setStage('facilitation'), 800);
  };

  const handleFacilitationChoice = (commentId, action) => {
    const existing = facilitationChoices.find(c => c.commentId === commentId);
    if (existing) return;

    const choice = { commentId, action };
    setFacilitationChoices(prev => [...prev, choice]);

    // Apply deltas
    setEnergyLevel(prev => Math.max(0, Math.min(100, prev + action.energyDelta)));
    setFocusLevel(prev => Math.max(0, Math.min(100, prev + action.focusDelta)));
    setPsychSafety(prev => Math.max(0, Math.min(100, prev + action.safetyDelta)));

    // Score
    setScores(prev => ({
      ...prev,
      facilitationQuality: Math.min(25, prev.facilitationQuality + Math.max(0, action.score / (teamComments.length)))
    }));

    // Add topic to board if applicable
    const comment = teamComments.find(c => c.id === commentId);
    if (comment && action.score >= 10 && !activeGroupedTopics.find(t => t.id === commentId)) {
      setActiveGroupedTopics(prev => [...prev, { id: commentId, label: comment.text.substring(0, 40) + '...' }]);
    }

    // Advance comment
    if (currentComment < teamComments.length - 1) {
      setTimeout(() => setCurrentComment(prev => prev + 1), 600);
    } else {
      setTimeout(() => setFacilitationDone(true), 600);
    }
  };

  const handleDoubleClick = (topic) => {
    if (!selectedTopic || selectedTopic.id !== topic.id) {
      setSelectedTopic(topic);
      setDoubleClickDepth(0);
      return;
    }
    if (doubleClickDepth < 3) {
      const newDepth = doubleClickDepth + 1;
      setDoubleClickDepth(newDepth);

      // Depth scoring: going too deep costs focus
      if (newDepth === 3) {
        setScores(prev => ({ ...prev, depthAnalysis: Math.min(25, prev.depthAnalysis + 8) }));
        setFocusLevel(prev => Math.max(0, prev - 5));
      } else if (newDepth === 2) {
        setScores(prev => ({ ...prev, depthAnalysis: Math.min(25, prev.depthAnalysis + 5) }));
      } else {
        setScores(prev => ({ ...prev, depthAnalysis: Math.min(25, prev.depthAnalysis + 2) }));
      }
    }
  };

  const handleVote = (topicId) => {
    const currentVotes = votes[topicId] || 0;
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    if (totalVotes >= 3) return; // max 3 votes total
    setVotes(prev => ({ ...prev, [topicId]: currentVotes + 1 }));
  };

  const handleConfirmPriority = () => {
    const sorted = allTopics
      .map(t => ({ ...t, votes: votes[t.id] || 0 }))
      .sort((a, b) => b.votes - a.votes);
    setTopicsPrioritized(sorted);

    const votedCount = Object.values(votes).filter(v => v > 0).length;
    const prioritizationScore = votedCount >= 2 ? 15 : votedCount === 1 ? 8 : 3;
    setScores(prev => ({ ...prev, prioritization: prioritizationScore }));
    setPriorityDone(true);
    setTimeout(() => setStage('actions'), 600);
  };

  const handleActionSubmit = () => {
    const filled = actionItems.filter(a => a.text.trim() && a.owner.trim() && a.tracking.trim());

    let actionScore = 0;
    filled.forEach(item => {
      const text = item.text.toLowerCase();
      // Generic bad actions
      const generic = ['communicate', 'talk more', 'be better', 'improve', 'try to'];
      const isGeneric = generic.some(g => text.includes(g));
      if (isGeneric) {
        actionScore -= 3;
      } else {
        actionScore += 4;
        if (item.tracking.trim().length > 10) actionScore += 2;
        if (item.owner.trim().length > 2) actionScore += 1;
      }
    });

    if (filled.length > 2) actionScore -= 3; // too many actions
    if (filled.length === 0) actionScore = 0;

    setScores(prev => ({ ...prev, actionQuality: Math.max(0, Math.min(10, actionScore)) }));
    setActionSubmitted(true);
    setTimeout(() => setStage('outcome'), 800);
  };

  const getTotalScore = () => Object.values(scores).reduce((a, b) => a + b, 0);

  const getFacilitatorProfile = (total) => {
    if (total >= 85) return { type: 'Strategic Facilitator', color: '#10b981', desc: 'You read the room, went deep where it mattered, and closed with precision.' };
    if (total >= 70) return { type: 'Empathetic Facilitator', color: '#3b82f6', desc: 'Strong relational skills. Action clarity needs work.' };
    if (total >= 55) return { type: 'Structured Facilitator', color: '#f59e0b', desc: 'Good process. Missed opportunities to go deeper.' };
    if (total >= 40) return { type: 'Reactive Facilitator', color: '#f97316', desc: 'Responded well in moments, but lacked intentional thread.' };
    return { type: 'Surface Facilitator', color: '#ef4444', desc: 'Stayed on the surface throughout. No root cause reached.' };
  };

  // ──────────────────────────────────────────────
  // RENDER HELPERS
  // ──────────────────────────────────────────────

  const StatusBar = ({ label, value, color }) => (
    <div className="rc-stat-bar">
      <span className="rc-stat-label">{label}</span>
      <div className="rc-bar-track">
        <div className="rc-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="rc-stat-value">{value}%</span>
    </div>
  );

  const Header = () => (
    <div className="rc-header">
      <div className="rc-header-title">
        <span className="rc-phase-badge">CHALLENGE 3</span>
        <h2>The Retro That Doesn't Work</h2>
      </div>
      <div className="rc-header-stats">
        <StatusBar label="⚡ Energy" value={energyLevel} color="#f59e0b" />
        <StatusBar label="🛡 Safety" value={psychSafety} color="#10b981" />
        <StatusBar label="🎯 Focus" value={focusLevel} color="#3b82f6" />
      </div>
      <div className="rc-timer">
        <span className="rc-timer-label">RETRO TIME</span>
        <span className={`rc-timer-value ${timeRemaining < 600 ? 'urgent' : ''}`}>{formatTime(timeRemaining)}</span>
      </div>
    </div>
  );

  // ──────────────────────────────────────────────
  // STAGES
  // ──────────────────────────────────────────────

  if (stage === 'intro') {
    return (
      <div className="rc-intro">
        <div className="rc-intro-inner">
          <div className="rc-intro-badge">CHALLENGE 3 / 5</div>
          <h1 className="rc-intro-title">The Retro<br /><span>That Doesn't Work</span></h1>
          <div className="rc-intro-scenario">
            <p className="rc-time-tag">Friday, 4:00 PM — End of Sprint 14</p>
            <p>Sprint objectives: completed. Barely.</p>
            <p>There was tension the last three days. Two deployment failures. One silent team member. One team member who thinks everything is fine.</p>
            <p>You've run this retro before. <span className="rc-highlight">Nothing changed.</span></p>
            <p className="rc-final-line">Today has to be different. Or it won't be.</p>
          </div>
          <div className="rc-intro-skills">
            <span className="rc-skill-tag">Format Selection</span>
            <span className="rc-skill-tag">Active Facilitation</span>
            <span className="rc-skill-tag">Root Cause Analysis</span>
            <span className="rc-skill-tag">Prioritization</span>
            <span className="rc-skill-tag">Action Quality</span>
          </div>
          <div className="rc-intro-btns">
            {onBack && <button className="rc-back-btn" onClick={onBack}>← Back</button>}
            <button className="rc-start-btn" onClick={() => setStage('setup')}>
              ENTER THE RETRO →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'setup') {
    return (
      <div className="rc-setup">
        <div className="rc-setup-inner">
          <h2>🔍 Before you open the room</h2>
          <p className="rc-setup-subtitle">You have 2 minutes. What do you know?</p>

          <div className="rc-setup-cards">
            <div className="rc-info-card">
              <div className="rc-info-icon">📊</div>
              <h4>Sprint Velocity</h4>
              <p>38 pts delivered / 42 committed</p>
              <p className="rc-info-sub">3rd sprint under target. No pattern identified.</p>
            </div>
            <div className="rc-info-card warning">
              <div className="rc-info-icon">🔴</div>
              <h4>Recurring Themes</h4>
              <p>"Communication" raised in last 3 retros.</p>
              <p className="rc-info-sub">No action item was closed from the last retro.</p>
            </div>
            <div className="rc-info-card">
              <div className="rc-info-icon">👥</div>
              <h4>Team Mood (check-in)</h4>
              <p>Lena: 😤 &nbsp; Marcus: 😶 &nbsp; Priya: 😊 &nbsp; Dante: 😑</p>
              <p className="rc-info-sub">Energy: medium-low. Mixed signals.</p>
            </div>
            <div className="rc-info-card warning">
              <div className="rc-info-icon">⚠️</div>
              <h4>Open Issues</h4>
              <p>2 design rework cycles mid-sprint.</p>
              <p className="rc-info-sub">Deployment pipeline failed twice. No post-mortem done.</p>
            </div>
          </div>

          <button className="rc-continue-btn" onClick={() => setStage('format')}>
            Choose Your Format →
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'format') {
    return (
      <div className="rc-format">
        <div className="rc-format-inner">
          <h2>🎯 Phase 1 — Choose Your Format</h2>
          <p className="rc-format-sub">Given what you know — how do you open this retro?</p>

          <div className="rc-formats-grid">
            {retroFormats.map(f => (
              <div
                key={f.id}
                className={`rc-format-card ${selectedFormat === f.id ? 'selected' : ''}`}
                onClick={() => setSelectedFormat(f.id)}
              >
                <div className="rc-format-icon">{f.icon}</div>
                <div className="rc-format-name">{f.name}</div>
                <div className="rc-format-desc">{f.desc}</div>
                <div className="rc-format-best">Best for: {f.bestFor}</div>
                {selectedFormat === f.id && <div className="rc-format-check">✓</div>}
              </div>
            ))}
          </div>

          {selectedFormat && (
            <div className="rc-format-explain">
              <div className="rc-explain-group">
                <label>Why are you choosing this format?</label>
                <textarea
                  placeholder="What is your reasoning given the team's current state?"
                  value={formatReason}
                  onChange={e => setFormatReason(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="rc-explain-group">
                <label>What do you want to achieve with it?</label>
                <textarea
                  placeholder="What specific outcome are you designing for?"
                  value={formatGoal}
                  onChange={e => setFormatGoal(e.target.value)}
                  rows={3}
                />
              </div>
              <button
                className="rc-continue-btn"
                onClick={handleFormatSubmit}
                disabled={!formatReason.trim() || !formatGoal.trim()}
              >
                Open the Retro →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (stage === 'facilitation') {
    const comment = teamComments[currentComment];
    const alreadyChosen = facilitationChoices.find(c => c.commentId === comment?.id);
    const actions = comment ? facilitationActions[comment.id] : [];
    const chosenAction = alreadyChosen ? actions?.find(a => a.id === alreadyChosen.action.id) : null;

    return (
      <div className="rc-facilitation">
        <Header />
        <div className="rc-facilitation-body">
          <div className="rc-phase-title">
            <h3>🗣 Phase 2 — Facilitation</h3>
            <span className="rc-comment-counter">{currentComment + 1} / {teamComments.length}</span>
          </div>

          {comment && (
            <div className="rc-comment-card">
              <div className="rc-comment-header">
                <span className="rc-avatar">{comment.avatar}</span>
                <div>
                  <div className="rc-speaker-name">{comment.speaker}</div>
                  <div className="rc-speaker-role">{comment.role}</div>
                </div>
                <div className={`rc-mood-tag mood-${comment.mood}`}>{comment.mood}</div>
              </div>
              <div className="rc-comment-text">"{comment.text}"</div>
              {alreadyChosen && (
                <div className="rc-comment-subtext">
                  <span className="rc-subtext-label">🔍 Context visible now:</span> {comment.subtext}
                </div>
              )}
            </div>
          )}

          {comment && !alreadyChosen && (
            <div className="rc-actions-grid">
              <p className="rc-actions-label">How do you respond?</p>
              {actions.map(action => (
                <button
                  key={action.id}
                  className="rc-action-btn"
                  onClick={() => handleFacilitationChoice(comment.id, action)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {alreadyChosen && chosenAction && (
            <div className="rc-outcome-bubble">
              <span className="rc-outcome-icon">→</span>
              {chosenAction.outcome}
            </div>
          )}

          {facilitationDone && (
            <div className="rc-facilitation-done">
              <p>All team members heard. Time to go deeper.</p>
              <button className="rc-continue-btn" onClick={() => setStage('rootcause')}>
                Explore Root Causes →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (stage === 'rootcause') {
    const layers = selectedTopic ? rootCauseLayers[selectedTopic.id] : null;

    return (
      <div className="rc-rootcause">
        <Header />
        <div className="rc-rootcause-body">
          <div className="rc-phase-title">
            <h3>🔬 Phase 3 — Root Cause</h3>
            <span className="rc-hint-small">Click a topic. Then double-click to go deeper. Stop when you reach root.</span>
          </div>

          <div className="rc-topics-list">
            {allTopics.map(topic => (
              <div
                key={topic.id}
                className={`rc-topic-item ${selectedTopic?.id === topic.id ? 'selected' : ''}`}
                onClick={() => handleDoubleClick(topic)}
              >
                <div className="rc-topic-label">{topic.label}</div>
                {selectedTopic?.id === topic.id && (
                  <div className="rc-depth-indicator">
                    {[0,1,2,3].map(d => (
                      <span key={d} className={`rc-depth-dot ${doubleClickDepth >= d ? 'active' : ''}`} />
                    ))}
                    <span className="rc-depth-label">depth {doubleClickDepth}/3</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {layers && (
            <div className="rc-layer-panel">
              <div className={`rc-layer ${doubleClickDepth >= 0 ? 'visible' : ''}`}>
                <span className="rc-layer-tag surface">SURFACE</span>
                <p>{layers.surface}</p>
                <div className="rc-layer-q">💬 "{layers.questions[0].q}"</div>
              </div>

              {doubleClickDepth >= 1 && (
                <div className="rc-layer animate-in">
                  <span className="rc-layer-tag layer1">LAYER 1</span>
                  <p>{layers.layer1}</p>
                  <div className="rc-layer-q">💬 "{layers.questions[1].q}"</div>
                </div>
              )}

              {doubleClickDepth >= 2 && (
                <div className="rc-layer animate-in">
                  <span className="rc-layer-tag layer2">LAYER 2</span>
                  <p>{layers.layer2}</p>
                  <div className="rc-layer-q">💬 "{layers.questions[2].q}"</div>
                </div>
              )}

              {doubleClickDepth >= 3 && (
                <div className="rc-layer animate-in root-found">
                  <span className="rc-layer-tag root">🎯 ROOT CAUSE</span>
                  <p>{layers.root}</p>
                  <div className="rc-layer-q">💬 "{layers.questions[3].q}"</div>
                </div>
              )}

              {doubleClickDepth < 3 && selectedTopic && (
                <button className="rc-drill-btn" onClick={() => handleDoubleClick(selectedTopic)}>
                  ↓ Go deeper
                </button>
              )}
            </div>
          )}

          <button
            className="rc-continue-btn rc-continue-bottom"
            onClick={() => setStage('prioritize')}
          >
            Prioritize →
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'prioritize') {
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

    return (
      <div className="rc-prioritize">
        <Header />
        <div className="rc-prioritize-body">
          <div className="rc-phase-title">
            <h3>🗳 Phase 4 — Prioritization</h3>
            <span className="rc-hint-small">3 votes total. Use them with intention. Not everything gets worked on.</span>
          </div>

          <div className="rc-vote-remaining">
            {[0,1,2].map(i => (
              <span key={i} className={`rc-vote-dot ${totalVotes > i ? 'used' : ''}`}>●</span>
            ))}
            <span className="rc-vote-label">{3 - totalVotes} votes remaining</span>
          </div>

          <div className="rc-topics-vote-grid">
            {allTopics.map(topic => (
              <div key={topic.id} className={`rc-vote-card ${(votes[topic.id] || 0) > 0 ? 'voted' : ''}`}>
                <div className="rc-vote-label">{topic.label}</div>
                <div className="rc-vote-count">{votes[topic.id] || 0} votes</div>
                <button
                  className="rc-vote-btn"
                  onClick={() => handleVote(topic.id)}
                  disabled={totalVotes >= 3 && !(votes[topic.id] > 0)}
                >
                  {(votes[topic.id] || 0) > 0 ? '✓ Voted' : '+ Vote'}
                </button>
              </div>
            ))}
          </div>

          <button
            className="rc-continue-btn"
            onClick={handleConfirmPriority}
            disabled={totalVotes === 0}
          >
            Confirm Priority →
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'actions') {
    return (
      <div className="rc-actions">
        <Header />
        <div className="rc-actions-body">
          <div className="rc-phase-title">
            <h3>✍️ Phase 5 — Action Items</h3>
            <span className="rc-hint-small">Max 2 actions. Specific. Assigned. Trackable. Generic = no score.</span>
          </div>

          {topicsPrioritized.slice(0, 1).map(topic => (
            <div key={topic.id} className="rc-top-topic">
              <span className="rc-top-label">Top priority:</span> {topic.label}
              <div className="rc-root-reminder">Root cause: {rootCauseLayers[topic.id]?.root}</div>
            </div>
          ))}

          <div className="rc-action-items">
            {actionItems.map((item, idx) => (
              <div key={item.id} className="rc-action-item-form">
                <div className="rc-action-num">Action {idx + 1}</div>
                <input
                  type="text"
                  placeholder="What will happen? (specific, concrete)"
                  value={item.text}
                  onChange={e => setActionItems(prev => prev.map((a, i) => i === idx ? { ...a, text: e.target.value } : a))}
                />
                <input
                  type="text"
                  placeholder="Who owns it?"
                  value={item.owner}
                  onChange={e => setActionItems(prev => prev.map((a, i) => i === idx ? { ...a, owner: e.target.value } : a))}
                />
                <input
                  type="text"
                  placeholder="How will you track it? (e.g. ticket in Jira, check in retro)"
                  value={item.tracking}
                  onChange={e => setActionItems(prev => prev.map((a, i) => i === idx ? { ...a, tracking: e.target.value } : a))}
                />
              </div>
            ))}
          </div>

          {actionItems.length < 2 && (
            <button
              className="rc-add-action-btn"
              onClick={() => setActionItems(prev => [...prev, { id: prev.length + 1, text: '', owner: '', tracking: '' }])}
            >
              + Add second action
            </button>
          )}

          <button
            className="rc-continue-btn"
            onClick={handleActionSubmit}
            disabled={!actionItems[0]?.text.trim()}
          >
            Close the Retro →
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'outcome') {
    const total = getTotalScore();
    const profile = getFacilitatorProfile(total);
    const maxPossible = 100;

    return (
      <div className="rc-outcome">
        <div className="rc-outcome-inner">
          <h1 className="rc-outcome-title">Retro Complete</h1>

          <div className="rc-profile-badge" style={{ borderColor: profile.color, color: profile.color }}>
            <div className="rc-profile-type">{profile.type}</div>
            <div className="rc-profile-desc">{profile.desc}</div>
          </div>

          <div className="rc-outcome-score">
            <div className="rc-total-score" style={{ color: profile.color }}>{total}</div>
            <div className="rc-total-label">/ {maxPossible}</div>
          </div>

          <div className="rc-breakdown">
            <h3>Score Breakdown</h3>
            {[
              { label: '🎯 Format Intention', val: scores.formatIntention, max: 25 },
              { label: '🗣 Facilitation Quality', val: Math.round(scores.facilitationQuality), max: 25 },
              { label: '🔬 Depth of Analysis', val: scores.depthAnalysis, max: 25 },
              { label: '🗳 Prioritization', val: scores.prioritization, max: 15 },
              { label: '✍️ Action Quality', val: scores.actionQuality, max: 10 },
            ].map((item, i) => (
              <div key={i} className="rc-breakdown-row">
                <span className="rc-breakdown-label">{item.label}</span>
                <div className="rc-breakdown-bar">
                  <div
                    className="rc-breakdown-fill"
                    style={{
                      width: `${(item.val / item.max) * 100}%`,
                      background: profile.color
                    }}
                  />
                </div>
                <span className="rc-breakdown-val">{item.val}/{item.max}</span>
              </div>
            ))}
          </div>

          <div className="rc-room-outcome">
            <h3>🧠 Room Outcome</h3>
            <div className="rc-room-stats">
              <div className={`rc-room-stat ${energyLevel >= 50 ? 'good' : 'low'}`}>
                <span>⚡ Energy</span>
                <span>{energyLevel}%</span>
              </div>
              <div className={`rc-room-stat ${psychSafety >= 55 ? 'good' : 'low'}`}>
                <span>🛡 Safety</span>
                <span>{psychSafety}%</span>
              </div>
              <div className={`rc-room-stat ${focusLevel >= 55 ? 'good' : 'low'}`}>
                <span>🎯 Focus</span>
                <span>{focusLevel}%</span>
              </div>
            </div>
          </div>

          <div className="rc-actions-review">
            <h3>📋 Actions You Set</h3>
            {actionItems.filter(a => a.text.trim()).map((a, i) => (
              <div key={i} className="rc-action-review-item">
                <div className="rc-ar-text">"{a.text}"</div>
                <div className="rc-ar-meta">
                  Owner: <strong>{a.owner || '(none)'}</strong> &nbsp;·&nbsp;
                  Tracking: <strong>{a.tracking || '(none)'}</strong>
                </div>
                {a.text.toLowerCase().includes('communicate') && (
                  <div className="rc-ar-warning">⚠️ This reads as generic. Actions like "communicate better" rarely change anything.</div>
                )}
              </div>
            ))}
          </div>

          <div className="rc-outcome-footer">
            {onBack && (
              <button className="rc-back-btn" onClick={onBack}>
                ← Back to Menu
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RetroChallenge;