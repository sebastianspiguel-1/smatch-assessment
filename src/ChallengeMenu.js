import React, { useState } from 'react';
import './ChallengeMenu.css';
import DailyChallenge from './DailyChallenge';
import SlackChallenge from './SlackChallenge';
import RetroChallenge from './RetroChallenge';
import RetroChallengeTheatrical from './RetroChallengeTheatrical';


const ChallengeMenu = () => {
  const [language, setLanguage] = useState('en');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  // Si seleccionó un challenge, renderizarlo
  if (selectedChallenge === 1) {
    return <DailyChallenge language={language} onBack={() => setSelectedChallenge(null)} />;
  }

  if (selectedChallenge === 2) {
    return <SlackChallenge language={language} onBack={() => setSelectedChallenge(null)} />;
  }

  if (selectedChallenge === 3) {
    return <RetroChallenge language={language} onBack={() => setSelectedChallenge(null)} />;
  }

  if (selectedChallenge === 4) {
    return <RetroChallengeTheatrical language={language} onBack={() => setSelectedChallenge(null)} />;
  }

  // Menú principal
return (
  <div className="menu-scope">
    <div className="challenge-menu">
      {/* INTRO MODAL */}
      {showIntro && (
        <div className="intro-overlay">
          <div className="intro-modal">
            <div className="intro-header">
              <span className="intro-icon">☕</span>
              <h1>Lunes 9:00 AM</h1>
              <p className="intro-time"></p>
            </div>

            <div className="intro-story">
              <p className="intro-lead">

                Esta semana viene cargada de desafios para el Scrum Team... El fin del sprint 17 es en tres días.
                El tablero está en amarillo tirando a rojo, pero nada explotó… todavía. Abrís la notebook y
                te encontras con notificaciones, mensajes y mails para chequear... pero ya esta por empezar la daily, la primera de la semana.
              </p>

              <div className="intro-briefing">
                <h3>🎯 Lo que vas a enfrentar:</h3>
                <ul>
                  <li><strong>5 desafíos reales</strong> que todo Scrum Master vivio</li>
                  <li><strong>60 minutos</strong> de decisiones bajo presión</li>
                  <li><strong>Tu cámara y pantalla</strong> están siendo grabadas</li>
                  <li><strong>Cada acción cuenta</strong> - No hay respuestas correctas</li>
                </ul>
              </div>

              <div className="intro-rules">
                <h3>📋 A tener en cuenta:</h3>
                <div className="rules-grid">
                  <div className="rule-item">
                    <span className="rule-icon">⏱️</span>
                    <div>
                      <strong>Tiempo real</strong>
                      <p>Cada challenge tiene límite de tiempo</p>
                    </div>
                  </div>
                  <div className="rule-item">
                    <span className="rule-icon">🤖</span>
                    <div>
                      <strong>IA permitida</strong>
                      <p>Usá todas las herramientas que quieras, es muy valorado</p>
                    </div>
                  </div>
                  <div className="rule-item">
                    <span className="rule-icon">📊</span>
                    <div>
                      <strong>Medimos todo</strong>
                      <p>Velocidad, priorización, comunicación</p>
                    </div>
                  </div>
                  <div className="rule-item">
                    <span className="rule-icon">🎭</span>
                    <div>
                      <strong>Sin ensayo</strong>
                      <p>Tu primer intento es el que cuenta, como en un sprint</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="intro-warning">
                <span className="warning-icon">⚠️</span>
                <p>
                  <strong></strong> Esta simulación puede generar estres y presion real... esa es la idea.
                </p>
              </div>
            </div>

            <div className="intro-footer">
              <button className="btn-start-assessment" onClick={() => setShowIntro(false)}>
                ☕ Tomar un sorbo de café y empezar
                <span className="btn-arrow">→</span>
              </button>
              <p className="intro-disclaimer">
                Al continuar, aceptás que tu performance será evaluada y grabada
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="menu-header">
        <h1 className="menu-title">A complete Sprint as a Scrum Master</h1>
        <p className="menu-subtitle">5 challenges. Each one tests different critical skills. Good Luck!</p>
        
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
            <span className="status-badge available">available</span>
            <span className="duration">⏱️ 10 min</span>
          </div>
        </div>

        {/* CHALLENGE 5 */}
        <div className="challenge-card available" onClick={() => setSelectedChallenge(3)}>
  <div className="challenge-number">05</div>
  <div className="challenge-icon">🔄</div>
  <h3>The Retro That Doesn't Work</h3>
  <p className="challenge-skill">Facilitation & Root Cause Analysis</p>
  <div className="challenge-status">
    <span className="status-badge available">Available</span>
    <span className="duration">⏱️ 15 min</span>
  </div>
</div>

{/* CHALLENGE 6 */}
<div
  className="challenge-card available"
  onClick={() => setSelectedChallenge(4)}
>
  <div className="challenge-number">06</div>
  <div className="challenge-icon">🎭</div>
  <h3>Retro: Theatrical Edition</h3>
  <p className="challenge-skill">Facilitation Under Emotional Pressure</p>
  <div className="challenge-status">
    <span className="status-badge available">Available</span>
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
    </div>
  );
};

export default ChallengeMenu;