import { useCallback, useState } from "react";


import Search from "./Search";

const allUsers =[
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Frank",
]

interface UserListProps{}

export default function UseCallBackHook({}:UserListProps){
    const [users, setUsers] = useState(allUsers);

    const handleSearch = useCallback((text:string) => {
        console.log(users[0]);
        const filteredUsers = allUsers.filter((user) =>
        user.toLowerCase().includes(text.toLowerCase())
        );
        setUsers(filteredUsers);
    },[users]);

    const handleShuffle = () => {
        setUsers(shuffle([...users]));
    }

    return(
        <div>
            <button onClick={handleShuffle}>Shuffle</button>
            <Search onChange={handleSearch}/>
            <ul>
                {users.map((user) => (
                    <li key={user}>{user}</li>
                ))}
            </ul>
        </div>
    )

}

function shuffle(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

