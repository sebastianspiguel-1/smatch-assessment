import React, { useState } from 'react';
import './AIAssistant.css';

const AIAssistant = ({ isOpen, onClose, challenge = 1 }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [breadcrumbs, setBreadcrumbs] = useState(['AI Assistant']);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Data structure for Challenge 1
  const assistantData = {
    categories: [
      {
        id: 'team',
        icon: '👥',
        title: 'Team Members',
        subtitle: 'Get insights about specific team members',
        topics: [
          {
            id: 'alex',
            name: 'Alex (Backend Dev)',
            status: '🚧 Blocked',
            questions: [
              {
                id: 'alex-blocking',
                question: "What's blocking Alex?",
                answer: {
                  summary: "Alex is stuck on API endpoint integration for 2+ days",
                  details: [
                    "Has camera off - classic sign of embarrassment/struggle",
                    "Says 'almost done' but is vague about timeline",
                    "Hasn't asked for help - pride or isolation",
                    "This is blocking Jordan's frontend work"
                  ],
                  recommendation: "Don't ask for timelines yet. Ask what specifically is stuck. Offer to pair with someone.",
                  priority: 'critical'
                }
              },
              {
                id: 'alex-communicate',
                question: "How should I communicate with Alex?",
                answer: {
                  summary: "Use empathetic, non-judgmental approach",
                  details: [
                    "Acknowledge the complexity of the task",
                    "Ask open-ended questions: 'What part is tricky?'",
                    "Offer resources, not pressure",
                    "Create psychological safety - no blame"
                  ],
                  recommendation: "DM privately after the daily. Public pressure will backfire.",
                  priority: 'high'
                }
              },
              {
                id: 'alex-priority',
                question: "Should I unblock Alex first?",
                answer: {
                  summary: "YES - Alex is the critical path blocker",
                  details: [
                    "Jordan can't proceed without Alex's API",
                    "This affects sprint completion",
                    "Demo is at risk",
                    "Team morale is suffering"
                  ],
                  recommendation: "This should be your #1 priority. Everything else depends on it.",
                  priority: 'critical'
                }
              },
              {
                id: 'alex-avoid',
                question: "What NOT to do with Alex?",
                answer: {
                  summary: "Avoid these common mistakes",
                  details: [
                    "❌ Don't ask 'when will it be done?' - creates defensiveness",
                    "❌ Don't suggest rollback without understanding the issue",
                    "❌ Don't involve management yet",
                    "❌ Don't let them stay isolated"
                  ],
                  recommendation: "Focus on collaboration, not interrogation.",
                  priority: 'medium'
                }
              }
            ]
          },
          {
            id: 'jordan',
            name: 'Jordan (Frontend Dev)',
            status: '😤 Frustrated',
            questions: [
              {
                id: 'jordan-frustration',
                question: "Why is Jordan frustrated?",
                answer: {
                  summary: "Jordan is blocked and feels unheard",
                  details: [
                    "Can't finish work - waiting on Alex's API",
                    "Asked for ETA multiple times with no clear answer",
                    "Interrupting constantly - sign of anxiety",
                    "Work is piling up with no progress"
                  ],
                  recommendation: "Acknowledge their frustration. Give them visibility into the plan.",
                  priority: 'high'
                }
              },
              {
                id: 'jordan-handle',
                question: "How do I handle Jordan's interruptions?",
                answer: {
                  summary: "Balance empathy with facilitation",
                  details: [
                    "Acknowledge: 'I hear you, this is frustrating'",
                    "Set boundaries: 'Let Alex finish, then we'll address it'",
                    "Give timeline: 'I'll sync with you in 30 min with updates'",
                    "Provide alternate tasks if possible"
                  ],
                  recommendation: "Don't shut them down. Channel the energy productively.",
                  priority: 'medium'
                }
              },
              {
                id: 'jordan-alternatives',
                question: "Can Jordan work on something else?",
                answer: {
                  summary: "Possibly, but check dependencies first",
                  details: [
                    "Check Jira for non-blocked tasks",
                    "Could work on UI polish or tests",
                    "Might help with design review",
                    "Document integration specs for later"
                  ],
                  recommendation: "Ask Jordan: 'While we unblock this, what else could you tackle?'",
                  priority: 'medium'
                }
              }
            ]
          },
          {
            id: 'sam',
            name: 'Sam (QA Engineer)',
            status: '🤐 Silent',
            questions: [
              {
                id: 'sam-issue',
                question: "What's wrong with Sam?",
                answer: {
                  summary: "Sam is disengaged - body language shows withdrawal",
                  details: [
                    "Arms crossed, looking away",
                    "Not participating in standup",
                    "Only said '...' - passive aggressive",
                    "Might be frustrated with team dysfunction"
                  ],
                  recommendation: "Check in privately after the daily. Something is bothering them.",
                  priority: 'medium'
                }
              },
              {
                id: 'sam-blocked',
                question: "Is Sam blocked too?",
                answer: {
                  summary: "Likely - QA depends on completed features",
                  details: [
                    "Can't test what isn't built",
                    "Might be frustrated by constant delays",
                    "Could feel excluded from technical decisions",
                    "Possibly has feedback that's being ignored"
                  ],
                  recommendation: "Ask Sam directly: 'How's the testing pipeline? Any concerns?'",
                  priority: 'medium'
                }
              },
              {
                id: 'sam-engage',
                question: "How do I re-engage Sam?",
                answer: {
                  summary: "Create space for their voice",
                  details: [
                    "Ask direct questions: 'Sam, what's your take?'",
                    "Value their QA perspective in planning",
                    "1-on-1 to understand concerns",
                    "Give them a clear role in unblocking"
                  ],
                  recommendation: "Silent team members often have the most valuable insights.",
                  priority: 'medium'
                }
              }
            ]
          },
          {
            id: 'morgan',
            name: 'Morgan (Product Owner)',
            status: '📱 Distracted',
            questions: [
              {
                id: 'morgan-distracted',
                question: "Why is Morgan distracted?",
                answer: {
                  summary: "Joined late and not focused on the team",
                  details: [
                    "Joined 5 min late to the daily",
                    "Looking at phone during standup",
                    "Missed critical context about blockers",
                    "Might be dealing with stakeholder pressure"
                  ],
                  recommendation: "Morgan needs to know the sprint is at risk. Loop them in ASAP.",
                  priority: 'high'
                }
              },
              {
                id: 'morgan-inform',
                question: "What does Morgan need to know?",
                answer: {
                  summary: "Critical update: Sprint delivery is at risk",
                  details: [
                    "Alex blocked = Jordan blocked = features delayed",
                    "Demo might need rescheduling",
                    "Need PO input on priority changes",
                    "Stakeholders might need heads up"
                  ],
                  recommendation: "Sync with Morgan right after the daily with clear status and options.",
                  priority: 'critical'
                }
              }
            ]
          },
          {
            id: 'casey',
            name: 'Casey (Designer)',
            status: '✅ All Good',
            questions: [
              {
                id: 'casey-status',
                question: "Is Casey okay?",
                answer: {
                  summary: "Yes! Casey is the bright spot",
                  details: [
                    "Completed mockups on time",
                    "Positive, collaborative energy",
                    "Offering to help Jordan",
                    "No blockers or issues"
                  ],
                  recommendation: "No action needed. Just appreciate the positive contribution.",
                  priority: 'low'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'priorities',
        icon: '🎯',
        title: 'Priorities & Actions',
        subtitle: 'Understand what to do first',
        topics: [
          {
            id: 'what-first',
            name: 'What should I do first?',
            questions: [
              {
                id: 'priority-order',
                question: "What's the correct priority order?",
                answer: {
                  summary: "Unblock Alex → Address team tension → Sync with PO",
                  details: [
                    "1️⃣ Unblock Alex (critical path)",
                    "2️⃣ Address team tension (prevent escalation)",
                    "3️⃣ Sync with PO on timeline",
                    "4️⃣ Check in with Sam"
                  ],
                  recommendation: "Dependencies always come first. Everything else flows from Alex being unblocked.",
                  priority: 'critical'
                }
              }
            ]
          },
          {
            id: 'coordination',
            name: 'How do I coordinate the team?',
            questions: [
              {
                id: 'coordinate-alex-jordan',
                question: "Should I connect Alex and Jordan?",
                answer: {
                  summary: "Yes, but after understanding Alex's blocker first",
                  details: [
                    "Don't force collaboration before diagnosis",
                    "Understand what Alex is stuck on",
                    "Then decide if pairing helps or hurts",
                    "Jordan might add pressure Alex doesn't need"
                  ],
                  recommendation: "Talk to Alex 1-on-1 first, then decide if Jordan should be involved.",
                  priority: 'high'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'communication',
        icon: '💬',
        title: 'Communication Tips',
        subtitle: 'How to say things effectively',
        topics: [
          {
            id: 'difficult-convos',
            name: 'Difficult Conversations',
            questions: [
              {
                id: 'ask-for-help',
                question: "How do I get Alex to ask for help?",
                answer: {
                  summary: "Create psychological safety and normalize asking",
                  details: [
                    "Say: 'This is complex work. What part would help to talk through?'",
                    "Share: 'I've been stuck on hard problems too'",
                    "Offer specific help: 'Want to pair? Or should I find someone?'",
                    "Remove judgment: 'No wrong answer here'"
                  ],
                  recommendation: "Make it safe to be stuck. Praise vulnerability.",
                  priority: 'high'
                }
              }
            ]
          },
          {
            id: 'manage-tension',
            name: 'Managing Team Tension',
            questions: [
              {
                id: 'defuse-conflict',
                question: "How do I defuse Jordan vs Alex tension?",
                answer: {
                  summary: "Acknowledge both sides and redirect to solutions",
                  details: [
                    "To Jordan: 'I hear you. Being blocked is frustrating.'",
                    "To Alex: 'Complex work takes time. Let's figure this out.'",
                    "Redirect: 'Let's focus on unblocking, not timelines'",
                    "Set next steps: 'I'll sync with both of you in 30 min'"
                  ],
                  recommendation: "Validate feelings, then move to action.",
                  priority: 'high'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'strategy',
        icon: '📊',
        title: 'General Strategy',
        subtitle: 'Big picture guidance',
        topics: [
          {
            id: 'assessment-scoring',
            name: 'How am I being scored?',
            questions: [
              {
                id: 'what-matters',
                question: "What matters most in this assessment?",
                answer: {
                  summary: "Detection, prioritization, and communication quality",
                  details: [
                    "✅ Did you detect all the real issues?",
                    "✅ Did you prioritize the critical path first?",
                    "✅ Did you communicate with empathy and clarity?",
                    "❌ False positives (seeing problems that aren't there) hurt your score"
                  ],
                  recommendation: "Focus on what's actually broken, not what might be broken.",
                  priority: 'medium'
                }
              }
            ]
          },
          {
            id: 'time-management',
            name: 'Time Management',
            questions: [
              {
                id: 'how-much-time',
                question: "How much time should I spend on each action?",
                answer: {
                  summary: "Balance thoroughness with urgency",
                  details: [
                    "Quick wins: Acknowledge Jordan's frustration (30 sec)",
                    "Deep work: Understand Alex's blocker (5-10 min)",
                    "Coordination: Sync with Morgan (5 min)",
                    "Follow-up: Sam check-in (3 min)"
                  ],
                  recommendation: "Don't overthink. Real Scrum Masters make fast, informed decisions.",
                  priority: 'medium'
                }
              }
            ]
          }
        ]
      }
    ]
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentLevel(2);
    setBreadcrumbs(['AI Assistant', category.title]);
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setCurrentLevel(3);
    setBreadcrumbs([...breadcrumbs, topic.name]);
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setCurrentLevel(4);
    setBreadcrumbs([...breadcrumbs, question.question]);
  };

  const handleBack = () => {
    if (currentLevel === 4) {
      setSelectedQuestion(null);
      setCurrentLevel(3);
      setBreadcrumbs(breadcrumbs.slice(0, -1));
    } else if (currentLevel === 3) {
      setSelectedTopic(null);
      setCurrentLevel(2);
      setBreadcrumbs(breadcrumbs.slice(0, -1));
    } else if (currentLevel === 2) {
      setSelectedCategory(null);
      setCurrentLevel(1);
      setBreadcrumbs(['AI Assistant']);
    }
  };

  const handleReset = () => {
    setCurrentLevel(1);
    setSelectedCategory(null);
    setSelectedTopic(null);
    setSelectedQuestion(null);
    setBreadcrumbs(['AI Assistant']);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-assistant-overlay" onClick={onClose}>
      <div className="ai-assistant-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ai-assistant-header">
          <div className="ai-header-left">
            <span className="ai-icon">🤖</span>
            <div>
              <h2>AI Assistant</h2>
              <p className="ai-subtitle">Your Scrum Master coach</p>
            </div>
          </div>
          <button className="ai-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Breadcrumbs */}
        <div className="ai-breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {index > 0 && <span className="breadcrumb-separator">›</span>}
              <span className="breadcrumb">{crumb}</span>
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="ai-assistant-content">
          {/* Level 1: Categories */}
          {currentLevel === 1 && (
            <div className="ai-categories">
              {assistantData.categories.map((category) => (
                <div
                  key={category.id}
                  className="ai-category-card"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="category-icon">{category.icon}</div>
                  <h3>{category.title}</h3>
                  <p>{category.subtitle}</p>
                </div>
              ))}
            </div>
          )}

          {/* Level 2: Topics */}
          {currentLevel === 2 && selectedCategory && (
            <div className="ai-topics">
              {selectedCategory.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="ai-topic-card"
                  onClick={() => handleTopicClick(topic)}
                >
                  <div className="topic-header">
                    <h3>{topic.name}</h3>
                    {topic.status && <span className="topic-status">{topic.status}</span>}
                  </div>
                  <p>{topic.questions.length} questions available</p>
                </div>
              ))}
            </div>
          )}

          {/* Level 3: Questions */}
          {currentLevel === 3 && selectedTopic && (
            <div className="ai-questions">
              {selectedTopic.questions.map((question) => (
                <div
                  key={question.id}
                  className="ai-question-card"
                  onClick={() => handleQuestionClick(question)}
                >
                  <span className="question-icon">❓</span>
                  <span>{question.question}</span>
                </div>
              ))}
            </div>
          )}

          {/* Level 4: Answer */}
          {currentLevel === 4 && selectedQuestion && (
            <div className="ai-answer">
              <div className={`answer-priority priority-${selectedQuestion.answer.priority}`}>
                {selectedQuestion.answer.priority === 'critical' && '🔴 Critical'}
                {selectedQuestion.answer.priority === 'high' && '🟡 High Priority'}
                {selectedQuestion.answer.priority === 'medium' && '🟢 Medium'}
                {selectedQuestion.answer.priority === 'low' && '⚪ Low Priority'}
              </div>

              <h3 className="answer-summary">{selectedQuestion.answer.summary}</h3>

              <div className="answer-details">
                <h4>Details:</h4>
                <ul>
                  {selectedQuestion.answer.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>

              <div className="answer-recommendation">
                <h4>💡 Recommendation:</h4>
                <p>{selectedQuestion.answer.recommendation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ai-assistant-footer">
          {currentLevel > 1 && (
            <button className="ai-back-btn" onClick={handleBack}>
              ← Back
            </button>
          )}
          <button className="ai-reset-btn" onClick={handleReset}>
            ↺ Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
