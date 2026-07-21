import React, { useEffect } from "react";

interface User {
  name: string;
  address?: {
    city: string;
    zip?: number;
  };
  phone?: {
    number: number;
  };
  map?:{
    string:string
  }
}

const OptionalChaining: React.FC = () => {
  useEffect(() => {
    const user: User = {
      name: "Kavya",
      address: {
        city: "Coimbatore",
      },
    };

    console.log(user?.address?.city);
    console.log(user?.address?.zip);
    console.log(user?.phone?.number);

    const arr: string[] | null = null;

    console.log(arr?.[0]);
    // console.log(arr?.map((item:any) => item));
  }, []);

  return (
    <div>
      <h1>Optional Chaining Example</h1>
    </div>
  );
};

export default OptionalChaining;