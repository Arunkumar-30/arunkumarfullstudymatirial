import { useState, useEffect } from "react";

// 1. Define the shape of a single User object from your API
interface User {
  id: number | string;
  name: string;
}

function DataFechingUseEffect() {
  // // 2. Tell useState that this array will hold User objects
  const [users, setUsers] = useState<User[]>([]);
  // // 3. Explicitly type error state to accept a string or null
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   fetch("https://jsonplaceholder.typicode.com/users")
  //     .then(res => {
  //       if (!res.ok) throw new Error("Network error");
  //       return res.json();
  //     })
  //     .then(data => {
  //       // data must match the User[] shape
  //       setUsers(data);
  //       setLoading(false);
  //     })
  //     .catch(err => {
  //       setError(err.message);
  //       setLoading(false);
  //     });
  // }, []); 

  // if (loading) return <p>Loading...</p>;
  // if (error)   return <p>Error: {error}</p>;


  useEffect(() => {
  let cancelled = false; // cleanup flag

  async function fetchData() {
    try {
      const res  = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await res.json();
      if (!cancelled) setUsers(data); // only set if still mounted
    } catch (e:any) {
      if (!cancelled) setError(e.message);
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  fetchData();
  return () => { cancelled = true; }; // cleanup on unmount
}, []);
 if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;
  // TypeScript is happy now because it knows 'u' is a 'User' object with an 'id' and 'name'
  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}

export default DataFechingUseEffect;