import { useUserContext } from "./context"


interface SidebarProps {}

export function Sidebar({}:SidebarProps){
    const user = useUserContext()
    return(
        <div>
            <h2>Sidebar</h2>
            <p>Name: {user.name}</p>
            <p>Subscribed: {user.isSubscribed ? "Yes" : "No"}</p>
        </div>
    )
}

interface ProfileProps {}

export function Profile({}:ProfileProps){
    const user = useUserContext()
    return(
        <div>
            <h2>Profile</h2>
            <p>Name: {user.name}</p>
            
        </div>
    )
}