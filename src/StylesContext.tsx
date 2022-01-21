import React from 'react';
import {StyleMap} from "./types/CustomSlateTypes";

const StylesContext = React.createContext<StyleMap>({});

const useStyles = () => React.useContext(StylesContext);

interface StylesProviderProps {
  styles: StyleMap;
  children: any;
}

const StylesProvider: React.FC<StylesProviderProps> = ({ styles, children }) => {
  return (
    <StylesContext.Provider value={styles}>
      {children}
    </StylesContext.Provider>
  );
};

export { StylesProvider, useStyles };
