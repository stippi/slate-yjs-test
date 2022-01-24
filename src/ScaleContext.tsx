import React from 'react';

const ScaleContext = React.createContext(1.0);

const useScale = () => React.useContext(ScaleContext);

interface ScaleProviderProps {
  scale: number;
  children: any;
}

const ScaleProvider: React.FC<ScaleProviderProps> = ({ scale, children }) => {
  return (
    <ScaleContext.Provider value={scale}>
      {children}
    </ScaleContext.Provider>
  );
};

export { ScaleProvider, useScale };
