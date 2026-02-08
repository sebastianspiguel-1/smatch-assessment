import React from 'react';
import './AssessmentReport.css';


const AssessmentReport = ({ results, onBack, language }) => {
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

  return (
    <div className="report-container">
      {/* HEADER */}
      <div className="report-header">
        <div className="report-title-section">
          <h1 className="report-title">📊 Assessment Report</h1>
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
            <h3>Core Skills</h3>
            <div className="skills-list">
              {[
                { name: 'Team Reading', score: results.detectionScore, avg: 65, top: 85 },
                { name: 'Conflict Resolution', score: results.conflictScore || 70, avg: 68, top: 88 },
                { name: 'Communication', score: results.communicationScore, avg: 72, top: 90 },
                { name: 'Prioritization', score: results.prioritizationScore, avg: 70, top: 87 },
                { name: 'Adaptability', score: results.adaptabilityScore || 75, avg: 65, top: 85 }
              ].map((skill, index) => (
                <div key={index} className="skill-row">
                  <div className="skill-name">{skill.name}</div>
                  <div className="skill-bars">
                    <div className="skill-bar">
                      <div className="bar-label">You</div>
                      <div className="bar-track">
                        <div 
                          className="bar-fill you" 
                          style={{ width: `${skill.score}%` }}
                        ></div>
                      </div>
                      <div className="bar-value">{skill.score}%</div>
                    </div>
                    <div className="skill-bar small">
                      <div className="bar-label">Avg</div>
                      <div className="bar-track small">
                        <div 
                          className="bar-fill avg" 
                          style={{ width: `${skill.avg}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="skill-bar small">
                      <div className="bar-label">Top</div>
                      <div className="bar-track small">
                        <div 
                          className="bar-fill top" 
                          style={{ width: `${skill.top}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="report-right">
          {/* FLAGS */}
          <div className="report-card">
            <h3>Flags</h3>
            
            {results.greenFlags && results.greenFlags.length > 0 && (
              <div className="flags-section green">
                <div className="flag-header">✅ Green Flags ({results.greenFlags.length})</div>
                {results.greenFlags.map((flag, i) => (
                  <div key={i} className="flag-item">• {flag}</div>
                ))}
              </div>
            )}

            {results.redFlags && results.redFlags.length > 0 && (
              <div className="flags-section red">
                <div className="flag-header">🚩 Red Flags ({results.redFlags.length})</div>
                {results.redFlags.map((flag, i) => (
                  <div key={i} className="flag-item">• {flag}</div>
                ))}
              </div>
            )}

            {results.yellowFlags && results.yellowFlags.length > 0 && (
              <div className="flags-section yellow">
                <div className="flag-header">⚠️ Yellow Flags ({results.yellowFlags.length})</div>
                {results.yellowFlags.map((flag, i) => (
                  <div key={i} className="flag-item">• {flag}</div>
                ))}
              </div>
            )}
          </div>

          {/* BEHAVIORAL PATTERN */}
          <div className="report-card">
            <h3>Leadership Style</h3>
            <div className="pattern-badge">"The Empathetic Facilitator"</div>
            <div className="pattern-traits">
              <div className="trait-row">
                <span>Communication</span>
                <div className="trait-bar">
                  <div className="trait-fill" style={{ width: '85%' }}></div>
                </div>
                <span className="trait-label">Direct & Warm</span>
              </div>
              <div className="trait-row">
                <span>Decision Speed</span>
                <div className="trait-bar">
                  <div className="trait-fill" style={{ width: '70%' }}></div>
                </div>
                <span className="trait-label">Thoughtful</span>
              </div>
              <div className="trait-row">
                <span>Team Focus</span>
                <div className="trait-bar">
                  <div className="trait-fill" style={{ width: '95%' }}></div>
                </div>
                <span className="trait-label">High</span>
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
        <button className="download-btn">
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