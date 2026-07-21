# JavaScript Complete Reference

A full syntax + examples guide covering Strings, Arrays, Objects, Map/Filter/Reduce and friends, Callbacks, Promises, Async/Await, Modules, Classes, and Collections.

---

## 1. Strings

Strings are immutable — every "modifying" method returns a **new** string.

```javascript
let str = "Hello, World!";

// Length
str.length;                        // 13

// Case conversion
str.toUpperCase();                 // "HELLO, WORLD!"
str.toLowerCase();                 // "hello, world!"

// Trimming
"  hi  ".trim();                   // "hi"
"  hi  ".trimStart();              // "hi  "
"  hi  ".trimEnd();                // "  hi"

// Searching
str.indexOf("World");              // 7
str.lastIndexOf("o");              // 8
str.includes("World");             // true
str.startsWith("Hello");           // true
str.endsWith("!");                 // true

// Extracting
str.slice(0, 5);                   // "Hello"  (supports negative index)
str.slice(-6);                     // "World!"
str.substring(0, 5);               // "Hello" (no negative index)
str.substr(7, 5);                  // "World" (deprecated, avoid)
str.charAt(0);                     // "H"
str[0];                            // "H"
str.charCodeAt(0);                 // 72
String.fromCharCode(72);           // "H"
str.at(-1);                        // "!" (supports negative index)

// Splitting & joining
"a,b,c".split(",");                // ["a", "b", "c"]
"abc".split("");                   // ["a", "b", "c"]
["a", "b", "c"].join("-");         // "a-b-c"

// Replacing
str.replace("World", "JS");        // "Hello, JS!"
str.replaceAll("o", "0");          // "Hell0, W0rld!"
str.replace(/o/g, "0");            // "Hell0, W0rld!" (regex, global)

// Padding & repeating
"5".padStart(3, "0");              // "005"
"5".padEnd(3, "0");                // "500"
"ab".repeat(3);                    // "ababab"

// Template literals
const name = "Sam";
const greeting = `Hi, ${name}! Today is ${new Date().getFullYear()}`;

// Multi-line strings
const multi = `Line 1
Line 2`;

// concat
"Hello".concat(" ", "World");      // "Hello World"

// matching (regex)
"cat bat".match(/[a-z]at/g);       // ["cat", "bat"]
"cat".matchAll(/a/g);              // iterator of matches
/cat/.test("concatenate");         // true

// String.raw (raw template string, no escape processing)
String.raw`C:\Users\name`;         // "C:\Users\name"
```

---

## 2. Arrays

### 2.1 Creating & Basic Access

```javascript
const arr = [1, 2, 3, 4, 5];
const arr2 = new Array(3);          // [empty, empty, empty]
const arr3 = Array.of(1, 2, 3);     // [1, 2, 3]
const arr4 = Array.from({length: 5}, (_, i) => i * 2); // [0,2,4,6,8]
const arr5 = Array.from("hello");   // ["h","e","l","l","o"]

arr.length;                          // 5
arr[0];                              // 1
Array.isArray(arr);                  // true
```

### 2.2 Adding / Removing

```javascript
arr.push(6);          // add to end -> returns new length
arr.pop();             // remove from end -> returns removed item
arr.unshift(0);        // add to start -> returns new length
arr.shift();           // remove from start -> returns removed item
```

### 2.3 slice() vs splice()

```javascript
// slice(start, end) — NON-mutating, returns a shallow copy
const a = [1, 2, 3, 4, 5];
a.slice(1, 3);          // [2, 3]        (a unchanged)
a.slice(-2);             // [4, 5]
a.slice();                // full shallow copy

// splice(start, deleteCount, ...items) — MUTATES original, returns removed items
const b = [1, 2, 3, 4, 5];
b.splice(1, 2);          // removes 2 items from index 1 -> returns [2,3]; b = [1,4,5]
b.splice(1, 0, "a", "b"); // insert without removing -> b = [1,"a","b",4,5]
b.splice(1, 1, "x");      // replace 1 item -> b = [1,"x","b",4,5]
```

### 2.4 map() — transform each element (new array)

```javascript
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);          // [2, 4, 6]
const withIndex = nums.map((n, i) => `${i}:${n}`); // ["0:1","1:2","2:3"]
```

### 2.5 filter() — keep elements matching condition (new array)

```javascript
const nums = [1, 2, 3, 4, 5, 6];
const evens = nums.filter(n => n % 2 === 0);   // [2, 4, 6]
const people = [{name:"A", age:30}, {name:"B", age:15}];
const adults = people.filter(p => p.age >= 18); // [{name:"A", age:30}]
```

### 2.6 reduce() / reduceRight()

```javascript
const nums = [1, 2, 3, 4];

// sum
nums.reduce((acc, cur) => acc + cur, 0);        // 10

// max
nums.reduce((acc, cur) => Math.max(acc, cur));   // 4

// group by
const people = [{name:"A", dept:"IT"}, {name:"B", dept:"HR"}, {name:"C", dept:"IT"}];
const grouped = people.reduce((acc, p) => {
  (acc[p.dept] = acc[p.dept] || []).push(p);
  return acc;
}, {});
// { IT: [{...A}, {...C}], HR: [{...B}] }

// flatten
const nested = [[1,2], [3,4], [5]];
nested.reduce((acc, cur) => acc.concat(cur), []); // [1,2,3,4,5]

// reduceRight (right to left)
["a","b","c"].reduceRight((acc, cur) => acc + cur); // "cba"
```

### 2.7 find() / findIndex() / findLast() / findLastIndex()

```javascript
const nums = [5, 12, 8, 130, 44];
nums.find(n => n > 10);           // 12 (first match)
nums.findIndex(n => n > 10);      // 1
nums.findLast(n => n > 10);       // 130 (last match, ES2023)
nums.findLastIndex(n => n > 10);  // 3
```

### 2.8 some() / every()

```javascript
const nums = [1, 2, 3, 4];
nums.some(n => n > 3);    // true  (at least one matches)
nums.every(n => n > 0);   // true  (all match)
nums.every(n => n > 2);   // false
```

### 2.9 sort()

```javascript
// MUTATES original array, returns reference to it
const nums = [10, 1, 21, 2];
nums.sort();                          // [1, 10, 2, 21] (default: lexicographic!)
nums.sort((a, b) => a - b);           // [1, 2, 10, 21] ascending
nums.sort((a, b) => b - a);           // [21, 10, 2, 1] descending

const words = ["banana", "Apple", "cherry"];
words.sort();                         // ["Apple","banana","cherry"] (case-sensitive)
words.sort((a, b) => a.localeCompare(b)); // proper alphabetical

const people = [{age: 30}, {age: 20}, {age: 40}];
people.sort((a, b) => a.age - b.age); // sort by age ascending

// toSorted() — non-mutating version (ES2023)
const sortedCopy = nums.toSorted((a, b) => a - b);
```

### 2.10 flat() / flatMap()

```javascript
const nested = [1, [2, 3], [4, [5, 6]]];
nested.flat();          // [1, 2, 3, 4, [5, 6]]  (default depth 1)
nested.flat(2);          // [1, 2, 3, 4, 5, 6]
nested.flat(Infinity);   // fully flatten any depth

// flatMap = map() then flat(1) — more efficient than doing both
const sentences = ["Hello world", "Foo bar"];
sentences.flatMap(s => s.split(" "));  // ["Hello","world","Foo","bar"]

[1, 2, 3].flatMap(n => [n, n * 2]);     // [1,2,2,4,3,6]
```

### 2.11 forEach()

```javascript
[1, 2, 3].forEach((val, idx, array) => {
  console.log(idx, val);
});
// forEach always returns undefined; cannot break early (use for...of instead)
```

### 2.12 Other useful array methods

```javascript
const arr = [1, 2, 3, 4, 5];

arr.includes(3);              // true
arr.indexOf(3);                // 2
arr.lastIndexOf(3);            // 2
arr.concat([6, 7]);            // [1,2,3,4,5,6,7] (new array)
arr.join("-");                  // "1-2-3-4-5"
arr.reverse();                  // MUTATES, reverses in place
arr.toReversed();               // non-mutating reverse (ES2023)
arr.fill(0, 1, 3);              // fills with 0 from idx 1 to 3 -> [1,0,0,4,5] (mutates)
arr.copyWithin(0, 3);           // copies part of array to another location (mutates)
arr.at(-1);                     // last element -> 5
Array.from({length: 3}, (_, i) => i); // [0, 1, 2]

// Iterators
for (const [index, value] of arr.entries()) { /* ... */ }
for (const key of arr.keys()) { /* ... */ }
for (const value of arr.values()) { /* ... */ }

// Destructuring
const [first, second, ...rest] = arr;   // first=1, second=2, rest=[3,4,5]
const [a, , c] = arr;                    // skip elements -> a=1, c=3

// Spread
const combined = [...arr, ...[6, 7]];    // [1,2,3,4,5,6,7]
const max = Math.max(...arr);            // 5
```

---

## 3. Objects

### 3.1 Creating & Accessing

```javascript
const obj = { name: "Alice", age: 30, city: "NYC" };

obj.name;                 // dot notation -> "Alice"
obj["name"];               // bracket notation -> "Alice"
const key = "age";
obj[key];                   // dynamic access -> 30

// Object.create
const proto = { greet() { return "hi"; } };
const o = Object.create(proto);
```

### 3.2 Object.keys / values / entries

```javascript
const obj = { a: 1, b: 2, c: 3 };

Object.keys(obj);       // ["a", "b", "c"]
Object.values(obj);      // [1, 2, 3]
Object.entries(obj);     // [["a",1], ["b",2], ["c",3]]

// Iterate
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}

// Object.fromEntries (reverse of entries)
Object.fromEntries([["a", 1], ["b", 2]]);  // { a: 1, b: 2 }
Object.fromEntries(new Map([["x", 1]]));    // { x: 1 }
```

### 3.3 Merging & Copying

```javascript
const a = { x: 1, y: 2 };
const b = { y: 3, z: 4 };

Object.assign({}, a, b);       // { x:1, y:3, z:4 } (shallow merge, b overwrites a)
const merged = { ...a, ...b };  // { x:1, y:3, z:4 } (spread, same result)

// Shallow clone
const clone = { ...a };
const clone2 = Object.assign({}, a);

// Deep clone (no functions/dates edge-cases handled)
const deepClone = structuredClone(a);
const deepClone2 = JSON.parse(JSON.stringify(a));
```

### 3.4 Checking & Deleting properties

```javascript
const obj = { a: 1, b: undefined };

"a" in obj;                        // true
obj.hasOwnProperty("a");            // true
Object.hasOwn(obj, "a");            // true (modern replacement)
obj.a !== undefined;                 // true (but false for b even though key exists)

delete obj.a;                        // removes property, returns true
```

### 3.5 Freezing & Sealing

```javascript
const frozen = Object.freeze({ a: 1 });
frozen.a = 2;              // fails silently (throws in strict mode)
Object.isFrozen(frozen);   // true

const sealed = Object.seal({ a: 1 });
sealed.a = 2;                // allowed (existing props can change)
sealed.b = 3;                 // not allowed (can't add new props)
Object.isSealed(sealed);     // true
```

### 3.6 Property descriptors & getters/setters

```javascript
const obj = {
  firstName: "John",
  lastName: "Doe",
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(" ");
  }
};
obj.fullName;                 // "John Doe"
obj.fullName = "Jane Smith";
obj.firstName;                 // "Jane"

Object.defineProperty(obj, "id", {
  value: 123,
  writable: false,
  enumerable: true,
  configurable: false
});
```

### 3.7 Destructuring & shorthand

```javascript
const { name, age, ...others } = { name: "A", age: 1, city: "NYC", zip: "10001" };
// name="A", age=1, others={city:"NYC", zip:"10001"}

const { name: userName = "Guest" } = {};  // rename + default -> userName="Guest"

// Shorthand property/method names
const x = 1, y = 2;
const point = { x, y, sum() { return this.x + this.y; } };

// Computed property names
const key = "dynamicKey";
const obj2 = { [key]: "value" };  // { dynamicKey: "value" }

// Optional chaining & nullish coalescing
const user = { profile: { email: null } };
user.profile?.email;              // null
user.address?.city;                // undefined (no error even though address missing)
user.profile.email ?? "no-email";  // "no-email" (?? only falls back on null/undefined)
user?.getName?.();                  // safely call method that might not exist
```

---

## 4. Map, Set (Collections)

### 4.1 Map — key/value pairs, any type of key

```javascript
const map = new Map();
map.set("name", "Alice");
map.set(1, "one");
map.set(true, "yes");

map.get("name");        // "Alice"
map.has("name");         // true
map.delete("name");      // true
map.size;                 // 2

// Initialize with entries
const map2 = new Map([["a", 1], ["b", 2]]);

// Iterate
for (const [key, value] of map2) { console.log(key, value); }
map2.forEach((value, key) => console.log(key, value));

// Convert
[...map2.keys()];          // ["a", "b"]
[...map2.values()];         // [1, 2]
[...map2.entries()];        // [["a",1],["b",2]]
Object.fromEntries(map2);   // { a: 1, b: 2 }
```

### 4.2 Set — unique values

```javascript
const set = new Set([1, 2, 2, 3, 3, 3]);   // Set {1, 2, 3}
set.add(4);
set.has(2);          // true
set.delete(2);        // true
set.size;              // 3

// Common use: dedupe array
const unique = [...new Set([1, 1, 2, 3, 3])]; // [1, 2, 3]

// Iterate
for (const val of set) { console.log(val); }

// Set operations (ES2024+)
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
a.union(b);            // Set {1,2,3,4}
a.intersection(b);      // Set {2,3}
a.difference(b);         // Set {1}
```

### 4.3 WeakMap / WeakSet (garbage-collectable, object keys only)

```javascript
const wm = new WeakMap();
const objKey = {};
wm.set(objKey, "metadata");
wm.get(objKey);          // "metadata"
// No .size, no iteration — keys are weakly held, allowing GC

const ws = new WeakSet();
ws.add(objKey);
ws.has(objKey);           // true
```

---

## 5. Functions & Callbacks

```javascript
// Function declaration
function add(a, b) { return a + b; }

// Function expression
const subtract = function(a, b) { return a - b; };

// Arrow function
const multiply = (a, b) => a * b;
const square = n => n * n;                // single param, no parens needed
const noop = () => {};
const makeObj = () => ({ key: "value" }); // wrap object literal in parens

// Default parameters
function greet(name = "Guest") { return `Hi ${name}`; }

// Rest parameters
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }
sum(1, 2, 3);   // 6

// Callbacks (function passed as argument)
function fetchData(callback) {
  setTimeout(() => {
    callback(null, { data: "result" });
  }, 1000);
}
fetchData((err, result) => {
  if (err) return console.error(err);
  console.log(result);
});

// Higher-order functions
function multiplyBy(factor) {
  return function(num) { return num * factor; };
}
const double = multiplyBy(2);
double(5);   // 10

// IIFE (Immediately Invoked Function Expression)
(function() { console.log("runs immediately"); })();
```

---

## 6. Promises

```javascript
// Creating a promise
const promise = new Promise((resolve, reject) => {
  const success = true;
  setTimeout(() => {
    if (success) resolve("Done!");
    else reject(new Error("Failed"));
  }, 1000);
});

// Consuming
promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log("Cleanup"));

// Chaining
fetch("/api/user")
  .then(res => res.json())
  .then(user => fetch(`/api/posts?user=${user.id}`))
  .then(res => res.json())
  .then(posts => console.log(posts))
  .catch(err => console.error(err));

// Promise.all — wait for all, fails fast if any reject
Promise.all([
  fetch("/api/a"),
  fetch("/api/b"),
  fetch("/api/c")
]).then(([resA, resB, resC]) => { /* ... */ });

// Promise.allSettled — wait for all, never rejects, gives status of each
Promise.allSettled([p1, p2]).then(results => {
  results.forEach(r => {
    if (r.status === "fulfilled") console.log(r.value);
    else console.log(r.reason);
  });
});

// Promise.race — resolves/rejects as soon as the first settles
Promise.race([p1, p2]).then(first => console.log(first));

// Promise.any — resolves as soon as first fulfills, ignores rejections
Promise.any([p1, p2]).then(first => console.log(first));

// Promise.resolve / Promise.reject
Promise.resolve(42).then(v => console.log(v));
Promise.reject(new Error("nope")).catch(e => console.log(e.message));
```

---

## 7. Async / Await

```javascript
// Basic async function (always returns a Promise)
async function getData() {
  return "hello";
}
getData().then(console.log);  // "hello"

// await pauses until the promise settles
async function fetchUser() {
  try {
    const response = await fetch("/api/user");
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Failed:", error);
    throw error;
  } finally {
    console.log("Request finished");
  }
}

// Sequential vs parallel await
async function sequential() {
  const a = await fetchA();  // waits
  const b = await fetchB();  // then waits
  return [a, b];
}

async function parallel() {
  const [a, b] = await Promise.all([fetchA(), fetchB()]); // runs concurrently
  return [a, b];
}

// Async arrow function
const getUser = async (id) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
};

// Async with array methods (map won't await properly — use Promise.all)
async function getAll(ids) {
  const promises = ids.map(id => getUser(id)); // fire off all requests
  return Promise.all(promises);                  // await them together
}

// for await...of (async iteration)
async function processStream(asyncIterable) {
  for await (const chunk of asyncIterable) {
    console.log(chunk);
  }
}

// Top-level await (inside ES modules)
const data = await fetch("/api/data").then(r => r.json());
```

---

## 8. Classes

```javascript
class Animal {
  // class fields
  legs = 4;
  static kingdom = "Animalia";  // static property

  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
    this.#secret = "hidden"; // private field
  }

  #secret; // private field declaration

  // instance method
  speak() {
    return `${this.name} says ${this.sound}`;
  }

  // getter/setter
  get info() { return `${this.name} (${this.legs} legs)`; }
  set nickname(value) { this._nickname = value; }

  // static method
  static create(name) { return new Animal(name, "..."); }

  // private method
  #privateHelper() { return this.#secret; }
}

class Dog extends Animal {
  constructor(name) {
    super(name, "Woof");  // must call super() before using `this`
    this.breed = "Unknown";
  }

  speak() {                    // method overriding
    return `${super.speak()} (a dog!)`;
  }
}

const rex = new Dog("Rex");
rex.speak();               // "Rex says Woof (a dog!)"
rex.info;                    // "Rex (4 legs)"
rex instanceof Animal;      // true
Animal.kingdom;              // "Animalia"

// Class expression
const Cat = class {
  constructor(name) { this.name = name; }
};
```

---

## 9. Modules (ES Modules)

```javascript
// ---- math.js ----
export const PI = 3.14159;

export function add(a, b) { return a + b; }

export class Calculator {
  add(a, b) { return a + b; }
}

// default export (one per file)
export default function multiply(a, b) { return a * b; }


// ---- main.js ----
import multiply, { PI, add, Calculator } from "./math.js";
import { add as addFn } from "./math.js";      // rename on import
import * as MathUtils from "./math.js";         // namespace import

console.log(multiply(2, 3));      // 6
console.log(MathUtils.PI);         // 3.14159

// Re-exporting
export { add, PI } from "./math.js";
export * from "./math.js";
export * as MathUtils from "./math.js";

// Dynamic import (returns a Promise, useful for lazy-loading)
button.addEventListener("click", async () => {
  const module = await import("./math.js");
  console.log(module.add(2, 3));
});
```

```html
<!-- HTML usage -->
<script type="module" src="main.js"></script>
```

```javascript
// CommonJS (Node.js older style, for comparison)
// module.js
module.exports = { add, PI };
// or: exports.add = add;

// main.js
const { add, PI } = require("./module");
```

---

## 10. Quick Reference Cheat Sheet

| Method | Mutates? | Returns |
|---|---|---|
| `push/pop/shift/unshift` | Yes | length / removed item |
| `splice` | Yes | removed items array |
| `slice` | No | new array |
| `sort/reverse/fill` | Yes | reference to same array |
| `toSorted/toReversed` | No | new array |
| `map/filter/flatMap` | No | new array |
| `forEach` | No | `undefined` |
| `reduce/reduceRight` | No | accumulated value |
| `find/findIndex` | No | element / index (or `-1`/`undefined`) |
| `some/every` | No | boolean |
| `concat/join/flat` | No | new array / string |
| `Object.assign` | Yes (1st arg) | merged object |
| `{ ...spread }` | No | new object |

**Truthy vs Falsy:** `false, 0, "", null, undefined, NaN` are falsy — everything else (including `[]` and `{}`) is truthy.

**Equality:** always prefer `===` / `!==` over `==` / `!=` to avoid type coercion surprises.
