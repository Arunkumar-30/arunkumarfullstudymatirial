

export const PI = 3.14159

export function add(a:number,b:number){
    return a+b;
}

export function multiply(a:number,b:number){
    return a*b
}

// user.js — one default export
export default function greet(name:string) {
  return `Hello, ${name}!`;
}