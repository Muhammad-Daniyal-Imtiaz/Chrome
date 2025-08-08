'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, RefreshCw, Lock, Star, Menu, 
  Plus, X, Minus, Square, Search, Mic, 
  MessageSquare, Google, Grid3x3 
} from 'lucide-react';

export default function ChromeWindow() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([
    { id: 0, title: "Google", type: "google" },
    { id: 1, title: "New Chat", type: "chat" }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [direction, setDirection] = useState(null); // 'left' or 'right' for animation
  const prevActiveTabRef = useRef(activeTab);
  const contentRef = useRef(null);

  const handleTabClick = (tabId) => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const newIndex = tabs.findIndex(tab => tab.id === tabId);
    
    setDirection(newIndex > currentIndex ? 'left' : 'right');
    setActiveTab(tabId);
  };

  const addNewTab = (type = "google") => {
    const newId = tabs.length > 0 ? Math.max(...tabs.map(tab => tab.id)) + 1 : 0;
    const title = type === "chat" ? "New Chat" : "Google";
    setTabs([...tabs, { id: newId, title, type }]);
    setDirection('right'); // Animate from right when adding new tab
    setActiveTab(newId);
  };

  const closeTab = (tabId, e) => {
    e.stopPropagation();
    if (tabs.length <= 1) return;
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTab === tabId) {
      const newActiveTab = newTabs[newTabs.length - 1].id;
      setDirection('left'); // Animate from left when closing tab
      setActiveTab(newActiveTab);
    }
  };

  useEffect(() => {
    // Handle keyboard shortcuts
    const handleKeyDown = (e) => {
      // Ctrl+Tab: Next tab
      if (e.ctrlKey && !e.shiftKey && e.key === "Tab") {
        e.preventDefault();
        setActiveTab(prev => {
          const idx = tabs.findIndex(tab => tab.id === prev);
          const nextIdx = (idx + 1) % tabs.length;
          setDirection('left');
          return tabs[nextIdx].id;
        });
      }
      // Ctrl+Shift+Tab: Previous tab
      if (e.ctrlKey && e.shiftKey && e.key === "Tab") {
        e.preventDefault();
        setActiveTab(prev => {
          const idx = tabs.findIndex(tab => tab.id === prev);
          const prevIdx = (idx - 1 + tabs.length) % tabs.length;
          setDirection('right');
          return tabs[prevIdx].id;
        });
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tabs]);

  useEffect(() => {
    // Reset animation direction after transition completes
    if (contentRef.current) {
      const handleAnimationEnd = () => setDirection(null);
      contentRef.current.addEventListener('animationend', handleAnimationEnd);
      return () => {
        if (contentRef.current) {
          contentRef.current.removeEventListener('animationend', handleAnimationEnd);
        }
      };
    }
  }, [activeTab]);

  const renderTabContent = (tab) => {
    if (!tab) return null;
    
    switch (tab.type) {
      case "google":
        return (
          <div className="flex flex-col items-center justify-center w-full h-full p-8">
            <div className="mb-12">
              {/* Google SVG logo */}
              <svg width="92" height="92" viewBox="0 0 48 48" className="mx-auto mb-4">
                <g>
                  <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6-6C36.1 5.1 30.3 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"/>
                  <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c2.7 0 5.2.9 7.2 2.4l6-6C36.1 5.1 30.3 3 24 3c-7.2 0-13.4 3.1-17.7 8z"/>
                  <path fill="#FBBC05" d="M24 43c5.3 0 10.1-1.8 13.8-4.9l-6.4-5.2c-2 1.4-4.5 2.1-7.4 2.1-5.6 0-10.3-3.8-12-8.9l-6.6 5.1C7.9 39.2 15.3 43 24 43z"/>
                  <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-0.7 2-2.1 3.8-4.1 5l6.4 5.2C40.9 39.2 44 32.8 44 24c0-1.3-.1-2.7-.4-3.5z"/>
                </g>
              </svg>
              <h1 className="text-7xl font-normal mb-8">
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
              </h1>
            </div>
            <div className="google-search">
              <Search className="text-gray-500" size={20} />
              <input 
                className="google-search-input" 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Google or type a URL"
              />
              <Mic className="text-gray-500" size={20} />
            </div>
            <div className="mt-8 flex gap-4">
              <button className="px-4 py-2 bg-gray-100 rounded text-sm hover:shadow">
                Google Search
              </button>
              <button className="px-4 py-2 bg-gray-100 rounded text-sm hover:shadow">
                I'm Feeling Lucky
              </button>
            </div>
          </div>
        );
      case "chat":
        return (
          <div className="w-full h-full p-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="text-blue-500" size={24} />
                <h2 className="text-2xl font-medium">New Chat</h2>
              </div>
              <button 
                className="new-chat-button"
                onClick={() => addNewTab("chat")}
              >
                <Plus size={18} />
                <span>Start New Chat</span>
              </button>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-medium mb-2">Example Question {item}</h3>
                    <p className="text-sm text-gray-600">Sample response to question {item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <h1 className="text-7xl font-normal mb-8">New Tab</h1>
            <p className="text-lg">Type a URL or search term</p>
          </div>
        );
    }
  };

  const getTabIcon = (tab) => {
    switch (tab.type) {
      case "google":
        return (
          <span style={{fontWeight: 'bold', color: '#4285F4', fontSize: 16, fontFamily: 'Arial'}}>G</span>
        );
      case "chat":
        return <MessageSquare size={16} className="text-blue-500" />;
      default:
        return <Grid3x3 size={16} className="text-gray-500" />;
    }
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="chrome-window w-full h-full min-h-screen flex flex-col bg-white">
      {/* Window Title Bar */}
      <div className="window-title-bar flex items-center justify-between px-2 py-1 bg-gray-100">
        <div className="window-title text-base sm:text-lg">Chrome</div>
        <div className="window-controls flex gap-1">
          <div className="window-control minimize">
            <Minus size={14} />
          </div>
          <div className="window-control maximize">
            <Square size={12} />
          </div>
          <div className="window-control close">
            <X size={14} />
          </div>
        </div>
      </div>

      {/* Chrome Top Bar */}
      <div className="chrome-top-bar flex flex-col sm:flex-row items-stretch sm:items-center px-2 py-1 bg-gray-50 gap-2">
        {/* Navigation Icons */}
        <div className="flex items-center gap-1">
          <div className="chrome-icon" title="Back">
            <ArrowLeft size={18} />
          </div>
          <div className="chrome-icon" title="Forward">
            <ArrowRight size={18} />
          </div>
          <div className="chrome-icon" title="Refresh">
            <RefreshCw size={16} />
          </div>
        </div>
        
        <div className="toolbar-divider hidden sm:block"></div>

        {/* Tabs */}
        <div className="chrome-tabs flex-1 flex items-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 gap-1">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`chrome-tab flex items-center px-2 py-1 rounded cursor-pointer whitespace-nowrap ${activeTab === tab.id ? 'active bg-white shadow' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => handleTabClick(tab.id)}
              style={{ minWidth: 0, maxWidth: 200 }}
            >
              <div className="tab-favicon mr-1 flex-shrink-0">
                {getTabIcon(tab)}
              </div>
              <span className="tab-title text-xs sm:text-sm truncate">{tab.title}</span>
              <span 
                className="tab-close ml-1 flex-shrink-0" 
                onClick={(e) => closeTab(tab.id, e)}
              >
                <X size={14} />
              </span>
            </div>
          ))}
          <div 
            className="chrome-icon ml-2 flex-shrink-0" 
            onClick={() => addNewTab()}
            title="New tab"
          >
            <Plus size={18} />
          </div>
        </div>

        {/* Address Bar */}
        <div className="chrome-address-bar flex items-center bg-gray-100 rounded px-2 py-1 mx-0 sm:mx-2 flex-1 min-w-0 mt-2 sm:mt-0">
          <Lock size={14} className="text-gray-500 mr-2" />
          <span className="truncate text-xs sm:text-sm">{activeTabData?.type === "google" ? "google.com" : "chat.new"}</span>
        </div>

        <div className="toolbar-divider hidden sm:block"></div>

        {/* Right Icons */}
        <div className="flex items-center gap-1">
          <div className="chrome-icon" title="Extensions">
            <Grid3x3 size={16} />
          </div>
          <div className="chrome-icon" title="Menu">
            <Menu size={16} />
          </div>
        </div>
      </div>

      {/* Content Area with Animation */}
      <div 
        ref={contentRef}
        className={`chrome-content flex-1 overflow-auto ${
          direction === 'left' ? 'slide-in-left' : 
          direction === 'right' ? 'slide-in-right' : ''
        }`}
      >
        {activeTabData && renderTabContent(activeTabData)}
      </div>
    </div>
  );
}