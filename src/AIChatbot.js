import React, { useState, useEffect, useRef } from 'react';
import './AIChatbot.css';

const AIChatbot = ({ isOpen, onClose, challenge }) => {
  const [messages, setMessages] = useState([]);
  const [currentLevel, setCurrentLevel] = useState('welcome');
  const [breadcrumbs, setBreadcrumbs] = useState(['AI Coach']);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inicializar conversación cuando se abre
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage("👋 Hi! I'm your AI coach for this challenge. How can I help you?");
      }, 300);
      setTimeout(() => {
        addBotMessage("I can help you understand what's happening and give you strategic advice.");
      }, 1000);
      setTimeout(() => {
        addBotMessage("What would you like help with?");
        showWelcomeOptions();
      }, 1700);
    }
  }, [isOpen]);

  const addBotMessage = (text, options = null) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      text: text,
      options: options,
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text: text,
      timestamp: new Date()
    }]);
  };

  const showTypingIndicator = (duration = 800) => {
    setIsTyping(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(false);
        resolve();
      }, duration);
    });
  };

  const showWelcomeOptions = () => {
    addBotMessage(null, [
      { id: 'team', label: 'Team Members', icon: '👥' },
      { id: 'priorities', label: 'Priorities & Actions', icon: '🎯' },
      { id: 'communication', label: 'Communication Tips', icon: '💬' },
      { id: 'strategy', label: 'General Strategy', icon: '📊' }
    ]);
  };

  const handleOptionClick = async (optionId, optionLabel) => {
    addUserMessage(optionLabel);
    await showTypingIndicator();

    switch(optionId) {
      case 'team':
        addBotMessage("Great! Who would you like to know more about?");
        addBotMessage(null, [
          { id: 'alex', label: 'Alex (Backend Dev)', icon: '🚧' },
          { id: 'jordan', label: 'Jordan (Frontend Dev)', icon: '😤' },
          { id: 'sam', label: 'Sam (QA Engineer)', icon: '🤐' },
          { id: 'morgan', label: 'Morgan (Product Owner)', icon: '📱' },
          { id: 'casey', label: 'Casey (Designer)', icon: '✨' }
        ]);
        break;

      case 'alex':
        await showTypingIndicator(1200);
        addBotMessage("🚧 **Alex is the critical blocker here.**");
        await showTypingIndicator(1000);
        addBotMessage("**What's happening:**\n• Camera off (embarrassment/isolation)\n• Says 'almost done' but vague\n• Stuck for 2+ days\n• Hasn't asked for help");
        await showTypingIndicator(1000);
        addBotMessage("**Why it matters:**\nJordan's frontend work is completely blocked. This is cascading into team tension.");
        await showTypingIndicator(800);
        addBotMessage("**What to do:**\n1. Don't ask for timelines yet\n2. Ask what *specifically* is stuck\n3. Offer pairing or help\n4. Create psychological safety");
        showBackOptions();
        break;

      case 'jordan':
        await showTypingIndicator(1200);
        addBotMessage("😤 **Jordan is frustrated and showing it publicly.**");
        await showTypingIndicator(1000);
        addBotMessage("**What's happening:**\n• Interrupting constantly\n• Publicly pressuring Alex\n• Work blocked for days\n• Losing patience");
        await showTypingIndicator(1000);
        addBotMessage("**Why it matters:**\nThis public pressure makes Alex defensive and less likely to ask for help. It's making the problem worse.");
        await showTypingIndicator(800);
        addBotMessage("**What to do:**\n1. Acknowledge their frustration privately\n2. Explain you're unblocking Alex now\n3. Give them alternative tasks\n4. Address the interrupting behavior gently");
        showBackOptions();
        break;

      case 'sam':
        await showTypingIndicator(1200);
        addBotMessage("🤐 **Sam is the silent one - but that's a red flag.**");
        await showTypingIndicator(1000);
        addBotMessage("**What's happening:**\n• Silent in meetings\n• Arms crossed, looking away\n• Not speaking up\n• Something is bothering them");
        await showTypingIndicator(1000);
        addBotMessage("**Why it matters:**\nQA is downstream from everyone. If they're disengaged, quality suffers and problems get found late.");
        await showTypingIndicator(800);
        addBotMessage("**What to do:**\n1. Check in 1-on-1 after the daily\n2. Ask open questions\n3. Create space for them to share\n4. Don't force it in the group");
        showBackOptions();
        break;

      case 'morgan':
        await showTypingIndicator(1200);
        addBotMessage("📱 **Morgan (PO) is distracted and not fully present.**");
        await showTypingIndicator(1000);
        addBotMessage("**What's happening:**\n• Joined 5 min late\n• Looking at phone\n• Not engaged\n• Missed context");
        await showTypingIndicator(1000);
        addBotMessage("**Why it matters:**\nThe PO needs to know about blockers to make priority decisions and manage stakeholders.");
        await showTypingIndicator(800);
        addBotMessage("**What to do:**\n1. Sync with Morgan after the daily\n2. Brief them on Alex's blocker\n3. Get alignment on priorities\n4. Manage expectations with stakeholders");
        showBackOptions();
        break;

      case 'casey':
        await showTypingIndicator(1000);
        addBotMessage("✨ **Casey is actually doing great!**");
        await showTypingIndicator(800);
        addBotMessage("**What's happening:**\n• Collaborative and positive\n• Finished work on time\n• Offering help proactively\n• No issues detected");
        await showTypingIndicator(600);
        addBotMessage("**Note:** If you marked Casey as having a problem, that was the trap option. Casey is the control - showing what a healthy team member looks like.");
        showBackOptions();
        break;

      case 'priorities':
        addBotMessage("Let me break down the priorities:");
        await showTypingIndicator(1000);
        addBotMessage("**🔴 Critical (do first):**\n1. Unblock Alex immediately\n2. This unblocks Jordan\n3. Reduces team tension");
        await showTypingIndicator(1000);
        addBotMessage("**🟡 Important (do soon):**\n4. Check in with Sam\n5. Sync with Morgan (PO)\n6. Address Jordan's behavior");
        await showTypingIndicator(800);
        addBotMessage("**Why this order?**\nDependency blockers cascade. Fix the root cause first, not the symptoms.");
        showBackOptions();
        break;

      case 'communication':
        addBotMessage("Communication tips for this situation:");
        await showTypingIndicator(1000);
        addBotMessage("**For Alex:**\n✅ 'What specifically is blocking you?'\n✅ 'Want to pair program on this?'\n❌ 'When will you be done?'");
        await showTypingIndicator(1000);
        addBotMessage("**For Jordan:**\n✅ 'I know this is frustrating. Let me unblock this now.'\n✅ 'Can you work on X while we fix this?'\n❌ 'Stop interrupting'");
        await showTypingIndicator(1000);
        addBotMessage("**General principle:**\nCreate safety before asking for vulnerability.");
        showBackOptions();
        break;

      case 'strategy':
        addBotMessage("Here's the strategic approach:");
        await showTypingIndicator(1000);
        addBotMessage("**📊 You're being scored on:**\n• Detection accuracy\n• Prioritization (dependencies first)\n• Communication quality\n• Time efficiency");
        await showTypingIndicator(1000);
        addBotMessage("**🎯 Pro tips:**\n1. Read body language (camera off, arms crossed)\n2. Identify the root cause (Alex), not symptoms\n3. Use Slack/Jira tabs for context\n4. Create psychological safety");
        await showTypingIndicator(800);
        addBotMessage("**⏰ Time management:**\nYou have limited time. Focus on the critical path: Alex → Jordan → Team health.");
        showBackOptions();
        break;

      default:
        addBotMessage("I can help you with team members, priorities, communication tips, or general strategy. What interests you?");
        showWelcomeOptions();
    }
  };

  const showBackOptions = () => {
    setTimeout(() => {
      addBotMessage(null, [
        { id: 'back', label: 'Back to menu', icon: '←' }
      ]);
    }, 500);
  };

  const handleBackClick = () => {
    addUserMessage('← Back to menu');
    setTimeout(() => {
      addBotMessage("What else can I help you with?");
      showWelcomeOptions();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chatbot-container">
      <div className="ai-chatbot-header">
        <div className="chatbot-header-left">
          <div className="bot-avatar">🤖</div>
          <div className="bot-info">
            <div className="bot-name">AI Coach</div>
            <div className="bot-status">
              <span className="status-dot"></span>
              Online
            </div>
          </div>
        </div>
        <button className="chatbot-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="ai-chatbot-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.type}`}>
            {msg.type === 'bot' && (
              <div className="message-avatar">🤖</div>
            )}
            <div className="message-content">
              {msg.text && (
                <div className="message-bubble">
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.includes('**') ? (
                        <span dangerouslySetInnerHTML={{
                          __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }} />
                      ) : (
                        line
                      )}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              )}
              {msg.options && (
                <div className="message-options">
                  {msg.options.map(option => (
                    <button
                      key={option.id}
                      className="option-btn"
                      onClick={() => {
                        if (option.id === 'back') {
                          handleBackClick();
                        } else {
                          handleOptionClick(option.id, option.label);
                        }
                      }}
                    >
                      <span className="option-icon">{option.icon}</span>
                      <span className="option-label">{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-message bot">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chatbot-footer">
        <div className="chatbot-branding">
          <span className="branding-icon">⚡</span>
          <span className="branding-text">Powered by AI Coach</span>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;