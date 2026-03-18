'use client'

import React, { createContext, useContext, useState } from "react";

type ContextType = {
    hidden: boolean;
    toggleDrawer: () => void;
};

const Context = createContext<ContextType | undefined>(undefined);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
    const [hidden, setHidden] = useState(true);

    const toggleDrawer = () => {
        setHidden((previous) => !previous);
    };

    return (
        <Context.Provider value={{ hidden, toggleDrawer }}>
            {children}
        </Context.Provider>
    );
};

export const useDrawer = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error('useDrawer must be used within a DrawerProvider');
    };
    return context;
};