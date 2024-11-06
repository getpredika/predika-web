import React, { useState } from 'react';

export const Tabs = ({ children, defaultValue, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  // Handle the active tab state if no external state is passed
  const contextValue = {
    activeTab,
    setActiveTab,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { activeTab, setActiveTab })
        )}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className }) => (
  <div className={`grid grid-cols-2 border border-lightGray rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

export const TabsTrigger = ({ children, value, className }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 ${activeTab === value ? 'border-b-2 border-blue-500' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, value, className }) => {
  const { activeTab } = React.useContext(TabsContext);
  return activeTab === value ? <div className={className}>{children}</div> : null;
};

// Create a context for tabs
const TabsContext = React.createContext();

export default Tabs;
