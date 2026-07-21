import { Profile, Sidebar } from "./DemoComponents.tsx";


interface DashboardProps {}

export default function Dashboard({}:DashboardProps){
    return(
        <div>
            <Sidebar />
            <Profile />
        </div>
    )
}