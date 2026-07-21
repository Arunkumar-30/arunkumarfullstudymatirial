import React, { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
}

const TemplateLiterals: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData: User = {
      name: "Arjun",
      email: "arjun@gmail.com",
    };

    setUser(userData)
    
    const data = `Name : ${userData.name} , Email : ${userData.email}`
    console.log(data)
   
  }, []);

  return (
    <div>
      <h1>Template Literals Example</h1>

      {user && (
        <>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </>
      )}
    </div>
  );
};

export default TemplateLiterals;