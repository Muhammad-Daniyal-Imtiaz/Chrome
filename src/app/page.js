'use client';

import { useState } from 'react';

export default function ChromeWindow() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([
    { id: 0, title: "Google", favicon: "G", type: "google" },
    { id: 1, title: "New Chat", favicon: "💬", type: "chat" }
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const addNewTab = (type = "google") => {
    const newId = tabs.length > 0 ? Math.max(...tabs.map(tab => tab.id)) + 1 : 0;
    const title = type === "chat" ? "New Chat" : "Google";
    const favicon = type === "chat" ? "💬" : "G";
    setTabs([...tabs, { id: newId, title, favicon, type }]);
    setActiveTab(newId);
  };

  const closeTab = (tabId, e) => {
    e.stopPropagation();
    if (tabs.length <= 1) return;
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTab === tabId) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  const renderTabContent = (tab) => {
    switch (tab.type) {
      case "google":
        return (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <h1 style={{ fontSize: '72px', fontWeight: 'normal', marginBottom: '20px' }}>Google</h1>
            <div className="google-search">
              <span className="google-search-icon">🔍</span>
              <input 
                className="google-search-input" 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Google or type a URL"
              />
              <span className="google-search-icon">🎤</span>
            </div>
          </div>
        );
      case "chat":
        return (
          <div style={{ width: '100%', padding: '20px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>New Chat</h2>
            <button 
              className="new-chat-button"
              onClick={() => addNewTab("chat")}
            >
              <span className="new-chat-icon">+</span>
              <span>Start New Chat</span>
            </button>
          </div>
        );
      default:
        return (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '72px', fontWeight: 'normal', marginBottom: '20px' }}>New Tab</h1>
            <p>Type a URL or search term</p>
          </div>
        );
    }
  };

  return (
    <div className="chrome-window">
      {/* Window Title Bar */}
      <div className="window-title-bar">
        <div className="window-title">Chrome</div>
        <div className="window-controls">
          <div className="window-control minimize">−</div>
          <div className="window-control maximize">□</div>
          <div className="window-control close">×</div>
        </div>
      </div>

      {/* Chrome Top Bar */}
      <div className="chrome-top-bar">
        {/* Navigation Icons */}
        <div className="chrome-icon" title="Back">←</div>
        <div className="chrome-icon" title="Forward">→</div>
        <div className="chrome-icon" title="Refresh">⟳</div>
        
        <div className="toolbar-divider"></div>

        {/* Tabs */}
        <div className="chrome-tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`chrome-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <span className="tab-favicon">{tab.favicon}</span>
              <span className="tab-title">{tab.title}</span>
              <span 
                className="tab-close" 
                onClick={(e) => closeTab(tab.id, e)}
              >
                ×
              </span>
            </div>
          ))}
          <div 
            className="chrome-icon" 
            onClick={() => addNewTab()}
            style={{ marginLeft: '8px' }}
            title="New tab"
          >
            +
          </div>
        </div>

        {/* Address Bar */}
        <div className="chrome-address-bar">
          {tabs[activeTab]?.type === "google" ? "google.com" : "chat.new"}
        </div>

        <div className="toolbar-divider"></div>

        {/* Right Icons */}
        <div className="chrome-icon" title="Extensions">🧩</div>
        <div className="chrome-icon" title="Menu">⋮</div>
      </div>

      {/* Content Area */}
      <div className="chrome-content">
        {tabs[activeTab] && renderTabContent(tabs[activeTab])}
      </div>
    </div>
  );
}