'use client'

import React, { createContext, useCallback, useContext, useState } from "react";

type ContextType = {
    hidden: boolean;
    toggleDrawer: () => void;
    mobileOpen: boolean;
    openMobile: () => void;
    closeMobile: () => void;
};

const Context = createContext<ContextType | undefined>(undefined);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
    const [hidden, setHidden] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleDrawer = useCallback(() => {
        setHidden((previous) => !previous);
    }, []);

    const openMobile = useCallback(() => setMobileOpen(true), []);
    const closeMobile = useCallback(() => setMobileOpen(false), []);

    return (
        <Context.Provider value={{ hidden, toggleDrawer, mobileOpen, openMobile, closeMobile }}>
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