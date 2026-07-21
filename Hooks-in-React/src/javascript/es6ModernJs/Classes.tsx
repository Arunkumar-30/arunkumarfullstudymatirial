import React from "react";

class Animal{
    name:string;
    sound:string;
  constructor(name:string, sound:string){
    this.name = name;
    this.sound = sound;
  }

  speak() {
    return `${this.name} says ${this.sound}!`;
  }

  static describe() {
    return "I am an Animal class";
  }
}

class Dog extends Animal {
  constructor(name:string) {
    super(name, "Woof");
  }

  fetch(item:string):string {
    return `${this.name} fetches the ${item}!`;
  }
}

const Classes = () => {
  const dog = new Animal("Dog", "Woof");
  const rex = new Dog("Rex");

  return (
    <div>
      <h1>JavaScript Classes Example</h1>

      <p>{dog.speak()}</p>

      <p>{Animal.describe()}</p>

      <p>{rex.speak()}</p>

      <p>{rex.fetch("ball")}</p>
    </div>
  );
};

export default Classes;