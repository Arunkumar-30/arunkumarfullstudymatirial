import React, { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
}

const SessionStorage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData: User = {
      name: "Arjun",
      email: "arjun@gmail.com",
    };

    sessionStorage.setItem("user", JSON.stringify(userData));

    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log(
        'storedUser',storedUser
      )
       console.log(
        'user',JSON.parse(storedUser)
      )
    }

    console.log("Total Keys:", sessionStorage.length);
  }, []);

  return (
    <div>
      <h1>Session Storage Example</h1>

      {user && (
        <>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </>
      )}
    </div>
  );
};

export default SessionStorage;