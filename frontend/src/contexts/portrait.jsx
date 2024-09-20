import { createContext, useState, useEffect } from "react";

export const PortraitContext = createContext();

export const PortraitProvider = ({ children }) => {
    const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

    const updateOrientation = () => {
        setIsPortrait(window.innerHeight > window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', updateOrientation);
        return () => {
            window.removeEventListener('resize', updateOrientation);
        };
    }, []);

        return (
            <PortraitContext.Provider value={{ isPortrait }}>
                {children}
            </PortraitContext.Provider>
        )
    }