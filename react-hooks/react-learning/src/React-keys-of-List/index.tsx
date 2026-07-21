import { useState } from "react";

import { users as defaultUsers } from "./utils";

export default function KeyOfList() {
    const [users, setUsers] = useState(defaultUsers);

    const handleRemove = (id: number) => {
        const newUsers = users.filter((user) => user.id !== id);
        setUsers(newUsers);
    }

    return (
        <>
            <h1>KeyOfList</h1>

            {users.map((user) => (

                <button key={user.id} onClick={() => handleRemove(user.id)}>{user.name}</button>

            ))}

        </>
    )
}