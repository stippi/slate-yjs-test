import React, {PropsWithChildren} from 'react';
import {Paper} from "./types/CustomSlateTypes";

const PaperContext = React.createContext<Paper | null>(null);

const usePaper = () => React.useContext(PaperContext);

type PaperProviderProps = PropsWithChildren<{
  paper: Paper;
}>;

const PaperProvider = ({ paper, children }: PaperProviderProps) => {
  return (
    <PaperContext.Provider value={paper}>
      {children}
    </PaperContext.Provider>
  );
};

export { PaperProvider, usePaper };
