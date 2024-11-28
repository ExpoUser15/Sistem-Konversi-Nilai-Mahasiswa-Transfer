import { createContext, useEffect, useState } from "react";

const MobileSidebarContext = createContext();

function MobileSidebarProvider({children}){
    const [expanded, setExpanded] = useState(true);

    return (
        <MobileSidebarContext.Provider value={{ expanded, setExpanded }}>
            { children }
        </MobileSidebarContext.Provider>
    )
}

export { MobileSidebarContext, MobileSidebarProvider };