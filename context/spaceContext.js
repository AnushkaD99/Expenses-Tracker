import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
const SpaceContext = createContext();

// Create a provider component
export const SpaceProvider = ({ children }) => {
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);

  useEffect(() => {
    // Fetch the stored space ID from local storage when the component mounts
    const fetchStoredSpaceId = async () => {
      try {
        const storedSpaceId = await AsyncStorage.getItem('selectedSpaceId');
        if (storedSpaceId !== null) {
          setSelectedSpaceId(storedSpaceId);
        }
      } catch (error) {
        console.error('Failed to fetch the space ID from storage', error);
      }
    };

    fetchStoredSpaceId();
  }, []);

  const handleSetSelectedSpaceId = async (spaceId) => {
    try {
      await AsyncStorage.setItem('selectedSpaceId', spaceId);
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
