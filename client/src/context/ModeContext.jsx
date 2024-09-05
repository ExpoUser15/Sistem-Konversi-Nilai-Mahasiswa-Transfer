import { createContext, useState, useEffect} from "react";

const ModeContext = createContext();

function ModeProvider({children}){
    const [theme, setTheme] = useState("");

    useEffect(() => {
        if(localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <ModeContext.Provider value={{ theme, setTheme }}>
            { children }
        </ModeContext.Provider>
    )
}

export { ModeContext, ModeProvider };