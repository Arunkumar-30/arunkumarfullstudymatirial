import { useState } from "react";
import Dashboard from "./Dashboard";
import { DashboardContext } from "./context";

export interface User{
    isSubscribed:boolean;
    name:string;
}

interface DemoProps{}

export default function UseContextHook({}:DemoProps){

    const [user] =useState<User>({
        isSubscribed:true,
        name:"John Doe"
    })

    return(
        <div>
            <h1>UseContext Hook Demo</h1>
            <DashboardContext.Provider value={user}>

            <Dashboard />
            </DashboardContext.Provider>
        </div>
    )
}