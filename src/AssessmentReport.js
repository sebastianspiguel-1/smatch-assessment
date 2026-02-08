import React from 'react';
import './AssessmentReport.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AssessmentReport = ({ results, onBack, language }) => {
  const [candidateName, setCandidateName] = React.useState('');
  const [candidateEmail, setCandidateEmail] = React.useState('');
  
  // Calcular score total
  const totalScore = Math.round(
    (results.detectionScore + 
     results.prioritizationScore + 
     results.communicationScore + 
     results.timeEfficiency) / 4
  );

  // Determinar recomendación
  const getRecommendation = (score) => {
    if (score >= 80) return { text: 'STRONG HIRE', color: '#10b981', confidence: 90 };
    if (score >= 70) return { text: 'HIRE', color: '#3b82f6', confidence: 80 };
    if (score >= 60) return { text: 'MAYBE', color: '#f59e0b', confidence: 65 };
    return { text: 'PASS', color: '#ef4444', confidence: 50 };
  };

  const recommendation = getRecommendation(totalScore);
 // Función para generar PDF desde el HTML
const generatePDF = async () => {
  const reportElement = document.querySelector('.report-container');
  const titleSection = document.querySelector('.report-title-section');
  const footer = document.querySelector('.report-footer');
  
  // Agregar info del candidato al elemento
  const candidateInfo = candidateName || candidateEmail 
    ? `${candidateName || 'Anonymous Candidate'}${candidateEmail ? ` (${candidateEmail})` : ''}`
    : 'Anonymous Candidate';
  
  if (titleSection) {
    titleSection.setAttribute('data-candidate', candidateInfo);
  }
  
  // Agregar clase para modo PDF
  reportElement.classList.add('pdf-mode');
  
  // Ocultar footer
  if (footer) footer.style.display = 'none';
  
  // Esperar un momento para que se apliquen los estilos
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      backgroundColor: '#0a0e14',
      logging: false,
      useCORS: true,
      windowWidth: 800,
      windowHeight: reportElement.scrollHeight
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;
    
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }
    
    const filename = candidateName 
      ? `smatch-${candidateName.replace(/\s+/g, '-')}-${Date.now()}.pdf`
      : `smatch-assessment-${Date.now()}.pdf`;
    
    pdf.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  } finally {
    reportElement.classList.remove('pdf-mode');
    if (titleSection) titleSection.removeAttribute('data-candidate');
    if (footer) footer.style.display = 'flex';
  }
};

  return (
    <div className="report-container">
      {/* HEADER */}
      <div className="report-header">
        <div className="report-title-section">
  <h1 className="report-title">📊 Assessment Report</h1>
  <div className="candidate-info-inputs">
    <input 
      type="text" 
      placeholder="Candidate Name (optional)"
      value={candidateName}
      onChange={(e) => setCandidateName(e.target.value)}
      className="candidate-input"
    />
    <input 
      type="email" 
      placeholder="Candidate Email (optional)"
      value={candidateEmail}
      onChange={(e) => setCandidateEmail(e.target.value)}
      className="candidate-input"
    />
  </div>
  <div className="report-meta">
    <span>Date: {new Date().toLocaleDateString()}</span>
    <span>•</span>
    <span>Time: {results.totalTime} min</span>
  </div>
</div>
        

        <div className="overall-score-section">
          <div className="score-circle">
            <div className="score-number">{totalScore}</div>
            <div className="score-label">/100</div>
          </div>
          <div className="score-bar">
            <div 
              className="score-fill" 
              style={{ width: `${totalScore}%` }}
            ></div>
          </div>
        </div>

        <div 
          className="recommendation-badge" 
          style={{ borderColor: recommendation.color, color: recommendation.color }}
        >
          <div className="rec-text">{recommendation.text}</div>
          <div className="rec-confidence">{recommendation.confidence}% confidence</div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="report-grid">
        {/* LEFT COLUMN */}
        <div className="report-left">
          {/* SKILLS BREAKDOWN */}
          <div className="report-card">
            <h3>🎯 Core Skills</h3>
            <div className="skills-grid">
              {[
                { name: 'Team Reading', score: results.detectionScore, icon: '👁️', avg: 65 },
                { name: 'Conflict Resolution', score: results.conflictScore || 70, icon: '🤝', avg: 68 },
                { name: 'Communication', score: results.communicationScore, icon: '💬', avg: 72 },
                { name: 'Prioritization', score: results.prioritizationScore, icon: '📊', avg: 70 },
                { name: 'Adaptability', score: results.adaptabilityScore || 75, icon: '🔄', avg: 65 }
              ].map((skill, index) => (
                <div key={index} className="skill-card">
                  <div className="skill-icon">{skill.icon}</div>
                  <div className="skill-info">
                    <div className="skill-name">{skill.name}</div>
                    <div className="skill-score-row">
                      <div className="score-big">{skill.score}%</div>
                      <div className="vs-avg">
                        {skill.score > skill.avg ? (
                          <span className="above">▲ {skill.score - skill.avg}% above avg</span>
                        ) : skill.score === skill.avg ? (
                          <span className="equal">= Average</span>
                        ) : (
                          <span className="below">▼ {skill.avg - skill.score}% below avg</span>
                        )}
                      </div>
                    </div>
                    <div className="skill-bar-simple">
                      <div 
                        className="skill-bar-fill" 
                        style={{ width: `${skill.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TIME & EFFICIENCY */}
          <div className="report-card">
            <h3>⏱️ Time Management</h3>
            <div className="time-stats">
              <div className="time-stat">
                <div className="stat-icon">⏰</div>
                <div className="stat-info">
                  <div className="stat-label">Completion Time</div>
                  <div className="stat-value">{results.totalTime} min</div>
                </div>
              </div>
              <div className="time-stat">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <div className="stat-label">Efficiency</div>
                  <div className="stat-value">{results.timeEfficiency}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* PERCENTILE RANKING */}
          <div className="report-card ranking-card">
            <h3>📊 Performance Ranking</h3>
            <div className="percentile-display">
              <div className="percentile-number">Top 12%</div>
              <div className="percentile-context">of 2,847 candidates assessed</div>
            </div>
            <div className="ranking-bar">
              <div className="ranking-marker" style={{ left: '88%' }}>
                <div className="marker-dot"></div>
                <div className="marker-label">You</div>
              </div>
              <div className="ranking-segments">
                <div className="segment low"></div>
                <div className="segment medium"></div>
                <div className="segment high"></div>
                <div className="segment top"></div>
              </div>
            </div>
          </div>

          {/* AI SIMILARITY MATCH */}
          <div className="report-card ai-match-card">
            <h3>🤖 AI Similarity Analysis</h3>
            <div className="similarity-match">
              <div className="match-score">87%</div>
              <div className="match-text">
                <div className="match-label">Match with top performers</div>
                <div className="match-detail">Similar patterns to your highest-rated Scrum Masters</div>
              </div>
            </div>
            <div className="match-traits">
              <span className="trait-tag">✓ Proactive</span>
              <span className="trait-tag">✓ Empathetic</span>
              <span className="trait-tag">✓ Data-driven</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="report-right">
          {/* HIGHLIGHTS */}
          <div className="report-card highlights-card">
            <h3>⭐ Highlights</h3>
            <div className="highlights-grid">
              {results.greenFlags && results.greenFlags.map((flag, i) => (
                <div key={i} className="highlight-item">
                  <div className="highlight-icon">✓</div>
                  <div className="highlight-text">{flag}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AREAS FOR IMPROVEMENT */}
          {(results.yellowFlags?.length > 0 || results.redFlags?.length > 0) && (
            <div className="report-card improvement-card">
              <h3>💡 Areas for Improvement</h3>
              <div className="improvement-list">
                {results.redFlags?.map((flag, i) => (
                  <div key={i} className="improvement-item critical">
                    <span className="improvement-icon">🚩</span>
                    <span>{flag}</span>
                  </div>
                ))}
                {results.yellowFlags?.map((flag, i) => (
                  <div key={i} className="improvement-item moderate">
                    <span className="improvement-icon">⚠️</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BEHAVIORAL PATTERN */}
          <div className="report-card pattern-card">
            <h3>🧠 Leadership Style</h3>
            <div className="pattern-badge-large">"The Empathetic Facilitator"</div>
            <div className="pattern-description">
              <p>You demonstrate a collaborative leadership style with strong focus on team wellbeing and clear communication.</p>
            </div>
            <div className="pattern-traits-compact">
              {[
                { label: 'Team-First Approach', level: 95 },
                { label: 'Clear Communication', level: 85 },
                { label: 'Thoughtful Decision-Making', level: 75 }
              ].map((trait, i) => (
                <div key={i} className="trait-compact">
                  <div className="trait-label">{trait.label}</div>
                  <div className="trait-bar-compact">
                    <div 
                      className="trait-fill-compact" 
                      style={{ width: `${trait.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RISK FACTORS */}
          <div className="report-card risk-card">
            <h3>⚠️ Risk Factors & Strengths</h3>
            <div className="risk-list">
              <div className="risk-item strength">
                <span className="risk-icon">✓</span>
                <div>
                  <div className="risk-title">Strong with technical teams</div>
                  <div className="risk-score">94% confidence</div>
                </div>
              </div>
              <div className="risk-item warning">
                <span className="risk-icon">⚠</span>
                <div>
                  <div className="risk-title">May need support with C-level stakeholders</div>
                  <div className="risk-score">Initial coaching recommended</div>
                </div>
              </div>
              <div className="risk-item strength">
                <span className="risk-icon">✓</span>
                <div>
                  <div className="risk-title">Excellent in remote-first environments</div>
                  <div className="risk-score">92% confidence</div>
                </div>
              </div>
            </div>
          </div>

          {/* INTERVIEW QUESTIONS */}
          <div className="report-card interview-card">
            <h3>💡 Recommended Interview Questions</h3>
            <div className="interview-questions">
              <div className="interview-question">
                <div className="question-number">1</div>
                <div className="question-text">
                  "Tell me about a time when you had to balance stakeholder pressure with team capacity. How did you handle it?"
                </div>
                <div className="question-reason">→ Based on prioritization patterns</div>
              </div>
              <div className="interview-question">
                <div className="question-number">2</div>
                <div className="question-text">
                  "Describe a situation where you detected team conflict early. What signals did you notice?"
                </div>
                <div className="question-reason">→ Strong detection skills, verify depth</div>
              </div>
              <div className="interview-question">
                <div className="question-number">3</div>
                <div className="question-text">
                  "How do you approach technical blockers when you're not technical yourself?"
                </div>
                <div className="question-reason">→ Test facilitation over solution-building</div>
              </div>
            </div>
          </div>

          {/* CHAT TRANSCRIPT SNIPPET */}
          <div className="report-card transcript-card">
            <h3>💬 Communication Sample</h3>
            <div className="transcript-snippet">
              <div className="snippet-label">From Slack interaction:</div>
              <div className="chat-bubble">
                <div className="chat-text">
                  "Hey Alex, I know you're blocked. Let me sync with the team right now and get you an ETA within 30 min."
                </div>
                <div className="chat-meta">Candidate → Alex (Backend Dev)</div>
              </div>
              <div className="snippet-analysis">
                <span className="analysis-tag positive">✓ Action-oriented</span>
                <span className="analysis-tag positive">✓ Clear timeline</span>
                <span className="analysis-tag positive">✓ Empathetic tone</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="report-footer">
        <button className="back-to-menu-btn" onClick={onBack}>
          ← Back to Menu
        </button>
        <button className="download-btn" onClick={generatePDF}>
  📄 Download PDF
</button>
        <button className="share-btn">
          🔗 Share Report
        </button>
      </div>
    </div>
  );
};

export default AssessmentReport;