import React, { useState, useRef } from "react";

// 1. Interfaces defined correctly
interface User {
  name: string;
  age: number;
}

interface CITY {
  city: string;
}

const Form: React.FC = () => {
  // 2. State hooks initialized with matching type schemas
  const [user, setUser] = useState<User>({ name: "", age: 0 });
  const [city, setCity] = useState<CITY>({ city: "" });

  // 3. Ref hook initialized for the uncontrolled input example
  const inputRef = useRef<HTMLInputElement>(null);

  // Click handler examples
  const handleClick = () => {
    console.log("Button is Clicked");
  };

  const handleClick1 = (name: string) => {
    console.log(name);
  };

  // Controlled change handler for the User object
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      // Dynamic type conversion: if updating 'age', convert string to number
      [name]: name === "age" ? Number(value) : value,
    });
  };

  // Unified form submit handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stops page reload
    
    console.log("Controlled Data:", { user, city });
    console.log("Uncontrolled Ref Data:", inputRef.current?.value);
  };

  return (
    <div>
      {/* Click Handler Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleClick}>HandleClick</button>
        <button onClick={() => handleClick1("Arun")}>HandleClick (with Args)</button>
      </div>

      {/* Main Form Block */}
      <form onSubmit={handleSubmit}>
        
        {/* Controlled Section: User Info */}
        <div style={{ marginBottom: "15px" }}>
          <h4>User Information (Controlled via useState)</h4>
          <input
            name="name"
            placeholder="Name"
            value={user.name}
            onChange={handleChange}
          />

          <input
            name="age"
            type="number"
            placeholder="Age"
            value={user.age || ""} // Prevents displaying a raw 0 on load
            onChange={handleChange}
          />
          <h3>Live State - Name: {user.name}, Age: {user.age}</h3>
        </div>

        {/* Controlled Section: City */}
        <div style={{ marginBottom: "15px" }}>
          <h4>City Information (Controlled via useState Object)</h4>
          <input
            placeholder="City"
            value={city.city}
            // Correctly passing an object matching the CITY interface
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCity({ city: e.target.value })
            }
          />
        </div>

        {/* Uncontrolled Section: Using Ref */}
        <div style={{ marginBottom: "20px" }}>
          <h4>Extra Input (Uncontrolled via useRef)</h4>
          <input 
            type="text" 
            ref={inputRef} 
            placeholder="Type uncontrolled data..." 
          />
        </div>

        <button type="submit">Submit All Data</button>
      </form>
    </div>
  );
};

export default Form;