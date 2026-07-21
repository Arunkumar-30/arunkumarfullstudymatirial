# React.js Interview Questions & Answers (2 Years Experience Level)

Organized by topic. Each answer is interview-ready — concise explanation + code example.

---

## 1. Core Concepts

### Q1. What is the Virtual DOM, and why does React use it?

The Virtual DOM is a lightweight JS representation of the real DOM kept in memory. When state changes, React builds a new Virtual DOM tree, **diffs** it against the previous one (reconciliation), and updates only the changed parts of the real DOM — avoiding expensive full re-renders and improving performance.

```javascript
// Conceptually:
// 1. State changes -> new virtual DOM tree created
// 2. React diffs old vs new tree (reconciliation algorithm)
// 3. React computes minimal set of real DOM mutations needed
// 4. Only those changes are applied to the actual DOM
```

---

### Q2. What is JSX? Is it required in React?

JSX is a syntax extension that lets you write HTML-like markup inside JavaScript. It's not required (you can use `React.createElement` directly) but makes component code far more readable. JSX compiles down to `React.createElement` calls via Babel.

```jsx
// JSX
const element = <h1 className="title">Hello, {name}!</h1>;

// Compiles to (roughly)
const element2 = React.createElement("h1", { className: "title" }, "Hello, ", name, "!");
```

---

### Q3. What's the difference between functional and class components?

```jsx
// Class component (older style)
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// Functional component (modern standard, uses Hooks for state/lifecycle)
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}
```
Functional components with Hooks are now the standard — less boilerplate, no `this` binding issues, easier to test and reuse logic (via custom hooks).

---

### Q4. What are props vs state?

- **Props**: read-only data passed **from parent to child**; the receiving component cannot modify them.
- **State**: data owned and managed **within a component**, can change over time and triggers re-renders when updated.

```jsx
function Parent() {
  const [count, setCount] = useState(0);   // state, owned by Parent
  return <Child count={count} />;             // passed down as a prop
}
function Child({ count }) {                      // props, read-only here
  return <p>Count: {count}</p>;
}
```

---

### Q5. What is the difference between controlled and uncontrolled components?

```jsx
// Controlled — form value is driven by React state (single source of truth)
function ControlledInput() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}

// Uncontrolled — DOM manages its own state, accessed via a ref
function UncontrolledInput() {
  const inputRef = useRef(null);
  const handleSubmit = () => console.log(inputRef.current.value);
  return <input ref={inputRef} defaultValue="" />;
}
```
**Guideline:** controlled components are the React-idiomatic default (easier validation, conditional logic); uncontrolled are useful for simple forms or integrating non-React code/file inputs.

---

## 2. Hooks

### Q6. Explain `useState`.

```jsx
const [count, setCount] = useState(0);

setCount(count + 1);           // direct update
setCount(prev => prev + 1);     // functional update — safer, avoids stale closures in batched updates

// State with objects — must spread manually, React doesn't merge automatically (unlike class setState)
const [user, setUser] = useState({ name: "Alice", age: 30 });
setUser(prev => ({ ...prev, age: 31 }));   // must spread previous state
```

---

### Q7. Explain `useEffect` and its dependency array.

`useEffect` runs side effects (data fetching, subscriptions, DOM manipulation) after render.

```jsx
useEffect(() => {
  console.log("Runs after every render");
});

useEffect(() => {
  console.log("Runs only once, after initial mount");
}, []);

useEffect(() => {
  console.log("Runs when `count` changes");
}, [count]);

useEffect(() => {
  const timer = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(timer);   // cleanup function — runs before next effect and on unmount
}, []);

// Common bug: missing dependency causes stale closures
useEffect(() => {
  const handler = () => console.log(count);   // stale `count` if not in deps
  window.addEventListener("click", handler);
  return () => window.removeEventListener("click", handler);
}, [count]);   // must include count, or handler always sees the initial value
```

---

### Q8. What is `useContext`? When would you use it?

`useContext` lets components consume shared data without manually passing props through every level (avoids "prop drilling").

```jsx
const ThemeContext = React.createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}
function Toolbar() {
  return <ThemedButton />;      // no need to pass theme as a prop here
}
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```
**Use case:** theme, authenticated user, language/locale, global config. For complex/frequently-updating global state, a dedicated state library (Redux, Zustand) or `useReducer` + Context is often better, since Context re-renders all consumers on every value change.

---

### Q9. What's the difference between `useMemo` and `useCallback`?

Both memoize values between renders to avoid unnecessary recomputation/re-renders, but:
- `useMemo` memoizes a **computed value**.
- `useCallback` memoizes a **function reference**.

```jsx
// useMemo — avoid expensive recalculation unless dependencies change
const sortedList = useMemo(() => {
  return items.slice().sort((a, b) => a.price - b.price);
}, [items]);

// useCallback — avoid recreating function on every render (important for React.memo children)
const handleClick = useCallback(() => {
  console.log("Clicked", id);
}, [id]);

// Note: useCallback(fn, deps) is equivalent to useMemo(() => fn, deps)
```
**When it matters:** passing callbacks to memoized child components (`React.memo`), or avoiding expensive recalculations on every render. Don't overuse — memoization itself has a cost.

---

### Q10. What is `useRef`? Give two different use cases.

```jsx
// Use case 1: accessing a DOM node directly
function TextInput() {
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current.focus(); }, []);
  return <input ref={inputRef} />;
}

// Use case 2: storing a mutable value that persists across renders WITHOUT causing re-renders
function Timer() {
  const countRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      countRef.current += 1;   // updates but does NOT trigger a re-render
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);
}
```
**Key distinction from state:** updating a ref does not cause a re-render; updating state does.

---

### Q11. What is `useReducer`? When would you prefer it over `useState`?

`useReducer` manages state via a reducer function `(state, action) => newState` — better for complex state logic with multiple sub-values or when the next state depends on the previous one in non-trivial ways.

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "increment": return { count: state.count + 1 };
    case "decrement": return { count: state.count - 1 };
    case "reset": return { count: 0 };
    default: throw new Error("Unknown action");
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </>
  );
}
```
**Prefer over `useState` when:** state has multiple related sub-values, next state depends on previous state in complex ways, or you want to centralize/test update logic separately from the component.

---

### Q12. What are the rules of hooks?

1. Only call hooks at the **top level** — never inside loops, conditions, or nested functions.
2. Only call hooks from **React function components** or **custom hooks** — not regular JS functions.

```jsx
// WRONG — conditional hook call breaks React's ability to track hook order
if (isLoggedIn) {
  useEffect(() => { /* ... */ });
}

// RIGHT — put the condition inside the hook
useEffect(() => {
  if (isLoggedIn) { /* ... */ }
}, [isLoggedIn]);
```
**Why:** React relies on hooks being called in the exact same order every render to correctly associate state between renders.

---

### Q13. What is a custom hook? Write one.

A custom hook is a JS function starting with `use` that calls other hooks to encapsulate reusable stateful logic.

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => { if (!cancelled) { setData(data); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(err); setLoading(false); } });
    return () => { cancelled = true; };  // avoid setting state on unmounted component
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(`/api/users/${userId}`);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  return <p>{data.name}</p>;
}
```

---

## 3. Component Lifecycle & Rendering

### Q14. What causes a component to re-render?

1. Its own state changes (`useState`/`useReducer`).
2. Its parent re-renders (children re-render too by default, even if their props didn't change).
3. Context value it consumes changes.
4. Force update (rare, class components: `forceUpdate()`).

```jsx
// Prevent unnecessary re-renders from parent updates with React.memo
const Child = React.memo(function Child({ name }) {
  console.log("Child rendered");
  return <p>{name}</p>;
});
// Child only re-renders if `name` prop actually changes (shallow comparison)
```

---

### Q15. Explain the component lifecycle in class components and their Hook equivalents.

| Class lifecycle method | Hook equivalent |
|---|---|
| `constructor` | `useState` initializer |
| `componentDidMount` | `useEffect(() => {...}, [])` |
| `componentDidUpdate` | `useEffect(() => {...}, [deps])` |
| `componentWillUnmount` | `useEffect` cleanup function (`return () => {...}`) |
| `shouldComponentUpdate` | `React.memo` / `useMemo` |

```jsx
class Example extends React.Component {
  componentDidMount() { console.log("mounted"); }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) console.log("id changed");
  }
  componentWillUnmount() { console.log("cleanup"); }
}

// Hook equivalent
function Example({ id }) {
  useEffect(() => {
    console.log("mounted or id changed");
    return () => console.log("cleanup");
  }, [id]);
}
```

---

### Q16. What is reconciliation, and how does React's diffing algorithm use `key`?

Reconciliation is React's process of comparing the new Virtual DOM tree to the previous one to determine minimal updates. For lists, React uses the `key` prop to identify which items changed/moved/were added/removed — without stable keys, React may re-render or lose state unnecessarily.

```jsx
// BAD — using array index as key causes bugs when list order changes (e.g. after sort/filter/insert)
{items.map((item, index) => <Item key={index} {...item} />)}

// GOOD — use a stable, unique identifier
{items.map(item => <Item key={item.id} {...item} />)}
```

---

### Q17. What is React's batching? How did it change in React 18?

Batching groups multiple state updates into a single re-render for performance. Before React 18, batching only happened inside React event handlers; state updates in promises, `setTimeout`, or native event handlers triggered separate re-renders. React 18 introduced **automatic batching** everywhere.

```jsx
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 18: batched into ONE re-render, regardless of where this runs (even in setTimeout/promises)
}
```

---

## 4. Performance Optimization

### Q18. How would you optimize a React app's performance?

```jsx
// 1. Memoize expensive components
const ExpensiveList = React.memo(function ExpensiveList({ items }) { /* ... */ });

// 2. Memoize expensive calculations
const total = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items]);

// 3. Memoize callbacks passed to memoized children
const handleSelect = useCallback((id) => setSelected(id), []);

// 4. Code-split with lazy loading
const Dashboard = React.lazy(() => import("./Dashboard"));
<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>

// 5. Virtualize long lists (react-window / react-virtualized)
// 6. Avoid inline object/array/function literals as props (creates new reference every render)
// 7. Use stable, unique `key` props in lists
// 8. Debounce/throttle expensive handlers (search input, scroll, resize)
```

---

### Q19. What is `React.memo`, and when does it NOT help?

`React.memo` wraps a component and skips re-rendering if props are shallowly equal to the previous render.

```jsx
const Row = React.memo(function Row({ user }) {
  return <p>{user.name}</p>;
});
```
**Doesn't help when:** the parent passes a new object/array/function reference on every render (shallow comparison always fails) — you must also memoize those props with `useMemo`/`useCallback`, or it provides no benefit and adds comparison overhead for nothing.

---

### Q20. What causes unnecessary re-renders, and how do you debug them?

Common causes: parent re-renders and passes new inline object/array/function props; Context value changes causing all consumers to re-render; missing/unstable `key`; unmemoized derived state recalculated every render.

```jsx
// Debugging tools:
// - React DevTools Profiler tab — records renders and shows "why did this render"
// - console.log inside component body (crude but effective)
// - why-did-you-render library for automated detection
```

---

## 5. State Management

### Q21. When would you use Context API vs Redux/Zustand?

- **Context API**: good for low-frequency updates (theme, auth user, locale) — simple, built-in, no extra dependency.
- **Redux/Zustand/other state libraries**: better for complex, frequently-updated, or cross-cutting state (shopping cart, real-time data, large app state) — offer devtools, middleware, selective re-rendering (subscribers only re-render on the slice they use), and predictable update patterns.

```jsx
// Context re-renders ALL consumers on any value change — can hurt performance at scale
// Redux/Zustand let components subscribe to specific slices, avoiding that problem
```

---

### Q22. Explain how `useState` updates work with objects and arrays — why can't you mutate directly?

React uses `Object.is` shallow comparison to detect state changes. Mutating an object/array in place doesn't create a new reference, so React won't detect the change and won't re-render.

```jsx
// WRONG — mutates existing array, same reference, React won't re-render
const [items, setItems] = useState([1, 2, 3]);
function addItem() {
  items.push(4);           // mutation!
  setItems(items);          // same reference -> React skips re-render
}

// RIGHT — create a new array/object reference
function addItem() {
  setItems([...items, 4]);
}
function updateUser() {
  setUser(prev => ({ ...prev, name: "New Name" }));
}
```

---

## 6. Forms, Events & Refs

### Q23. How does event handling differ in React vs vanilla JS?

React wraps native events in a **SyntheticEvent** for cross-browser consistency, and uses event delegation (attaching one listener at the root) rather than per-element listeners for performance.

```jsx
function Button() {
  function handleClick(e) {
    e.preventDefault();      // works the same as native events
    console.log(e.type);       // "click"
  }
  return <button onClick={handleClick}>Click</button>;
}
```

---

### Q24. How do you lift state up? Give an example.

"Lifting state up" means moving shared state to the closest common ancestor so multiple children can read/update it via props.

```jsx
function Parent() {
  const [value, setValue] = useState("");
  return (
    <>
      <Input value={value} onChange={setValue} />
      <Display value={value} />
    </>
  );
}
function Input({ value, onChange }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}
function Display({ value }) {
  return <p>You typed: {value}</p>;
}
```

---

### Q25. What is prop drilling, and how do you avoid it?

Prop drilling is passing props through many intermediate components that don't need them, just to reach a deeply nested child.

```jsx
// Prop drilling
function App() { return <A user={user} />; }
function A({ user }) { return <B user={user} />; }     // A doesn't need `user`, just passes it
function B({ user }) { return <C user={user} />; }        // same here
function C({ user }) { return <p>{user.name}</p>; }

// Fix: Context API
const UserContext = createContext();
function App() {
  return <UserContext.Provider value={user}><A /></UserContext.Provider>;
}
function C() {
  const user = useContext(UserContext);
  return <p>{user.name}</p>;
}
// Or: component composition (pass children/JSX instead of drilling data down)
```

---

## 7. Error Handling & Edge Cases

### Q26. What are Error Boundaries? Can you write one with Hooks?

Error boundaries catch JS errors in their child component tree during rendering and show a fallback UI instead of crashing the whole app. **They must currently be class components** — there's no Hook equivalent (as of React 18/19), though libraries like `react-error-boundary` wrap this for you.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("Caught error:", error, info);
  }
  render() {
    if (this.state.hasError) return <h1>Something went wrong.</h1>;
    return this.props.children;
  }
}

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```
**Note:** error boundaries do NOT catch errors in event handlers, async code, or server-side rendering — use regular try/catch for those.

---

### Q27. How do you handle async data fetching and loading/error states cleanly?

```jsx
function UserProfile({ userId }) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null, error: null });

    fetch(`/api/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => { if (!cancelled) setState({ status: "success", data, error: null }); })
      .catch(error => { if (!cancelled) setState({ status: "error", data: null, error }); });

    return () => { cancelled = true; };
  }, [userId]);

  if (state.status === "loading") return <Spinner />;
  if (state.status === "error") return <p>Error: {state.error.message}</p>;
  return <p>{state.data.name}</p>;
}
```

---

## 8. Practical Coding Challenges

### Q28. Build a simple counter with increment, decrement, and reset.

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### Q29. Build a debounced search input.

```jsx
function SearchBox({ onSearch }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) onSearch(query);
    }, 500);
    return () => clearTimeout(timer);   // cancel pending call if query changes again
  }, [query, onSearch]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." />;
}
```

### Q30. Implement an infinite/paginated list.

```jsx
function InfiniteList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/items?page=${page}`)
      .then(res => res.json())
      .then(newItems => {
        setItems(prev => [...prev, ...newItems]);
        setLoading(false);
      });
  }, [page]);

  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
      <button disabled={loading} onClick={() => setPage(p => p + 1)}>
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
}
```

### Q31. Implement a toggle/accordion component.

```jsx
function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div>
      {items.map((item, i) => (
        <div key={item.id}>
          <button onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            {item.title}
          </button>
          {openIndex === i && <p>{item.content}</p>}
        </div>
      ))}
    </div>
  );
}
```

---

## 9. Miscellaneous / Conceptual

### Q32. What is the difference between `React.Fragment` and a `<div>` wrapper?

`<React.Fragment>` (or shorthand `<>...</>`) groups children without adding an extra DOM node — useful when you need to return multiple elements from a component but don't want an unnecessary wrapper `<div>` that could break CSS layout (e.g. flex/grid) or add invalid nesting.

```jsx
function List() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  );
}
```

---

### Q33. What is server-side rendering (SSR), and why use it (e.g. with Next.js)?

SSR renders React components to HTML on the server before sending to the browser, improving initial load performance and SEO (crawlers see fully-rendered content), compared to client-side rendering (CSR) where the browser gets a near-empty HTML shell and JS builds the UI after load.

```jsx
// Next.js example — data fetched server-side before render
export async function getServerSideProps() {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();
  return { props: { data } };
}
function Page({ data }) {
  return <div>{data.title}</div>;
}
```

---

### Q34. What are portals in React?

Portals let you render a child into a DOM node outside the parent component's DOM hierarchy — commonly used for modals, tooltips, and dropdowns that need to escape a parent's `overflow: hidden` or `z-index` stacking context.

```jsx
import { createPortal } from "react-dom";

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.getElementById("modal-root")
  );
}
```

---

### Q35. What is the difference between `useLayoutEffect` and `useEffect`?

`useEffect` runs **asynchronously after** the browser paints. `useLayoutEffect` runs **synchronously before** the browser paints — use it only when you need to measure/mutate the DOM before the user sees a visual flicker (e.g. reading layout dimensions and adjusting position).

```jsx
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setHeight(height);   // avoids visual flicker vs useEffect
}, []);
```
**Guideline:** default to `useEffect`; reach for `useLayoutEffect` only for layout-measurement edge cases, since it blocks painting and can hurt performance if overused.

---

## Quick Prep Tips

- Be ready to explain **why direct state mutation doesn't trigger re-renders** — this trips up a lot of candidates.
- Know the Hooks rules cold, and be able to spot a rules-of-hooks violation in a code snippet.
- Practice writing a **custom hook** live (e.g. `useFetch`, `useDebounce`, `useLocalStorage`).
- Be able to explain `useMemo`/`useCallback`/`React.memo` together — they're almost always asked as a set.
- Know the difference between controlled/uncontrolled components and be ready to justify which you'd use for a given form scenario.
