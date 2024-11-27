import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send,
  RefreshCw,
  AlertCircle,
  Brain,
  Loader,
  Sun,
  Moon,
  Database
} from 'lucide-react';
import xeroLogo from '../../assets/xero.png';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SamplePrompt {
  text: string;
  category: 'inventory' | 'analytics' | 'pricing';
}

const samplePrompts: SamplePrompt[] = [
  { text: "What items are expiring soon?", category: 'inventory' },
  { text: "Show me current buying patterns", category: 'analytics' },
  { text: "Suggest optimal prices for expiring items", category: 'pricing' },
  { text: "Which products have the highest turnover?", category: 'analytics' },
  { text: "What's my current inventory value?", category: 'inventory' },
  { text: "Identify items with low stock", category: 'inventory' },
];

const getAIResponse = (prompt: string): string => {
  // Sample responses based on prompt patterns
  if (prompt.toLowerCase().includes('expiring')) {
    return "Based on your inventory data, you have:\n\n" +
           "🔸 5 units of Organic Milk expiring in 3 days\n" +
           "🔸 12 units of Fresh Bread expiring tomorrow\n" +
           "🔸 8 units of Yogurt expiring in 5 days\n\n" +
           "Would you like me to suggest optimal discount prices for these items?";
  }
  
  if (prompt.toLowerCase().includes('buying patterns')) {
    return "Analyzing recent customer behavior:\n\n" +
           "📈 Peak shopping hours: 2PM - 6PM\n" +
           "🔄 Most frequent purchases: Dairy products (32%)\n" +
           "⭐ Popular combinations: Bread + Milk, Coffee + Pastries\n" +
           "📊 Weekly sales trend: +15% compared to last week";
  }
  
  if (prompt.toLowerCase().includes('optimal prices')) {
    return "Based on current market data and expiry dates, here are my suggestions:\n\n" +
           "• Organic Milk: 40% discount (Current: $4.99 → Suggested: $2.99)\n" +
           "• Fresh Bread: 50% discount (Current: $3.99 → Suggested: $1.99)\n" +
           "• Yogurt: 25% discount (Current: $3.49 → Suggested: $2.62)\n\n" +
           "These suggestions aim to maximize sales while minimizing waste.";
  }

  return "I apologize, but I'm currently limited in my ability to provide accurate information about that topic. I can help you with:\n\n" +
         "• Inventory expiry tracking\n" +
         "• Customer buying patterns\n" +
         "• Price optimization suggestions\n" +
         "• Stock level monitoring";
};

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Theme-related classes
  const theme = {
    bg: isDark ? 'bg-gray-900' : 'bg-white',
    text: isDark ? 'text-white' : 'text-[#2D2654]',
    secondaryText: isDark ? 'text-gray-300' : 'text-gray-600',
    border: isDark ? 'border-gray-700' : 'border-gray-100',
    messageBg: isDark ? 'bg-gray-800' : 'bg-gray-50',
    inputBg: isDark ? 'bg-gray-800' : 'bg-white',
    inputBorder: isDark ? 'border-gray-700' : 'border-gray-200',
    buttonHover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea as content grows
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'inherit';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    // Optional: Automatically submit the prompt
    handleSubmit(new Event('submit') as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: getAIResponse(userMessage.content),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSyncInventory = async () => {
    setIsSyncing(true);
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      const syncMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "✅ Inventory data has been successfully synchronized. I'm now up to date with your latest inventory information.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, syncMessage]);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="text-[#666ED2]" />
          <h1 className={`text-xl font-syne ${theme.text}`}>AI Assistant</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Sync Button */}
          <button 
            onClick={handleSyncInventory}
            disabled={isSyncing}
            className={`px-3 py-1.5 text-sm ${theme.text} ${theme.buttonHover} rounded-lg flex items-center gap-2 ${
              isSyncing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Database size={16} className={isSyncing ? 'animate-pulse' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Inventory'}
          </button>

          {/* Clear Chat Button */}
          <button 
            onClick={() => setMessages([])}
            className={`px-3 py-1.5 text-sm ${theme.text} ${theme.buttonHover} rounded-lg flex items-center gap-2`}
          >
            <RefreshCw size={16} />
            Clear chat
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg ${theme.buttonHover} ${theme.text}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className={`${theme.bg} ${theme.border} rounded-2xl border h-full flex flex-col`}>
        {/* Messages Area */}
        <div className={`flex-1 overflow-y-auto p-6`}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <img 
                src={xeroLogo} 
                alt="XERO AI" 
                className="w-24 h-24 object-contain mb-6"
              />
              <h2 className={`text-xl font-syne ${theme.text} mb-4`}>
                Welcome to XERO AI Assistant
              </h2>
              <p className={`${theme.secondaryText} max-w-md mb-8`}>
                Ask me anything about inventory management, price optimization, or business analytics.
              </p>
              
              {/* Sample Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {samplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt.text)}
                    className={`p-3 text-left rounded-lg border ${theme.border} 
                      ${theme.buttonHover} transition-colors duration-200
                      ${isDark ? 'hover:border-gray-600' : 'hover:border-[#666ED2]'}`}
                  >
                    <span className={`text-sm ${theme.text}`}>{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 mb-6 ${
                  message.role === 'assistant' ? theme.messageBg : ''
                } rounded-xl p-4`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'assistant' 
                    ? 'bg-[#666ED2]/10 overflow-hidden' 
                    : isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  {message.role === 'assistant' ? (
                    <img 
                      src={xeroLogo} 
                      alt="XERO AI" 
                      className="w-7 h-7 object-contain"
                    />
                  ) : 'XF'}
                </div>
                <div className="flex-1">
                  <div className={`font-syne ${theme.text} mb-1`}>
                    {message.role === 'assistant' ? 'XERO AI' : 'You'}
                  </div>
                  <div className={`${theme.secondaryText} whitespace-pre-line`}>
                    {message.content}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 mb-6 ${theme.messageBg} rounded-xl p-4`}
            >
              <div className="w-8 h-8 rounded-full bg-[#666ED2]/10 overflow-hidden flex items-center justify-center">
                <img 
                  src={xeroLogo} 
                  alt="XERO AI" 
                  className="w-5 h-5 object-contain animate-pulse"
                />
              </div>
              <div className="flex-1">
                <div className={`font-syne ${theme.text} mb-1`}>XERO AI</div>
                <div className={theme.secondaryText}>Thinking...</div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`border-t ${theme.border} p-4`}>
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask anything about inventory, pricing, or business analytics..."
              className={`w-full pr-24 py-3 px-4 rounded-xl ${theme.inputBg} ${theme.inputBorder} border focus:border-[#666ED2] focus:ring-0 resize-none max-h-32 ${theme.text}`}
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg flex items-center gap-2 ${
                !input.trim() || isLoading
                  ? `${isDark ? 'bg-gray-700' : 'bg-gray-100'} text-gray-400 cursor-not-allowed`
                  : 'bg-[#666ED2] text-white hover:bg-[#666ED2]/90'
              }`}
            >
              <Send size={16} />
              Send
            </button>
          </form>
          <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
            <AlertCircle size={12} />
            Press Enter to send, Shift + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}; 