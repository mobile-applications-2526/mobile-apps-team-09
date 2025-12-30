import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PlantNavigationContextType {
  selectedPlantId: number | null;
  setSelectedPlantId: (id: number | null) => void;
}

const PlantNavigationContext = createContext<PlantNavigationContextType | undefined>(undefined);

export const PlantNavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);

  return (
    <PlantNavigationContext.Provider value={{ selectedPlantId, setSelectedPlantId }}>
      {children}
    </PlantNavigationContext.Provider>
  );
};

export const usePlantNavigation = () => {
  const context = useContext(PlantNavigationContext);
  if (context === undefined) {
    throw new Error('usePlantNavigation must be used within a PlantNavigationProvider');
  }
  return context;
};
