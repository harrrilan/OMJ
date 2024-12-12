import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Sparkles, MessageSquare, Users, User } from 'lucide-react';

const SidebarLayout = ({ children }) => {
  const navItems = [
    { icon: <MapPin size={24} />, label: 'Today' },
    { icon: <Sparkles size={24} />, label: 'Prompts' },
    { icon: <MessageSquare size={24} />, label: 'Chatbot' },
    { icon: <Users size={24} />, label: 'Friends' },
  ];

  return (
    <div className="flex h-screen">
      <div 
        className="transition-all duration-300 flex flex-col items-center w-64"
        style={{ backgroundColor: '#C19363' }}
      >
        {/* Header - center the title */}
        <div className="p-6 flex flex-col items-center">
          <div className="text-center">
            <h1 className="font-bold text-2xl text-black">OurMinds</h1>
            <h2 className="font-bold text-2xl text-black">Journaling</h2>
          </div>
        </div>

        {/* Navigation - center the items */}
        <nav className="flex-1 py-4 w-full">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={`/${item.label.toLowerCase()}`}
              className="flex items-center justify-center py-3 text-black hover:bg-black/10 space-x-3"
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* User profile - center it */}
        <div className="p-6 border-t border-black/10 w-full">
          <div className="flex items-center justify-center space-x-3">
            <User size={24} className="text-black" />
            <span className="font-medium text-black">UmiPark</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

const Today = () => {
  const [dateEntries, setDateEntries] = useState({
    '12': [{ title: "Prompt 1", content: "" }, { title: "Prompt 2", content: "" }, { title: "Prompt 3", content: "" }],
    '13': [{ title: "Prompt 1", content: "" }, { title: "Prompt 2", content: "" }, { title: "Prompt 3", content: "" }],
    '14': [{ title: "Prompt 1", content: "" }, { title: "Prompt 2", content: "" }, { title: "Prompt 3", content: "" }],
    '15': [{ title: "Prompt 1", content: "" }, { title: "Prompt 2", content: "" }, { title: "Prompt 3", content: "" }],
    '16': [{ title: "Prompt 1", content: "" }, { title: "Prompt 2", content: "" }, { title: "Prompt 3", content: "" }],
    '17': [{ title: "Prompt 1", content: "" }, { title: "Prompt 2", content: "" }, { title: "Prompt 3", content: "" }],
    '18': [{ title: "Prompt 1", content: "" }, { title: "Prompt 2", content: "" }, { title: "Prompt 3", content: "" }],
  });
  
  const [currentDate, setCurrentDate] = useState('15');
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('');
  const [dateDirection, setDateDirection] = useState('');
  const [isDateAnimating, setIsDateAnimating] = useState(false);
  
  const timeoutRef = useRef(null);
  const textareaRef = useRef(null);
  
  const currentEntries = dateEntries[currentDate];
  const isFirstEntry = currentEntryIndex === 0;
  const isLastEntry = currentEntryIndex === currentEntries.length - 1;

  const days = [
    { day: 'Sun', date: '12' },
    { day: 'Mon', date: '13' },
    { day: 'Tue', date: '14' },
    { day: 'Wed', date: '15' },
    { day: 'Thu', date: '16' },
    { day: 'Fri', date: '17' },
    { day: 'Sat', date: '18' },
  ];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleContentChange = (value) => {
    if (value.length > 5000) return;
    
    setDateEntries(prev => ({
      ...prev,
      [currentDate]: prev[currentDate].map((entry, idx) => 
        idx === currentEntryIndex ? { ...entry, content: value } : entry
      )
    }));
  };

  const navigateEntry = (dir) => {
    if (isAnimating || isDateAnimating || 
        (dir === "prev" && isFirstEntry) || 
        (dir === "next" && isLastEntry)) {
      return;
    }
    
    setIsAnimating(true);
    setDirection(dir);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setCurrentEntryIndex((prevIndex) => {
        if (dir === "next") {
          return (prevIndex + 1) % currentEntries.length;
        } else if (dir === "prev") {
          return (prevIndex - 1 + currentEntries.length) % currentEntries.length;
        }
        return prevIndex;
      });
      
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 150);

    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const navigateDate = (date) => {
    if (date === currentDate || isAnimating || isDateAnimating) return;
    
    const currentDateIndex = days.findIndex(d => d.date === currentDate);
    const newDateIndex = days.findIndex(d => d.date === date);
    const dir = newDateIndex > currentDateIndex ? 'next' : 'prev';
    
    setIsDateAnimating(true);
    setDateDirection(dir);
    
    setTimeout(() => {
      setCurrentDate(date);
      setCurrentEntryIndex(0);
    }, 150);

    setTimeout(() => {
      setIsDateAnimating(false);
    }, 300);
  };

  return (
    <SidebarLayout>
      <div className="w-full h-screen flex items-center justify-center" style={{ backgroundColor: '#C19363' }}>
        <div className="w-full max-w-4xl mx-auto px-6 py-8">
          <div className="text-white text-3xl font-bold mb-12">
            Oct, {currentDate}st, 2024
          </div>

          <div className="flex justify-between items-center mb-12 text-white max-w-2xl mx-auto">
            {days.map((dayInfo) => (
              <button
                key={dayInfo.day}
                onClick={() => navigateDate(dayInfo.date)}
                className={`text-center transition-all ${
                  dayInfo.date === currentDate 
                    ? 'bg-black rounded-xl px-4 py-2' 
                    : 'px-4 py-2 hover:bg-black/20 rounded-xl'
                }`}
              >
                <div className="text-lg mb-1">{dayInfo.day}</div>
                <div>{dayInfo.date}</div>
              </button>
            ))}
          </div>

          <div className="overflow-hidden">
            <div className={`
              transition-all duration-300 transform
              ${isDateAnimating && dateDirection === 'next' ? '-translate-x-full opacity-0' : ''}
              ${isDateAnimating && dateDirection === 'prev' ? 'translate-x-full opacity-0' : ''}
              ${!isDateAnimating ? 'translate-x-0 opacity-100' : ''}
            `}>
              <div className="bg-white rounded-3xl p-8 shadow-lg max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <button 
                    onClick={() => navigateEntry("prev")} 
                    className={`p-2 transition-colors ${
                      isFirstEntry 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-blue-500 hover:text-blue-600'
                    }`}
                    disabled={isAnimating || isFirstEntry}
                    aria-label="Previous prompt"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <h2 className="text-2xl font-bold text-gray-800">
                    Today's Prompt
                  </h2>

                  <button 
                    onClick={() => navigateEntry("next")}
                    className={`p-2 transition-colors ${
                      isLastEntry 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-blue-500 hover:text-blue-600'
                    }`}
                    disabled={isAnimating || isLastEntry}
                    aria-label="Next prompt"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                <div className="overflow-hidden">
                  <div className={`
                    space-y-4 transition-all duration-300 transform
                    ${isAnimating && direction === 'next' ? 'translate-x-full opacity-0' : ''}
                    ${isAnimating && direction === 'prev' ? '-translate-x-full opacity-0' : ''}
                    ${!isAnimating ? 'translate-x-0 opacity-100' : ''}
                  `}>
                    <h3 className="text-xl text-center text-gray-600 mb-8">
                      {currentEntries[currentEntryIndex].title}
                    </h3>
                    <textarea
                      ref={textareaRef}
                      value={currentEntries[currentEntryIndex].content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder="Write your response here..."
                      className="w-full h-72 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400"
                      maxLength={5000}
                      aria-label={`Response for ${currentEntries[currentEntryIndex].title}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Today;