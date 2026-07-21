import { createContext, useContext } from "react";

import type { User } from "./index";

export const DashboardContext = createContext<User | undefined>(undefined);

export function useUserContext(){
    const user = useContext(DashboardContext)

    if(user === undefined){
        throw new Error("useUserContext must be used within a DashboardContext.Provider")
    }

    return user;
}