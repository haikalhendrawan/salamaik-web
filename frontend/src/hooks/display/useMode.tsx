import { useMemo, useState, createContext, useContext } from 'react';

// value dari useMode hook ada di ../theme/index
const ModeContext = createContext({});

const useMode = () => {
    return useContext(ModeContext);
}

export default useMode;
export {ModeContext};