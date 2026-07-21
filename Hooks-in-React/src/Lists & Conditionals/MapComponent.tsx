import React from 'react'
import { useState } from 'react';

const MapComponent = () => {
     const [loading] = useState(true);
    const isLoggedIn = true
 const employees = [
    { id: 1, name: "Arun" },
    { id: 2, name: "Kumar" },
    { id: 3, name: "senthil" },
  ];

  return (
    <div>
      {employees.map((emp) => (
        <h3 key={emp.id}>
          {emp.name}
        </h3>
      ))}


        <div>
   {isLoggedIn ? ( <h1>Welcome User</h1> ): (<h1>Please Login</h1>) }

   {loading ? (
        <h2>Loading...</h2>
      ) : (
        <h2>Data Loaded</h2>
      )}
    </div>
    </div>
  );
}

export default MapComponent
