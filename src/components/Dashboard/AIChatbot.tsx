import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface AIChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  userName?: string;
}

export function AIChatbot({ isOpen, onToggle, userName }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi ${userName || 'there'}! I'm your AI fitness coach. I can help you with workout plans, nutrition advice, motivation, and answer any fitness-related questions. How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Workout-related responses
    if (message.includes('workout') || message.includes('exercise')) {
      if (message.includes('beginner')) {
        return "For beginners, I recommend starting with 3-4 days of training per week. Focus on compound exercises like squats, push-ups, and planks. Start with 2-3 sets of 8-12 reps. Would you like me to create a beginner workout plan for you?";
      }
      if (message.includes('weight loss')) {
        return "For weight loss, combine cardio (30 mins, 3-5x/week) with strength training (2-3x/week). Focus on progressive overload and maintain a calorie deficit. Track your water intake and aim for 8 glasses daily. Consistency is key!";
      }
      if (message.includes('muscle gain') || message.includes('bulk')) {
        return "For muscle gain, prioritize protein intake (1.6-2.2g per kg body weight), progressive overload, and adequate rest. Train each muscle group 2-3x/week with 3-4 sets of 6-12 reps. Don't forget compound movements!";
      }
      return "I can help you create personalized workout plans! What are your fitness goals? (weight loss, muscle gain, general fitness, etc.)";
    }

    // Nutrition-related responses
    if (message.includes('diet') || message.includes('nutrition') || message.includes('food')) {
      if (message.includes('protein')) {
        return "Great sources of protein include: chicken breast (31g/100g), Greek yogurt (10g/100g), eggs (6g each), lentils (9g/100g cooked), and quinoa (4g/100g cooked). Aim for 1.6-2.2g of protein per kg of body weight daily.";
      }
      if (message.includes('calories') || message.includes('calorie')) {
        return "To calculate your daily calorie needs: For weight loss, subtract 500 calories from maintenance. For weight gain, add 300-500 calories. Use an online TDEE calculator for your specific needs. Track your intake consistently!";
      }
      return "Nutrition is 80% of fitness success! Focus on whole foods, adequate protein, healthy fats, and complex carbs. Track your water intake and consider meal prepping. What specific nutrition advice are you looking for?";
    }

    // Water intake responses
    if (message.includes('water') || message.includes('hydration')) {
      return "Proper hydration is crucial! Aim for at least 8 glasses (2 liters) daily, more if you're active. Signs of dehydration include fatigue, headaches, and dark urine. Track your intake in the app and set reminders!";
    }

    // Step tracking responses
    if (message.includes('steps') || message.includes('walking')) {
      return "The recommended daily step count is 10,000 steps. Start where you are and gradually increase. Take the stairs, walk during breaks, and consider a pedometer. Every step counts toward better health!";
    }

    // Motivation and general responses
    if (message.includes('motivation') || message.includes('motivate')) {
      const motivations = [
        "Remember: Every expert was once a beginner. Your only competition is yourself from yesterday!",
        "Consistency beats perfection every time. Small daily actions lead to big results.",
        "Your body can do it. It's your mind you have to convince. Stay strong!",
        "Progress takes time. Celebrate small victories along the way!",
        "You're capable of amazing things. Believe in yourself and keep pushing forward!",
      ];
      return motivations[Math.floor(Math.random() * motivations.length)];
    }

    if (message.includes('help') || message.includes('what can you do')) {
      return "I can help with: 💪 Workout plans and exercise guidance 📊 Nutrition and diet advice 💧 Hydration tracking 🚶 Step goals and activity tips 🎯 Goal setting and motivation 📈 Progress tracking and tips. What would you like to know more about?";
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! I'm here whenever you need fitness advice, motivation, or guidance. Keep up the great work! 💪";
    }

    // Default responses
    const defaultResponses = [
      "That's interesting! Can you tell me more about your fitness goals so I can give you better advice?",
      "I want to help you reach your fitness goals! What specific area would you like guidance on?",
      "Great question! I'm here to support your fitness journey. What else can I help you with today?",
      "I'm your AI fitness coach, ready to help! Whether it's workouts, nutrition, or motivation, I'm here for you.",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 second delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggle}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Open AI Chatbot"
        >
          <Bot className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span className="font-semibold">AI Fitness Coach</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggle}
              className="hover:bg-blue-700 p-1 rounded transition-colors"
              aria-label="Minimize chatbot"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              onClick={onToggle}
              className="hover:bg-blue-700 p-1 rounded transition-colors"
              aria-label="Close chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender === 'bot' ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="text-xs opacity-75">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about workouts, nutrition, or motivation..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • Type your fitness questions here
          </p>
        </div>
      </div>
    </div>
  );
}
