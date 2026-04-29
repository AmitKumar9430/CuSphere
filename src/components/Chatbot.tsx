import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, User, Move, Users, Upload, MessageSquare, FileText, Sparkles, Zap, Award, HelpCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryQuestions, setCategoryQuestions] = useState({});
  const [position, setPosition] = useState({ 
    x: typeof window !== 'undefined' ? (window.innerWidth <= 640 ? 16 : window.innerWidth - 180) : 0, 
    y: typeof window !== 'undefined' ? (window.innerWidth <= 640 ? window.innerHeight - 80 : window.innerHeight - 75) : 0 
  });

  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Default category mappings for UI (icon, colors)
  const defaultCategoryUI = {
    'teams': {
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    'team': {
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    'submit': {
      icon: Upload,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    'submission': {
      icon: Upload,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    'feedback': {
      icon: MessageSquare,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    },
    'general': {
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    'info': {
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    }
  };

  // Load categories from database on component mount
  useEffect(() => {
    loadCategoriesFromDB();
  }, []);

  const loadCategoriesFromDB = async () => {
    try {
      // Fetch unique categories from database
      const { data, error } = await supabase
        .from('chatbot_faqs')
        .select('category')
        .eq('is_active', true);

      if (error) {
        console.error('❌ Error loading categories:', error);
        return;
      }

      if (data && data.length > 0) {
        // Get unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        
        // Map categories to UI format
        const categoriesData = uniqueCategories.map(cat => {
          const categoryKey = cat.toLowerCase();
          const uiConfig = defaultCategoryUI[categoryKey] || {
            icon: HelpCircle,
            color: 'from-gray-500 to-gray-600',
            hoverColor: 'hover:from-gray-600 hover:to-gray-700'
          };

          return {
            id: cat,
            name: formatCategoryName(cat),
            icon: uiConfig.icon,
            color: uiConfig.color,
            hoverColor: uiConfig.hoverColor
          };
        });

        setCategories(categoriesData);

        // Load questions for each category
        for (const cat of uniqueCategories) {
          await loadQuestionsForCategory(cat);
        }
      }
    } catch (err) {
      console.error('⚠️ Error loading categories:', err);
    }
  };

  const formatCategoryName = (category) => {
    // Convert category slug to readable name
    const nameMap = {
      'teams': 'Team Selection',
      'team': 'Team Selection',
      'submit': 'Submit Project',
      'submission': 'Submit Project',
      'feedback': 'Feedback Center',
      'general': 'General Info',
      'info': 'General Info'
    };

    const key = category.toLowerCase();
    if (nameMap[key]) {
      return nameMap[key];
    }

    // Default: capitalize first letter of each word
    return category
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const loadQuestionsForCategory = async (category) => {
    try {
      const { data, error } = await supabase
        .from('chatbot_faqs')
        .select('question')
        .eq('category', category)
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .limit(5);

      if (error) {
        console.error(`❌ Error loading questions for ${category}:`, error);
        return;
      }

      if (data && data.length > 0) {
        setCategoryQuestions(prev => ({
          ...prev,
          [category]: data.map(item => item.question)
        }));
      }
    } catch (err) {
      console.error(`⚠️ Error loading questions for ${category}:`, err);
    }
  };

  const fetchDatabaseResponse = async (question) => {
    try {
      const cleanQuestion = question.trim().toLowerCase();

      // Query the chatbot_faqs table
      const { data, error } = await supabase
        .from('chatbot_faqs')
        .select('question, answer, keywords')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) {
        console.error('❌ Supabase fetch error:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ No FAQs found in database.');
        return null;
      }

      // 🔍 Enhanced fuzzy matching
      let bestMatch = null;
      let highestScore = 0;

      for (const faq of data) {
        const qLower = faq.question.toLowerCase();
        let score = 0;

        // Exact match (highest priority)
        if (qLower === cleanQuestion) {
          score = 100;
        }
        // Question contains user input
        else if (qLower.includes(cleanQuestion)) {
          score = 80;
        }
        // User input contains question
        else if (cleanQuestion.includes(qLower)) {
          score = 70;
        }
        // Keyword matching
        else if (faq.keywords && Array.isArray(faq.keywords)) {
          for (const keyword of faq.keywords) {
            const kwLower = keyword.toLowerCase();
            if (cleanQuestion.includes(kwLower) || kwLower.includes(cleanQuestion)) {
              score = Math.max(score, 60);
            }
          }
        }

        // Check for word overlap
        const questionWords = qLower.split(/\s+/);
        const inputWords = cleanQuestion.split(/\s+/);
        const commonWords = questionWords.filter(w => 
          w.length > 3 && inputWords.some(iw => iw.includes(w) || w.includes(iw))
        );
        if (commonWords.length > 0) {
          score = Math.max(score, 40 + (commonWords.length * 10));
        }

        if (score > highestScore) {
          highestScore = score;
          bestMatch = faq;
        }
      }

      if (bestMatch && highestScore >= 40) {
        console.log('✅ DB match found:', bestMatch, 'Score:', highestScore);
        return bestMatch.answer;
      } else {
        console.log('⚠️ No database match for:', question);
        return null;
      }
    } catch (err) {
      console.error('⚠️ Error fetching DB response:', err);
      return null;
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage("Hi! 👋 I'm your Project Assistant. How can I help you today?\n\nPlease select a category below:");
    }
    
    // Calculate window position when opening
    if (isOpen) {
      calculateWindowPosition();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 640;
      const maxX = window.innerWidth - (isOpen ? (isMobile ? window.innerWidth - 16 : Math.min(384, window.innerWidth - 32)) : 64);
      const maxY = window.innerHeight - (isOpen ? (isMobile ? window.innerHeight - 16 : Math.min(600, window.innerHeight - 32)) : 64);
      
      setPosition(prev => ({
        x: isMobile ? 16 : Math.min(prev.x, maxX),
        y: isMobile ? window.innerHeight - 80 : Math.min(prev.y, maxY)
      }));
      
      if (isOpen) {
        calculateWindowPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const isMobile = window.innerWidth <= 640;
        
        if (isOpen) {
          // Don't allow dragging on mobile for chat window
          if (isMobile) return;
          
          // Dragging the chat window
          const chatWidth = Math.min(384, window.innerWidth - 32);
          const chatHeight = Math.min(600, window.innerHeight - 32);
          
          const newX = e.clientX - dragOffset.x;
          const newY = e.clientY - dragOffset.y;
          
          const maxX = window.innerWidth - chatWidth - 16;
          const maxY = window.innerHeight - chatHeight - 16;
          
          setWindowPosition({
            x: Math.max(16, Math.min(newX, maxX)),
            y: Math.max(16, Math.min(newY, maxY))
          });
        } else {
          // Don't allow dragging on mobile for chat icon - keep it fixed
          if (isMobile) return;
          
          // Dragging the chat icon
          const iconSize = 64;
          const newX = e.clientX - dragOffset.x;
          const newY = e.clientY - dragOffset.y;
          
          const maxX = window.innerWidth - iconSize - 16;
          const maxY = window.innerHeight - iconSize - 16;
          
          setPosition({
            x: Math.max(16, Math.min(newX, maxX)),
            y: Math.max(16, Math.min(newY, maxY))
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isOpen]);

  const calculateWindowPosition = () => {
    const iconSize = 64;
    const isMobile = window.innerWidth <= 640;
    const windowWidth = isMobile ? window.innerWidth - 32 : Math.min(384, window.innerWidth - 32);
    const windowHeight = isMobile ? window.innerHeight - 32 : Math.min(600, window.innerHeight - 32);
    const padding = 20;

    let newX = position.x;
    let newY = position.y;

    // On mobile, center the chat window
    if (isMobile) {
      newX = 16;
      newY = 16;
    } else {
      if (position.x - windowWidth - padding >= 0) {
        newX = position.x - windowWidth - padding;
      } else if (position.x + iconSize + padding + windowWidth <= window.innerWidth) {
        newX = position.x + iconSize + padding;
      } else {
        newX = Math.max(padding, (window.innerWidth - windowWidth) / 2);
      }

      newY = position.y;
      
      if (newY + windowHeight > window.innerHeight - padding) {
        newY = window.innerHeight - windowHeight - padding;
      }
      
      if (newY < padding) {
        newY = padding;
      }
    }

    setWindowPosition({ x: newX, y: newY });
  };

  const handleDragStart = (e) => {
    const isMobile = window.innerWidth <= 640;
    if (isMobile) return; // Don't start dragging on mobile
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    }]);
  };

  const saveChatHistory = async (userMessage, botResponse) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let sessionId = sessionStorage.getItem('chat_session_id');
      if (!sessionId) {
        sessionId = generateSessionId();
      }

      await supabase.from('chat_history').insert({
        user_id: user?.id || null,
        user_message: userMessage,
        bot_response: botResponse,
        session_id: sessionId,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const generateSessionId = () => {
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('chat_session_id', sessionId);
    return sessionId;
  };

  const handleCategorySelect = async (category) => {
    setCurrentCategory(category);
    addUserMessage(category.name);
    setIsTyping(true);
    
    // Load questions from database if not already loaded
    if (!categoryQuestions[category.id] || categoryQuestions[category.id].length === 0) {
      await loadQuestionsForCategory(category.id);
    }
    
    setTimeout(() => {
      const questionsText = `Here are the questions about ${category.name}:`;
      addBotMessage(questionsText);
      saveChatHistory(category.name, questionsText);
      setIsTyping(false);
    }, 800);
  };

  const handleQuestionClick = async (question) => {
    addUserMessage(question);
    setIsTyping(true);
    
    setTimeout(async () => {
      const response = await fetchDatabaseResponse(question);
      const finalResponse = response || "I don't have information about that. Please contact support at Amit@projectportal.com";
      addBotMessage(finalResponse);
      await saveChatHistory(question, finalResponse);
      setIsTyping(false);
    }, 800);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage.trim();
    addUserMessage(userMsg);
    setInputMessage('');
    setIsTyping(true);

    // Fetch response from database
    const dbResponse = await fetchDatabaseResponse(userMsg);

    const response = dbResponse || "I'm not sure about that. Please select a category or rephrase your question. You can also contact support at Amit@projectportal.com";

    setTimeout(async () => {
      addBotMessage(response);
      await saveChatHistory(userMsg, response);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const CategoryButtons = () => (
    <div className="grid grid-cols-2 gap-2 mt-3">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category)}
            className={`relative flex flex-col items-center gap-1.5 p-2.5 bg-gradient-to-br ${category.color} ${category.hoverColor} text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles size={10} className="text-white animate-pulse" />
            </div>
            <div className="bg-white/20 p-1.5 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Icon size={18} className="drop-shadow-lg" />
            </div>
            <span className="text-xs font-semibold text-center drop-shadow-md leading-tight">{category.name}</span>
          </button>
        );
      })}
    </div>
  );

  const QuestionButtons = ({ category }) => {
    const questions = categoryQuestions[category.id] || [];
    
    return (
      <div className="flex flex-col gap-1.5 mt-3">
        {questions.length > 0 ? (
          questions.map((question, idx) => (
            <button
              key={idx}
              onClick={() => handleQuestionClick(question)}
              className="group relative text-left text-xs bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-blue-300 rounded-lg px-3 py-2 transition-all duration-300 transform hover:scale-102 hover:shadow-md overflow-hidden"
            >
              <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
              <div className="flex items-center gap-1.5">
                <Zap size={12} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
                <span className="font-medium leading-snug">{question}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="text-xs text-gray-500 text-center py-2">
            No questions available for this category.
          </div>
        )}
      </div>
    );
  };

  const chatWidth = isOpen ? 'w-full sm:w-96' : 'w-16';
  const chatHeight = isOpen ? 'h-[90vh] sm:h-[600px]' : 'h-16';

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onMouseDown={handleDragStart}
          onClick={(e) => {
            if (!isDragging) setIsOpen(true);
          }}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: window.innerWidth <= 640 ? 'pointer' : (isDragging ? 'grabbing' : 'grab')
          }}
          className="fixed bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white rounded-full p-4 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 z-[9999] group"
          aria-label="Open chat"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse"></div>
          <Bot size={28} className="relative z-10 drop-shadow-lg" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
          <Sparkles size={16} className="absolute -bottom-1 -left-1 text-yellow-300 animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          style={{
            left: `${windowPosition.x}px`,
            top: `${windowPosition.y}px`,
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 32px)'
          }}
          className={`fixed ${chatWidth} ${chatHeight} bg-white rounded-2xl shadow-2xl flex flex-col z-[9999] border border-gray-200`}
        >
          {/* Header */}
          <div
            onMouseDown={handleDragStart}
            className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white p-3 sm:p-4 rounded-t-2xl flex items-center justify-between cursor-grab active:cursor-grabbing flex-shrink-0 overflow-hidden"
            style={{ cursor: window.innerWidth <= 640 ? 'default' : undefined }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
            <div className="flex items-center gap-2 sm:gap-3 relative z-10">
              <div className="relative bg-white rounded-full p-1.5 sm:p-2 shadow-xl">
                <Bot size={20} className="text-blue-600 sm:w-6 sm:h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-lg drop-shadow-md">Project Assistant</h3>
                  <Award size={16} className="text-yellow-300 animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                  <p className="text-xs text-blue-100 font-medium">Online • AI Powered</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <Move size={16} className="text-blue-200 opacity-70 hidden sm:block animate-pulse" />
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-full p-1.5 transition-all duration-300 hover:rotate-90 hover:scale-110"
              >
                <X size={20} className="sm:w-6 sm:h-6 drop-shadow-lg" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, index) => (
              <div key={msg.id}>
                <div
                  className={`flex gap-2 mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-1.5 h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot size={14} className="text-white sm:w-4 sm:h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs sm:text-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-none shadow-lg'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-md border-2 border-gray-100 hover:shadow-lg transition-shadow duration-300'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <span className={`text-xs mt-1 block ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-full p-1.5 h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User size={14} className="text-white sm:w-4 sm:h-4" />
                    </div>
                  )}
                </div>
                
                {/* Show category buttons after bot's first message */}
                {msg.sender === 'bot' && index === 0 && (
                  <CategoryButtons />
                )}
                
                {/* Show question buttons after category selection */}
                {msg.sender === 'bot' && currentCategory && 
                 msg.text.includes(`Here are the questions about ${currentCategory.name}`) && (
                  <QuestionButtons category={currentCategory} />
                )}
                
                {/* Show category buttons again after answering a question */}
                {msg.sender === 'bot' && index > 0 && 
                 messages[index - 1]?.sender === 'user' && 
                 !msg.text.includes("Here are the questions about") && 
                 msg.text !== "Hi! 👋 I'm your Project Assistant. How can I help you today?\n\nPlease select a category below:" && (
                  <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-blue-600" />
                      <p className="text-xs text-gray-700 font-semibold">Explore More Topics:</p>
                    </div>
                    <CategoryButtons />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 mb-3">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-1.5 h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center shadow-lg">
                  <Bot size={14} className="text-white sm:w-4 sm:h-4" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-md border-2 border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-200 rounded-b-2xl flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 px-3 sm:px-4 py-2.5 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm transition-all duration-300 hover:border-gray-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-2.5 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl flex-shrink-0"
              >
                <Send size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center hidden sm:block font-medium">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;