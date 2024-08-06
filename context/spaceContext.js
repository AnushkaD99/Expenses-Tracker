import React, { createContext, useState, useContext } from 'react';

// Create the context
const SpaceContext = createContext();

// Create a provider component
export const SpaceProvider = ({ children }) => {
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);

  const handleSetSelectedSpaceId = async (spaceId) => {
    try {
      setSelectedSpaceId(spaceId);
    } catch (error) {
      console.error('Failed to save the space ID to storage', error);
    }
  };

  return (
    <SpaceContext.Provider value={{ selectedSpaceId, setSelectedSpaceId: handleSetSelectedSpaceId }}>
      {children}
    </SpaceContext.Provider>
  );
};

// Custom hook to use the SpaceContext
export const useSpace = () => useContext(SpaceContext);
