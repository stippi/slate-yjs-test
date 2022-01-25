import React, {PropsWithChildren} from 'react';
import {StyleMap} from "./types/CustomSlateTypes";

const StylesContext = React.createContext<StyleMap>({});

const useStyles = () => React.useContext(StylesContext);

type ScaleProviderProps = PropsWithChildren<{
  styles: StyleMap;
}>;

const StylesProvider = ({ styles, children }: ScaleProviderProps) => {
  return (
    <StylesContext.Provider value={styles}>
      {children}
    </StylesContext.Provider>
  );
};

export { StylesProvider, useStyles };
