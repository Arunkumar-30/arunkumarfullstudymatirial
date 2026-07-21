import React, { useEffect, useState } from "react";

const CookiesExample = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    document.cookie = "username=Arjun; path=/";

    const cookies = document.cookie;

    const userCookie = cookies
      .split("; ")
      .find((row) => row.startsWith("username="));

    if (userCookie) {
      const value = userCookie.split("=")[1];
      setUsername(value);
    }
  }, []);

  return (
    <div>
      <h1>Cookies Example</h1>
      <p>Username: {username}</p>
    </div>
  );
};

export default CookiesExample;