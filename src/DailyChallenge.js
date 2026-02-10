import React, { useState, useEffect } from 'react';
import './DailyChallenge.css';
import AssessmentReport from './AssessmentReport';
import AIChatbot from './AIChatbot';


const DailyChallenge = ({ language: initialLanguage, onBack }) => {
  const [stage, setStage] = useState('intro');
  const [currentDialogue, setCurrentDialogue] = useState(0);
  const [detectedIssues, setDetectedIssues] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [teamHealth, setTeamHealth] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [priorities, setPriorities] = useState([]);
  const [activeView, setActiveView] = useState('zoom');
  const [slackInput, setSlackInput] = useState('');
  const [slackSent, setSlackSent] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [language, setLanguage] = useState(initialLanguage || 'en');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [jiraBoardTickets, setJiraBoardTickets] = useState({
  todo: [
    { id: 'PROJ-144', title: 'QA testing for new feature', assignee: 'Sam', priority: 'Medium', storyPoints: 3 }
  ],
  inProgress: [
    { id: 'PROJ-142', title: 'API endpoint integration', assignee: 'Alex', priority: 'High', storyPoints: 8 }
  ],
  blocked: [
    { id: 'PROJ-143', title: 'Frontend integration with API', assignee: 'Jordan', priority: 'High', storyPoints: 5 }
  ],
  done: [
    { id: 'PROJ-145', title: 'Update design mockups', assignee: 'Casey', priority: 'Low', storyPoints: 2 }
  ]
});
const [draggedTicket, setDraggedTicket] = useState(null);
const [priorityNote, setPriorityNote] = useState('');



// Translations
const translations = {
  en: {
    // INTRO
    introTitle1: "A NORMAL",
    introTitle2: "AS A SCRUM MASTER",
    introTime: "Monday, 9:00 AM",
    introStory1: "You just arrived at the office with your coffee.",
    introStory2Slack: "Slack:",
    introStory2Messages: "47 unread messages",
    introStory3Calendar: "Calendar:",
    introStory3Meetings: "6 back-to-back meetings",
    introStory4Sprint: "Sprint ends in 3 days. You're at",
    introStory4Completion: "60% completion",
    introStory5: "Your phone vibrates. Message from the CEO.",
    rulesTitle: "THE RULES",
    rule1: "You have",
    rule1Time: "45 minutes",
    rule2: "Your camera and screen are",
    rule2Recording: "recording",
    rule3: "You can use",
    rule3AI: "any AI tool",
    rule3You: "you want",
    rule4: "Your goal: Keep the team alive",
    startBtn: "START ASSESSMENT",
    disclaimer: "This simulation will test your real skills as a Scrum Master.\nGood luck. You'll need it.",
    
    // CHALLENGE 1
    challenge1Title: "🎬 Challenge 1: The Daily From Hell",
    challenge1Desc: "It's 9:00 AM. Time for the daily standup. You join the Zoom call and immediately sense something is... off.",
    joinDaily: "Join Daily Standup →",
    
    // TEAM MEMBERS
    teamHealth: "Team Health",
    timeRemaining: "Time Remaining",
    cameraOff: "🔴 Camera OFF",
    online: "🟢 Online",
    joinedLate: "🟡 Joined Late",
    
    // DETECTION
    detectionTitle: "🔍 What problems did you detect?",
    detectionHint: "Click all issues you noticed (you'll be scored on accuracy)",
    continue: "Continue",
    issuesDetected: "issues detected",
    
    // ISSUES
    issueAlexBlocked: "🚧 Alex is blocked but not saying it",
    issueJordanFrustrated: "😤 Jordan is frustrated and interrupting",
    issueSamDisengaged: "🤐 Sam (QA) is disengaged/unhappy",
    issueMorganDistracted: "📱 Morgan (PO) is distracted",
    issueDependency: "🔗 Dependency blocker (Jordan waiting for Alex)",
    issueTension: "⚡ Tension building between team members",
    issueCaseyTrap: "❌ Casey has a problem (TRAP - this is wrong)",
    
    // PRIORITY
    priorityTitle: "📊 Prioritize Your Actions",
    priorityHint: "Use arrows to reorder - what do you tackle FIRST?",
    confirmPriorities: "Confirm Priorities →",
    
    // ACTIONS
    action1: "Unblock Alex immediately",
    action2: "Address team tension",
    action3: "Sync with PO on priorities",
    action4: "Check in with Sam (QA)",
    
    // RESULTS
    resultsTitle: "📊 Challenge Complete!",
    scoreLabel: "Team Reading Score",
    correctlyDetected: "✅ Correctly Detected",
    missed: "❌ Missed",
    falsePositives: "⚠️ False Positives",
    yourPrioritization: "📊 Your Prioritization:",
    youChose: "You chose to tackle:",
    first: "first.",
    feedbackGood: "✅ Excellent! Unblocking dependencies is critical.",
    feedbackOk: "🟡 Consider: Dependencies usually need immediate attention.",
    
    continueChallenge2: "Continue to Challenge 2 →",
  },
  
  es: {
    // INTRO
    introTitle1: "TU PEOR DÍA",
    introTitle2: "COMO SCRUM MASTER",
    introTime: "Es Lunes a las 9:00 AM",
    introStory1: "Empezas el dia con un cafe en la mano (todavía demasiado caliente como para tomarlo rápido). Esta semana tiene varios desafios... El fin de sprint en tres días. El tablero está en amarillo tirando a rojo, pero nada explotó… todavía. Abrís la notebook.   cabás de llegar a la oficina con tu café.",
    introStory2Slack: "Slack:",
    introStory2Messages: "47 mensajes sin leer",
    introStory3Calendar: "Calendario:",
    introStory3Meetings: "6 reuniones seguidas",
    introStory4Sprint: "El sprint termina en 3 días. Estás al",
    introStory4Completion: "60% de completitud",
    introStory5: "Tu teléfono vibra. Mensaje del CEO.",
    rulesTitle: "LAS REGLAS",
    rule1: "Tenés",
    rule1Time: "45 minutos",
    rule2: "Tu cámara y pantalla están",
    rule2Recording: "grabando",
    rule3: "Podés usar",
    rule3AI: "cualquier herramienta de IA",
    rule3You: "que quieras",
    rule4: "Tu objetivo: Mantener al equipo vivo",
    startBtn: "INICIAR EVALUACIÓN",
    disclaimer: "Esta simulación pondrá a prueba tus habilidades reales como Scrum Master.\nBuena suerte. La vas a necesitar.",
    
    // CHALLENGE 1
    challenge1Title: "🎬 Desafío 1: El Daily del Infierno",
    challenge1Desc: "Son las 9:00 AM. Hora del daily standup. Te unís a la llamada de Zoom e inmediatamente sentís que algo anda... mal.",
    joinDaily: "Unirse al Daily Standup →",
    
    // TEAM MEMBERS
    teamHealth: "Salud del Equipo",
    timeRemaining: "Tiempo Restante",
    cameraOff: "🔴 Cámara APAGADA",
    online: "🟢 En línea",
    joinedLate: "🟡 Llegó Tarde",
    
    // DETECTION
    detectionTitle: "🔍 ¿Qué problemas detectaste?",
    detectionHint: "Hacé click en todos los problemas que notaste (se calificará tu precisión)",
    continue: "Continuar",
    issuesDetected: "problemas detectados",
    
    // ISSUES
    issueAlexBlocked: "🚧 Alex está bloqueado pero no lo dice",
    issueJordanFrustrated: "😤 Jordan está frustrado e interrumpiendo",
    issueSamDisengaged: "🤐 Sam (QA) está desconectado/infeliz",
    issueMorganDistracted: "📱 Morgan (PO) está distraído",
    issueDependency: "🔗 Bloqueador de dependencia (Jordan esperando a Alex)",
    issueTension: "⚡ Tensión creciendo entre miembros del equipo",
    issueCaseyTrap: "❌ Casey tiene un problema (TRAMPA - esto es incorrecto)",
    
    // PRIORITY
    priorityTitle: "📊 Priorizá tus Acciones",
    priorityHint: "Usá las flechas para reordenar - ¿qué abordás PRIMERO?",
    confirmPriorities: "Confirmar Prioridades →",
    
    // ACTIONS
    action1: "Desbloquear a Alex inmediatamente",
    action2: "Abordar la tensión del equipo",
    action3: "Sincronizar con PO sobre prioridades",
    action4: "Hablar con Sam (QA)",
    
    // RESULTS
    resultsTitle: "📊 ¡Desafío Completado!",
    scoreLabel: "Puntaje de Lectura del Equipo",
    correctlyDetected: "✅ Detectado Correctamente",
    missed: "❌ Te Perdiste",
    falsePositives: "⚠️ Falsos Positivos",
    yourPrioritization: "📊 Tu Priorización:",
    youChose: "Elegiste abordar:",
    first: "primero.",
    feedbackGood: "✅ ¡Excelente! Desbloquear dependencias es crítico.",
    feedbackOk: "🟡 Considerá: Las dependencias usualmente necesitan atención inmediata.",
    continueChallenge2: "Continuar al Desafío 2 →",
  }
};

// Función helper para obtener texto traducido
const t = (key) => translations[language][key] || key;
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
    { speaker: 'You', speakerId: 0, text: 'Good morning team! Let\\s start the daily. Alex how are things going?', emotion: 'neutral' },
    { speaker: 'Alex', speakerId: 1, text: 'Yeah, uh... good. Working on the API endpoints. Should be done soon.', emotion: 'evasive' },
    { speaker: 'Jordan', speakerId: 2, text: 'Wait, Alex are you almost done? Because I need those endpoints to finish the integration and—', emotion: 'impatient' },
    { speaker: 'You', speakerId: 0, text: 'Jordan, let Alex finish please.', emotion: 'calm' },
    { speaker: 'Alex', speakerId: 1, text: 'Yeah... almost. Just a few more things.', emotion: 'vague' },
    { speaker: 'Jordan', speakerId: 2, text: 'Okay but "soon" could mean today or next week, I need to know because—', emotion: 'frustrated' },
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
  if ((stage === 'daily' || stage === 'action') && timeRemaining > 0) {
    const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    return () => clearTimeout(timer);
  }
}, [stage, timeRemaining]);

  useEffect(() => {
  if (stage === 'daily' && currentDialogue < dialogue.length - 1) {
    // Reproducir audio del diálogo actual
    const currentLine = dialogue[currentDialogue];
    if (currentLine && currentLine.text !== '...') {
      speakDialogue(currentLine.text, currentLine.speakerId);
    }
    
    // Calcular tiempo según longitud del texto
    // Fórmula: 50ms por palabra + 2 segundos de pausa
    const words = currentLine.text.split(' ').length;
    const speechTime = (words * 500) + 2000; // 500ms por palabra + 2s pausa
    
    const timer = setTimeout(() => {
      setCurrentDialogue(currentDialogue + 1);
    }, speechTime);
    return () => clearTimeout(timer);
  }
}, [stage, currentDialogue, dialogue.length]);

  const AssessmentHeader = () => (
  <div className="assessment-header-fixed">
    <div className="team-health-indicator">
      <span className="label">Team Health</span>
      <div className="health-bar-main">
        <div 
          className={`health-fill-main ${teamHealth <= 20 ? 'critical' : ''}`}
          style={{width: `${teamHealth}%`}}
        ></div>
      </div>
      <span className="health-percent">{teamHealth}%</span>
    </div>
    <div className="timer-indicator">
      <span className="time-label">Time Remaining</span>
      <span className={`time-remaining ${timeRemaining <= 300 ? 'warning' : ''}`}>
        {formatTime(timeRemaining)}
      </span>
    </div>
  </div>
);


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
  const speakDialogue = (text, speakerId) => {
  // Si está muteado, no reproducir
  if (audioMuted) return;
  
  // Cancelar cualquier audio anterior
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  
  // Asignar voces según personaje
  switch(speakerId) {
    case 0: // You (Scrum Master)
      utterance.voice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Karen')) || voices[0];
      utterance.pitch = 1;
      utterance.rate = 1;
      break;
    case 1: // Alex (Backend Dev) - Voz masculina grave, insegura
      utterance.voice = voices.find(v => v.name.includes('Daniel') || v.name.includes('Fred')) || voices[1];
      utterance.pitch = 0.8;
      utterance.rate = 0.9;
      break;
    case 2: // Jordan (Frontend Dev) - Voz femenina frustrada, rápida
      utterance.voice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Victoria')) || voices[2];
      utterance.pitch = 1.2;
      utterance.rate = 1.1;
      break;
    case 3: // Sam (QA) - Voz neutral, monótona
      utterance.voice = voices.find(v => v.name.includes('Alex')) || voices[3];
      utterance.pitch = 0.9;
      utterance.rate = 0.8;
      break;
    case 4: // Casey (Designer) - Voz alegre, energética
      utterance.voice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Tessa')) || voices[4];
      utterance.pitch = 1.3;
      utterance.rate = 1.0;
      break;
    case 5: // Morgan (PO) - Voz distraída, apresurada
      utterance.voice = voices.find(v => v.name.includes('Victoria') || v.name.includes('Allison')) || voices[5];
      utterance.pitch = 1.1;
      utterance.rate = 1.2;
      break;
    default:
      utterance.voice = voices[0];
  }
  
  window.speechSynthesis.speak(utterance);
};

  if (stage === 'intro') {
  return (
    <div className="intro-screen">
      <div className="intro-content">
        <div className="glitch-text">
          <h1>{language === 'en' ? 'YOUR WORST DAY' : 'TU PEOR DÍA'}</h1>
          <h2>{language === 'en' ? 'AS A SCRUM MASTER' : 'COMO SCRUM MASTER'}</h2>
        </div>
        
        <div className="story">
          <p className="time">{language === 'en' ? 'Monday, 9:00 AM' : 'Lunes, 9:00 AM'}</p>
          <p>{language === 'en' ? 'You just arrived at the office with your coffee.' : 'Acabás de llegar a la oficina con tu café.'}</p>
          <p>{language === 'en' ? 'Slack:' : 'Slack:'} <span className="highlight">{language === 'en' ? '47 unread messages' : '47 mensajes sin leer'}</span></p>
          <p>{language === 'en' ? 'Calendar:' : 'Calendario:'} <span className="highlight">{language === 'en' ? '6 back-to-back meetings' : '6 reuniones seguidas'}</span></p>
          <p>{language === 'en' ? "Sprint ends in 3 days. You're at" : 'El sprint termina en 3 días. Estás al'} <span className="danger">{language === 'en' ? '60% completion' : '60% de completitud'}</span>.</p>
          <p className="final">{language === 'en' ? 'Your phone vibrates. Message from the CEO.' : 'Tu teléfono vibra. Mensaje del CEO.'}</p>
        </div>

        <div className="rules">
          <h3>{language === 'en' ? 'THE RULES' : 'LAS REGLAS'}</h3>
          <ul>
            <li>⏱️ {language === 'en' ? 'You have' : 'Tenés'} <strong>{language === 'en' ? '45 minutes' : '45 minutos'}</strong></li>
            <li>📹 {language === 'en' ? 'Your camera and screen are' : 'Tu cámara y pantalla están'} <strong>{language === 'en' ? 'recording' : 'grabando'}</strong></li>
            <li>🤖 {language === 'en' ? 'You can use' : 'Podés usar'} <strong>{language === 'en' ? 'any AI tool' : 'cualquier herramienta de IA'}</strong> {language === 'en' ? 'you want' : 'que quieras'}</li>
            <li>🎯 {language === 'en' ? 'Your goal: Keep the team alive' : 'Tu objetivo: Mantener al equipo vivo'}</li>
          </ul>
        </div>
        {onBack && (
  <button className="back-to-menu-btn" onClick={onBack}>
    ← {language === 'en' ? 'Back to Menu' : 'Volver al Menú'}
  </button>
  
)}

        <button className="start-btn" onClick={() => setStage('daily')}>
          {language === 'en' ? 'START ASSESSMENT' : 'INICIAR EVALUACIÓN'}
          <span className="arrow">→</span>
        </button>

        <p className="disclaimer">
          {language === 'en' 
            ? 'This simulation will test your real skills as a Scrum Master.\nGood luck. You\'ll need it.'
            : 'Esta simulación pondrá a prueba tus habilidades reales como Scrum Master.\nBuena suerte. La vas a necesitar.'}
        </p>
      </div>
    </div>
  );
}

 if (stage === 'daily') {
  const activeSpeaker = dialogue[currentDialogue]?.speakerId;

  return (
    <>
  <div className="challenge-container">
    <AssessmentHeader />
    <div className="zoom-header">
      <h2>⏰ 9:05 AM - Daily Standup</h2>
      {/* AI Assistant Button */}
  <button 
    className="ai-assistant-btn-fixed"
    onClick={() => setShowAIAssistant(true)}
  >
    🤖 AI Assistant
  </button>

<button 
  className="ai-assistant-btn-fixed"
  onClick={() => setShowAIAssistant(true)}
  title="Get AI coaching"
>
  🤖 AI Assistant
</button>

      {/* SKIP BUTTON (for testing) */}
<button 
  className="skip-btn"
  onClick={() => setStage('detection')}
  title="Skip to detection (testing mode)"
>
  ⏭️ Skip
</button>
      
      {/* BOTÓN DE MUTE - AGREGAR ACÁ */}
      <button 
        className="mute-btn"
        onClick={() => setAudioMuted(!audioMuted)}
        title={audioMuted ? "Unmute audio" : "Mute audio"}
      >
        {audioMuted ? '🔇' : '🔊'}
      </button>
      
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
      
      {/* MENSAJES QUE ENVIASTE */}
      {slackSent.map((msg, index) => (
        <div key={`sent-${index}`} className="slack-message your-message">
          <div className="msg-header">
            <strong>You (Scrum Master)</strong>
            <span className="msg-time">Just now</span>
          </div>
          <div className="msg-text">{msg.text}</div>
          {msg.response && (
            <div className="slack-message response-message">
              <div className="msg-header">
                <strong>{msg.response.from}</strong>
                <span className="msg-time">{msg.response.time}</span>
              </div>
              <div className="msg-text">{msg.response.text}</div>
            </div>
          )}
        </div>
      ))}
    </div>
    
    {/* INPUT PARA ESCRIBIR */}
    <div className="slack-input-container">
      <textarea
        className="slack-input"
        placeholder="Message #team-standup..."
        value={slackInput}
        onChange={(e) => setSlackInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && slackInput.trim()) {
            e.preventDefault();
            
            // Determinar respuesta según el mensaje
            let response = null;
            const lowerMsg = slackInput.toLowerCase();
            
            if (lowerMsg.includes('alex') || lowerMsg.includes('endpoint') || lowerMsg.includes('api')) {
              response = {
                from: 'Alex',
                time: 'Just now',
                text: 'Thanks for checking in. I think I need help with the authentication logic. Can someone pair with me?'
              };
              // MEJORA EL TEAM HEALTH
              setTeamHealth(Math.min(100, teamHealth + 5));
            } else if (lowerMsg.includes('jordan')) {
              response = {
                from: 'Jordan',
                time: 'Just now',
                text: 'Appreciate it. I can work on other tasks while we unblock this.'
              };
            } else if (lowerMsg.includes('everyone') || lowerMsg.includes('team')) {
              response = {
                from: 'Casey',
                time: 'Just now',
                text: '👍 Let\'s sync after this to align on priorities!'
              };
            }
            
            setSlackSent([...slackSent, { text: slackInput, response }]);
            setSlackInput('');
          }
        }}
        rows="2"
      />
      <div className="slack-input-footer">
        <span className="hint-text">Press Enter to send, Shift+Enter for new line</span>
        <button 
          className="send-slack-btn"
          onClick={() => {
            if (slackInput.trim()) {
              setSlackSent([...slackSent, { text: slackInput }]);
              setSlackInput('');
            }
          }}
        >
          Send
        </button>
      </div>
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
        <div 
          key={email.id} 
          className={`email-item ${email.unread ? 'unread' : ''}`}
          onClick={() => setSelectedEmail(email)}
        >
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

    {/* MODAL DE EMAIL COMPLETO */}
    {selectedEmail && (
      <div className="email-modal" onClick={() => setSelectedEmail(null)}>
        <div className="email-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="email-modal-header">
            <div>
              <h3>{selectedEmail.subject}</h3>
              <p className="email-meta">
                From: <strong>{selectedEmail.from}</strong> · 
                {selectedEmail.priority === 'high' && <span className="priority-badge">! High Priority</span>}
              </p>
            </div>
            <button className="close-email-btn" onClick={() => setSelectedEmail(null)}>×</button>
          </div>
          <div className="email-modal-body">
            {selectedEmail.id === 1 && (
              <>
                <p>Hi team,</p>
                <p>I just heard from the client that the integration feature won't be ready for Friday's demo. This is a major issue.</p>
                <p>We promised this feature would be delivered this week. The client is already frustrated with previous delays.</p>
                <p><strong>I need a clear explanation of:</strong></p>
                <ul>
                  <li>What is blocking the delivery?</li>
                  <li>What can we deliver by Friday?</li>
                  <li>How do we prevent this in the future?</li>
                </ul>
                <p>Please respond by end of day.</p>
                <p>- CEO</p>
              </>
            )}
            {selectedEmail.id === 2 && (
              <>
                <p>Hey,</p>
                <p>We're missing estimates for 3 critical stories that need to go into next sprint:</p>
                <ul>
                  <li>User authentication redesign</li>
                  <li>Payment gateway integration</li>
                  <li>Analytics dashboard</li>
                </ul>
                <p>Can we get the team to size these today? Planning is tomorrow and we can't move forward without estimates.</p>
                <p>Thanks,<br/>Morgan</p>
              </>
            )}
            {selectedEmail.id === 3 && (
              <>
                <p>Hi,</p>
                <p>I'm running into some issues with the staging environment. Deployments are failing with authentication errors.</p>
                <p>I've been trying to debug this for the past hour but getting nowhere. This is blocking my ability to test the API endpoints.</p>
                <p>Can someone from DevOps help? Or should I try rolling back to the previous config?</p>
                <p>- Alex</p>
              </>
            )}
          </div>
          <div className="email-modal-footer">
            <button className="reply-btn">Reply</button>
            <button className="forward-btn">Forward</button>
            <button className="archive-btn">Archive</button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

      {/* JIRA VIEW */}
{activeView === 'jira' && (
  <div className="jira-view">
    <div className="jira-header">
      <h3>Sprint Board</h3>
      <p className="sprint-info">Sprint 12 · 3 days remaining</p>
    </div>
    
    <div className="jira-board">
      {/* TO DO COLUMN */}
      <div 
        className="jira-column"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedTicket && draggedTicket.fromColumn !== 'todo') {
            const newBoard = {...jiraBoardTickets};
            newBoard[draggedTicket.fromColumn] = newBoard[draggedTicket.fromColumn].filter(t => t.id !== draggedTicket.ticket.id);
            newBoard.todo = [...newBoard.todo, draggedTicket.ticket];
            setJiraBoardTickets(newBoard);
            setDraggedTicket(null);
          }
        }}
      >
        <div className="column-header">
          <h4>To Do</h4>
          <span className="ticket-count">{jiraBoardTickets.todo.length}</span>
        </div>
        <div className="tickets-container">
          {jiraBoardTickets.todo.map(ticket => (
            <div
              key={ticket.id}
              className={`jira-ticket-card priority-${ticket.priority.toLowerCase()}`}
              draggable
              onDragStart={() => setDraggedTicket({ ticket, fromColumn: 'todo' })}
            >
              <div className="ticket-header-card">
                <span className="ticket-id">{ticket.id}</span>
                <span className={`ticket-priority priority-${ticket.priority.toLowerCase()}`}>
                  {ticket.priority}
                </span>
              </div>
              <div className="ticket-title-card">{ticket.title}</div>
              <div className="ticket-footer-card">
                <span className="ticket-assignee">👤 {ticket.assignee}</span>
                <span className="ticket-points">{ticket.storyPoints} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IN PROGRESS COLUMN */}
      <div 
        className="jira-column in-progress"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedTicket && draggedTicket.fromColumn !== 'inProgress') {
            const newBoard = {...jiraBoardTickets};
            newBoard[draggedTicket.fromColumn] = newBoard[draggedTicket.fromColumn].filter(t => t.id !== draggedTicket.ticket.id);
            newBoard.inProgress = [...newBoard.inProgress, draggedTicket.ticket];
            setJiraBoardTickets(newBoard);
            setDraggedTicket(null);
            
            // Si desbloqueaste a Jordan, sube el health
            if (draggedTicket.ticket.id === 'PROJ-143' && draggedTicket.fromColumn === 'blocked') {
              setTeamHealth(Math.min(100, teamHealth + 10));
            }
          }
        }}
      >
        <div className="column-header">
          <h4>In Progress</h4>
          <span className="ticket-count">{jiraBoardTickets.inProgress.length}</span>
        </div>
        <div className="tickets-container">
          {jiraBoardTickets.inProgress.map(ticket => (
            <div
              key={ticket.id}
              className={`jira-ticket-card priority-${ticket.priority.toLowerCase()}`}
              draggable
              onDragStart={() => setDraggedTicket({ ticket, fromColumn: 'inProgress' })}
            >
              <div className="ticket-header-card">
                <span className="ticket-id">{ticket.id}</span>
                <span className={`ticket-priority priority-${ticket.priority.toLowerCase()}`}>
                  {ticket.priority}
                </span>
              </div>
              <div className="ticket-title-card">{ticket.title}</div>
              <div className="ticket-footer-card">
                <span className="ticket-assignee">👤 {ticket.assignee}</span>
                <span className="ticket-points">{ticket.storyPoints} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BLOCKED COLUMN */}
      <div 
        className="jira-column blocked"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedTicket && draggedTicket.fromColumn !== 'blocked') {
            const newBoard = {...jiraBoardTickets};
            newBoard[draggedTicket.fromColumn] = newBoard[draggedTicket.fromColumn].filter(t => t.id !== draggedTicket.ticket.id);
            newBoard.blocked = [...newBoard.blocked, draggedTicket.ticket];
            setJiraBoardTickets(newBoard);
            setDraggedTicket(null);
          }
        }}
      >
        <div className="column-header blocked-header">
          <h4>⚠️ Blocked</h4>
          <span className="ticket-count">{jiraBoardTickets.blocked.length}</span>
        </div>
        <div className="tickets-container">
          {jiraBoardTickets.blocked.map(ticket => (
            <div
              key={ticket.id}
              className={`jira-ticket-card priority-${ticket.priority.toLowerCase()} blocked-ticket`}
              draggable
              onDragStart={() => setDraggedTicket({ ticket, fromColumn: 'blocked' })}
            >
              <div className="ticket-header-card">
                <span className="ticket-id">{ticket.id}</span>
                <span className={`ticket-priority priority-${ticket.priority.toLowerCase()}`}>
                  {ticket.priority}
                </span>
              </div>
              <div className="ticket-title-card">{ticket.title}</div>
              <div className="ticket-footer-card">
                <span className="ticket-assignee">👤 {ticket.assignee}</span>
                <span className="ticket-points">{ticket.storyPoints} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DONE COLUMN */}
      <div 
        className="jira-column done"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedTicket && draggedTicket.fromColumn !== 'done') {
            const newBoard = {...jiraBoardTickets};
            newBoard[draggedTicket.fromColumn] = newBoard[draggedTicket.fromColumn].filter(t => t.id !== draggedTicket.ticket.id);
            newBoard.done = [...newBoard.done, draggedTicket.ticket];
            setJiraBoardTickets(newBoard);
            setDraggedTicket(null);
          }
        }}
      >
        <div className="column-header done-header">
          <h4>✅ Done</h4>
          <span className="ticket-count">{jiraBoardTickets.done.length}</span>
        </div>
        <div className="tickets-container">
          {jiraBoardTickets.done.map(ticket => (
            <div
              key={ticket.id}
              className={`jira-ticket-card priority-${ticket.priority.toLowerCase()}`}
              draggable
              onDragStart={() => setDraggedTicket({ ticket, fromColumn: 'done' })}
            >
              <div className="ticket-header-card">
                <span className="ticket-id">{ticket.id}</span>
                <span className={`ticket-priority priority-${ticket.priority.toLowerCase()}`}>
                  {ticket.priority}
                </span>
              </div>
              <div className="ticket-title-card">{ticket.title}</div>
              <div className="ticket-footer-card">
                <span className="ticket-assignee">👤 {ticket.assignee}</span>
                <span className="ticket-points">{ticket.storyPoints} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
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
    <AIChatbot 
      isOpen={showAIAssistant} 
      onClose={() => setShowAIAssistant(false)}
      challenge={1}
    />
  </>
  );
}

  if (stage === 'detection') {
    return (
  <div className="challenge-container">
    <AssessmentHeader />
    <div className="detection-header">
          <h2>🔍 What problems did you detect?</h2>
          <p className="hint">Click all issues you noticed (you'll be scored on accuracy)</p>
        </div>

        <div className="issues-interactive">
          {[
            { id: 'alex-blocked', label: '🚧 Alex is blocked but not asking for help', correct: true },
{ id: 'sam-silent', label: '🤐 Sam (QA) seems disengaged and unhappy', correct: true },
{ id: 'morgan-distracted', label: '📱 Morgan (PO) joined late and is distracted', correct: true },
{ id: 'alex-done', label: '❌ Alex will finish the API today', correct: false },
{ id: 'dependency', label: '🔗 Jordan is blocked waiting for Alex', correct: true },
{ id: 'no-eta', label: '📅 No clear ETA was given for blocked work', correct: true },
{ id: 'camera-off', label: '📷 Alex has camera off which may signal discomfort', correct: true },
{ id: 'casey-problem', label: '❌ Casey seems to have a blocker too', correct: false },
{ id: 'jordan-lazy', label: '❌ Jordan is being lazy and not doing their job', correct: false },
{ id: 'team-morale-fine', label: '❌ Team morale looks generally fine', correct: false },
{ id: 'jordan-impatient', label: '😤 Jordan is frustrated and interrupting others', correct: true },
{ id: 'morgan-checked-in', label: '❌ Morgan was fully up to date with sprint status', correct: false },
{ id: 'tension', label: '⚡ There is growing tension between team members', correct: true },
{ id: 'po-missing-context', label: '📋 PO missed part of the standup and key context', correct: true },
{ id: 'sprint-on-track', label: '❌ The sprint is on track to be completed on time', correct: false },
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
  onClick={() => {
    // Calcular cambio en Team Health
    const correctIssues = ['alex-blocked', 'jordan-impatient', 'sam-silent', 'dependency', 'tension', 'morgan-distracted', 'no-eta', 'camera-off', 'po-missing-context'];
    const detectedCorrect = detectedIssues.filter(i => correctIssues.includes(i));
    const detectedWrong = detectedIssues.filter(i => !correctIssues.includes(i));
    const missed = correctIssues.filter(i => !detectedIssues.includes(i));

    // Team health sube/baja
    let healthChange = 0;
    healthChange += detectedCorrect.length * 8;
    healthChange -= detectedWrong.length * 15;
    healthChange -= missed.length * 5;
    const newHealth = Math.max(0, Math.min(100, teamHealth + healthChange));
    setTeamHealth(newHealth);

    // Mapeo de issues a acciones concretas
    const issueToAction = {
      'alex-blocked': '🚧 Unblock Alex - find out what\'s stuck',
      'jordan-impatient': '😤 Address Jordan\'s frustration privately',
      'sam-silent': '🤐 Check in with Sam 1-on-1 after standup',
      'dependency': '🔗 Resolve Alex → Jordan dependency blocker',
      'tension': '⚡ Defuse team tension before it escalates',
      'morgan-distracted': '📱 Sync with Morgan (PO) on priorities',
      'no-eta': '📅 Get a clear ETA from Alex',
      'camera-off': '📷 Reach out to Alex privately (camera off = red flag)',
      'po-missing-context': '📋 Brief Morgan on what she missed',
    };

    // Solo mostrar acciones para issues CORRECTOS que detectó
    const dynamicPriorities = detectedCorrect.map((issue, index) => ({
      id: String(index + 1),
      issueId: issue,
      text: issueToAction[issue] || issue
    }));

    setPriorities(dynamicPriorities);
    setStage('priority');
  }}
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
      <AssessmentHeader />
      <div className="priority-header">
        <h2>📊 Prioritize Your Actions</h2>
        <p className="hint">Drag and drop to reorder - what do you tackle FIRST?</p>
      </div>

      <div className="priority-list">
        {priorities.map((item, index) => (
          <div
            key={item.id}
            className="priority-item"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
              const toIndex = index;
              if (fromIndex === toIndex) return;
              const newPriorities = [...priorities];
              const [moved] = newPriorities.splice(fromIndex, 1);
              newPriorities.splice(toIndex, 0, moved);
              setPriorities(newPriorities);
            }}
          >
            <span className="drag-handle">⠿</span>
            <span className="priority-number">#{index + 1}</span>
            <span className="priority-text">{item.text}</span>
          </div>
        ))}
      </div>

      <div className="priority-action-box">
        <h3>💬 What would you do first and why?</h3>
        <p className="hint">Write 2-3 sentences about your approach</p>
        <textarea
          className="action-textarea"
          placeholder="e.g. I would immediately reach out to Alex privately to understand what's blocking him, then coordinate with Jordan to manage expectations..."
          value={priorityNote}
          onChange={(e) => setPriorityNote(e.target.value)}
          rows={4}
        />
        <div className="char-count">{priorityNote.length}/500</div>
      </div>

      <button 
        className="primary-btn"
        onClick={() => setStage('action')}
        disabled={priorityNote.length < 20}
      >
        Confirm Priorities →
      </button>
      {priorityNote.length < 20 && priorityNote.length > 0 && (
        <p className="hint-warning">⚠️ Please write at least a few sentences</p>
      )}
    </div>
  );
}

  if (stage === 'action') {
    return (
  <div className="challenge-container">
    <AssessmentHeader />
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
    // Si debe mostrar el reporte
if (showReport && reportData) {
  return <AssessmentReport results={reportData} onBack={onBack} language={language} />;
}

    return (
  <div className="challenge-container">
    <AssessmentHeader />
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
  <h3>{t('yourPrioritization')}</h3>
  <p>{t('youChose')} <strong>{priorities[0].text}</strong> {t('first')}</p>
  {priorities[0].id === '1' && <p className="feedback-good">{t('feedbackGood')}</p>}
  {priorities[0].id !== '1' && <p className="feedback-ok">{t('feedbackOk')}</p>}
</div>

{/* BOTONES DE NAVEGACIÓN */}
<div className="result-actions">
  {onBack && (
    <button className="back-to-menu-btn-secondary" onClick={onBack}>
      ← {language === 'en' ? 'Back to Menu' : 'Volver al Menú'}
    </button>
  )}
  
  <button 
    className="primary-btn-large" 
    onClick={async () => {
      // Preparar datos del reporte
      const detectionScoreCalc = detectionScore * 10;
      const communicationScoreCalc = 85;
      const prioritizationScoreCalc = priorities[0].id === '1' ? 90 : 70;
      const timeEfficiencyCalc = Math.round((timeRemaining / 300) * 100);
      const totalTimeCalc = Math.round((300 - timeRemaining) / 60);
      
      // Guardar resultados de Challenge 1 en localStorage para el reporte final
      const challenge1Results = {
        detectionScore: detectionScoreCalc,
        prioritizationScore: prioritizationScoreCalc,
        communicationScore: communicationScoreCalc,
        timeEfficiency: timeEfficiencyCalc,
        totalTime: totalTimeCalc,
        completedAt: new Date().toISOString()
      };
      
      localStorage.setItem('smatch_challenge1_results', JSON.stringify(challenge1Results));
      
      // Guardar en backend (sin bloquear el flujo)
      try {
        const overallScore = Math.round(
          (detectionScoreCalc + prioritizationScoreCalc + communicationScoreCalc + timeEfficiencyCalc) / 4
        );
        
        const recommendation = 
          overallScore >= 80 ? 'STRONG HIRE' :
          overallScore >= 70 ? 'HIRE' :
          overallScore >= 60 ? 'MAYBE' : 'PASS';
        
        const greenFlags = [
          'Detected critical blocker immediately',
          'Prioritized team health over deadlines',
          'Clear, empathetic communication'
        ];
        
        const yellowFlags = detectedWrong.length > 0 
          ? ['Detected false positive: ' + detectedWrong[0]] 
          : [];
        
        await fetch('https://smatch-backend-production.up.railway.app/api/assessments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            challenge_id: 1,
            overall_score: overallScore,
            detection_score: detectionScoreCalc,
            prioritization_score: prioritizationScoreCalc,
            communication_score: communicationScoreCalc,
            time_efficiency: timeEfficiencyCalc,
            recommendation: recommendation,
            green_flags: greenFlags,
            yellow_flags: yellowFlags,
            red_flags: [],
            total_time: totalTimeCalc
          })
        });
        
        console.log('✅ Challenge 1 results saved');
        
      } catch (error) {
        console.error('Error saving assessment:', error);
      }
      
      // Volver al menú para que seleccione Challenge 2
      if (onBack) {
        onBack();
      }
    }}
  >
    {language === 'en' ? '✅ Continue to Challenge 2 →' : '✅ Continuar al Desafío 2 →'}
  </button>
</div>

      </div>
    );
  }
    return null;

};

export default DailyChallenge;