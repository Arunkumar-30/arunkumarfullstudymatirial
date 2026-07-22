# React.js Complete Course

A full reference — components, JSX, props/state, all Hooks, routing, forms, context, performance, and testing, all with examples. (React 18+ syntax, functional components + Hooks throughout.)

---

## 1. Setup

```bash
# Vite (recommended, fast, modern)
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev

# Create React App (legacy, still widely seen)
npx create-react-app my-app
npm start

# Next.js (React framework with SSR/routing built in)
npx create-next-app@latest my-app
```

```jsx
// main.jsx — entry point (Vite)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 2. JSX

```jsx
// JSX = HTML-like syntax in JS, compiles to React.createElement calls
const element = <h1>Hello, World!</h1>;

// Embedding expressions with {}
const name = "Alice";
const greeting = <h1>Hello, {name}!</h1>;
const sum = <p>2 + 2 = {2 + 2}</p>;

// Attributes use camelCase (className instead of class, onClick instead of onclick)
const el = <div className="container" onClick={() => console.log("clicked")}></div>;

// Self-closing tags required for elements with no children
const img = <img src="photo.jpg" alt="A photo" />;

// JSX must return a single root element (or a Fragment)
function App() {
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  );
}

// Conditional rendering
function Greeting({ isLoggedIn }) {
  return <div>{isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}</div>;
}
function Notification({ count }) {
  return <div>{count > 0 && <span>You have {count} messages</span>}</div>;
}

// Rendering lists
function List({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}

// Inline styles (object, camelCase properties)
const style = { color: "blue", fontSize: "20px" };
const el2 = <p style={style}>Styled text</p>;
const el3 = <p style={{ color: "red" }}>Inline styled</p>;
```

---

## 3. Components, Props & State

### 3.1 Function Components & Props

```jsx
// Basic component
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Destructured props (preferred style)
function Welcome2({ name, age = 18 }) {   // with a default value
  return <h1>Hello, {name}. Age: {age}</h1>;
}

// Usage
<Welcome name="Alice" />
<Welcome2 name="Bob" age={25} />

// children prop
function Card({ children }) {
  return <div className="card">{children}</div>;
}
<Card><p>This is card content</p></Card>

// Prop types (with prop-types package, optional but common in JS projects)
import PropTypes from "prop-types";
Welcome.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number
};
```

### 3.2 useState

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(prev => prev - 1)}>-</button>  {/* functional update */}
    </div>
  );
}

// State with objects/arrays — always create a new reference
function Form() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [items, setItems] = useState([]);

  const updateName = (name) => setUser(prev => ({ ...prev, name }));
  const addItem = (item) => setItems(prev => [...prev, item]);
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
}

// Lazy initial state (expensive computation runs only once)
const [data, setData] = useState(() => computeExpensiveInitialValue());
```

---

## 4. Hooks (Complete Reference)

### 4.1 useEffect

```jsx
import { useEffect, useState } from "react";

function Example({ userId }) {
  useEffect(() => {
    console.log("Runs after every render");
  });

  useEffect(() => {
    console.log("Runs once, on mount only");
  }, []);

  useEffect(() => {
    console.log("Runs when userId changes");
  }, [userId]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => console.log(data));
    return () => controller.abort();   // cleanup: cancel fetch if userId changes/unmounts
  }, [userId]);

  useEffect(() => {
    document.title = `User ${userId}`;
    return () => { document.title = "App"; };   // cleanup on unmount
  }, [userId]);
}
```

### 4.2 useContext

```jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Current theme: {theme}
    </button>
  );
}
```

### 4.3 useRef

```jsx
import { useRef, useEffect } from "react";

function TextInput() {
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current.focus(); }, []);
  return <input ref={inputRef} type="text" />;
}

function RenderCounter() {
  const renderCount = useRef(0);
  renderCount.current += 1;   // mutable, persists across renders, doesn't trigger re-render
  return <p>Rendered {renderCount.current} times</p>;
}
```

### 4.4 useMemo & useCallback

```jsx
import { useMemo, useCallback, useState } from "react";

function ProductList({ products, searchTerm }) {
  const filtered = useMemo(() => {
    return products.filter(p => p.name.includes(searchTerm));
  }, [products, searchTerm]);

  const handleSelect = useCallback((id) => {
    console.log("Selected:", id);
  }, []);

  return filtered.map(p => <ProductRow key={p.id} product={p} onSelect={handleSelect} />);
}

const ProductRow = React.memo(function ProductRow({ product, onSelect }) {
  return <div onClick={() => onSelect(product.id)}>{product.name}</div>;
});
```

### 4.5 useReducer

```jsx
import { useReducer } from "react";

const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case "increment": return { ...state, count: state.count + state.step };
    case "decrement": return { ...state, count: state.count - state.step };
    case "setStep": return { ...state, step: action.payload };
    case "reset": return initialState;
    default: throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <input
        type="number"
        value={state.step}
        onChange={(e) => dispatch({ type: "setStep", payload: Number(e.target.value) })}
      />
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}
```

### 4.6 useLayoutEffect

```jsx
import { useLayoutEffect, useRef, useState } from "react";

function Tooltip({ text }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    setHeight(ref.current.getBoundingClientRect().height);  // measure before paint
  }, []);

  return <div ref={ref}>{text} (height: {height})</div>;
}
```

### 4.7 useId (React 18+, for accessible unique IDs)

```jsx
import { useId } from "react";

function LabeledInput() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Name</label>
      <input id={id} type="text" />
    </>
  );
}
```

### 4.8 useTransition & useDeferredValue (React 18+, concurrent features)

```jsx
import { useTransition, useState } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState([]);

  function handleChange(e) {
    setQuery(e.target.value);          // urgent update — updates immediately
    startTransition(() => {
      setResults(computeResults(e.target.value));  // non-urgent — can be interrupted
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  );
}
```

```jsx
import { useDeferredValue, useState } from "react";

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);  // lags behind for smoother typing on heavy lists
  return <ExpensiveList query={deferredQuery} />;
}
```

### 4.9 Custom Hooks

```jsx
// useLocalStorage — persist state to localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// useDebounce — debounce a fast-changing value
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// useWindowSize
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}
```

---

## 5. Forms

```jsx
// Controlled form with multiple fields
function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors = {};
    if (!form.email.includes("@")) newErrors.email = "Invalid email";
    if (form.password.length < 6) newErrors.password = "Password too short";
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log("Submitting:", form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      {errors.email && <span className="error">{errors.email}</span>}
      <input name="password" type="password" value={form.password} onChange={handleChange} />
      {errors.password && <span className="error">{errors.password}</span>}
      <button type="submit">Sign Up</button>
    </form>
  );
}

// Checkbox / radio / select
function Preferences() {
  const [subscribed, setSubscribed] = useState(false);
  const [plan, setPlan] = useState("basic");

  return (
    <>
      <label>
        <input type="checkbox" checked={subscribed} onChange={(e) => setSubscribed(e.target.checked)} />
        Subscribe to newsletter
      </label>

      <select value={plan} onChange={(e) => setPlan(e.target.value)}>
        <option value="basic">Basic</option>
        <option value="pro">Pro</option>
      </select>

      <label><input type="radio" name="plan" value="basic" checked={plan === "basic"} onChange={(e) => setPlan(e.target.value)} /> Basic</label>
      <label><input type="radio" name="plan" value="pro" checked={plan === "pro"} onChange={(e) => setPlan(e.target.value)} /> Pro</label>
    </>
  );
}

// react-hook-form (popular library, less boilerplate + better performance)
import { useForm } from "react-hook-form";
function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: "Email is required" })} />
      {errors.email && <span>{errors.email.message}</span>}
      <input type="password" {...register("password", { minLength: 6 })} />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## 6. Routing (React Router v6+)

```bash
npm install react-router-dom
```

```jsx
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, Navigate, Outlet } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users/1">User 1</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="settings" element={<Settings />} />       {/* nested route */}
          <Route path="users" element={<AdminUsers />} />
        </Route>
        <Route path="*" element={<NotFound />} />                  {/* catch-all 404 */}
      </Routes>
    </BrowserRouter>
  );
}

// Route params
function UserProfile() {
  const { id } = useParams();
  return <p>User ID: {id}</p>;
}

// Programmatic navigation
function LoginButton() {
  const navigate = useNavigate();
  function handleLogin() {
    // ...login logic...
    navigate("/dashboard");
    // navigate(-1);       // go back
    // navigate("/", { replace: true });   // replace history entry (no back button return)
  }
  return <button onClick={handleLogin}>Login</button>;
}

// Protected routes
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// Nested routes with Outlet
function AdminLayout() {
  return (
    <div>
      <Sidebar />
      <Outlet />   {/* renders the matched nested child route */}
    </div>
  );
}

// Query params
import { useSearchParams } from "react-router-dom";
function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");
  return <input value={query || ""} onChange={(e) => setSearchParams({ q: e.target.value })} />;
}
```

---

## 7. Data Fetching Patterns

```jsx
// Basic fetch with useEffect
function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then(res => res.json())
      .then(data => { setPosts(data); setLoading(false); });
  }, []);

  if (loading) return <p>Loading...</p>;
  return posts.map(post => <PostCard key={post.id} post={post} />);
}

// With react-query / TanStack Query (recommended for real apps — caching, retries, refetching built in)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetch("/api/posts").then(res => res.json())
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return data.map(post => <PostCard key={post.id} post={post} />);
}

function CreatePost() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newPost) => fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] })
  });

  return <button onClick={() => mutation.mutate({ title: "New Post" })}>Create</button>;
}
```

---

## 8. State Management (Beyond Component State)

### 8.1 Context + useReducer (built-in global state pattern)

```jsx
const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case "add": return [...state, action.item];
    case "remove": return state.filter(i => i.id !== action.id);
    default: return state;
  }
}

function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  return <CartContext.Provider value={{ cart, dispatch }}>{children}</CartContext.Provider>;
}

function useCart() {
  return useContext(CartContext);
}

function AddToCartButton({ item }) {
  const { dispatch } = useCart();
  return <button onClick={() => dispatch({ type: "add", item })}>Add to Cart</button>;
}
```

### 8.2 Zustand (lightweight external store, no boilerplate)

```bash
npm install zustand
```

```jsx
import { create } from "zustand";

const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  clear: () => set({ items: [] })
}));

function Cart() {
  const items = useCartStore((state) => state.items);   // only re-renders when `items` changes
  const removeItem = useCartStore((state) => state.removeItem);
  return items.map(item => <div key={item.id} onClick={() => removeItem(item.id)}>{item.name}</div>);
}
```

### 8.3 Redux Toolkit (for large/complex apps)

```bash
npm install @reduxjs/toolkit react-redux
```

```jsx
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },       // Redux Toolkit allows "mutation" via Immer internally
    decrement: (state) => { state.value -= 1; },
    incrementBy: (state, action) => { state.value += action.payload; }
  }
});

export const { increment, decrement, incrementBy } = counterSlice.actions;
const store = configureStore({ reducer: { counter: counterSlice.reducer } });

function App() {
  return <Provider store={store}><Counter /></Provider>;
}

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <>
      <p>{count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(incrementBy(5))}>+5</button>
    </>
  );
}
```

---

## 9. Performance Optimization

```jsx
// React.memo — skip re-render if props are shallowly equal
const Row = React.memo(function Row({ user }) {
  return <p>{user.name}</p>;
});

// Custom comparison function for React.memo
const Row2 = React.memo(function Row2({ user }) {
  return <p>{user.name}</p>;
}, (prevProps, nextProps) => prevProps.user.id === nextProps.user.id);

// Code splitting with lazy + Suspense
import { lazy, Suspense } from "react";
const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Dashboard />
    </Suspense>
  );
}

// Virtualized lists (react-window) — only render visible rows
import { FixedSizeList } from "react-window";
function BigList({ items }) {
  return (
    <FixedSizeList height={400} width={300} itemCount={items.length} itemSize={35}>
      {({ index, style }) => <div style={style}>{items[index].name}</div>}
    </FixedSizeList>
  );
}
```

---

## 10. Error Boundaries

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. <button onClick={() => this.setState({ hasError: false })}>Retry</button></h2>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <MyRiskyComponent />
    </ErrorBoundary>
  );
}

// Using react-error-boundary library (simpler API)
import { ErrorBoundary } from "react-error-boundary";
function Fallback({ error, resetErrorBoundary }) {
  return <div>Error: {error.message} <button onClick={resetErrorBoundary}>Retry</button></div>;
}
<ErrorBoundary FallbackComponent={Fallback}>
  <MyComponent />
</ErrorBoundary>
```

---

## 11. Testing (React Testing Library + Jest/Vitest)

```bash
npm install -D @testing-library/react @testing-library/jest-dom vitest
```

```jsx
// Counter.jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

// Counter.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Counter from "./Counter";

describe("Counter", () => {
  it("renders initial count of 0", () => {
    render(<Counter />);
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });

  it("increments count when button is clicked", () => {
    render(<Counter />);
    const button = screen.getByText("Increment");
    fireEvent.click(button);
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });
});

// Testing async data fetching
import { waitFor } from "@testing-library/react";
it("displays fetched data", async () => {
  render(<UserProfile userId={1} />);
  await waitFor(() => expect(screen.getByText("Alice")).toBeInTheDocument());
});
```

---

## 12. Component Composition Patterns

```jsx
// Compound components (e.g. custom Tabs component)
function Tabs({ children, activeIndex, onChange }) {
  return React.Children.map(children, (child, index) =>
    React.cloneElement(child, { isActive: index === activeIndex, onClick: () => onChange(index) })
  );
}
function Tab({ isActive, onClick, children }) {
  return <button className={isActive ? "active" : ""} onClick={onClick}>{children}</button>;
}

// Render props pattern
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  useEffect(() => { fetch(url).then(res => res.json()).then(setData); }, [url]);
  return children(data);
}
<DataFetcher url="/api/user">
  {(data) => data ? <p>{data.name}</p> : <p>Loading...</p>}
</DataFetcher>

// Higher-Order Components (HOC) — wraps a component to add behavior
function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <p>Loading...</p>;
    return <Component {...props} />;
  };
}
const UserListWithLoading = withLoading(UserList);

// Composition over inheritance — pass components as props/children instead of extending classes
function Layout({ sidebar, content }) {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
      <main>{content}</main>
    </div>
  );
}
<Layout sidebar={<Sidebar />} content={<Dashboard />} />
```

---

## 13. Recommended Project Structure

```
src/
├── components/          # reusable, presentational components
│   ├── Button.jsx
│   └── Modal.jsx
├── features/              # feature-based folders (co-locate logic + UI)
│   └── auth/
│       ├── LoginForm.jsx
│       ├── useAuth.js
│       └── authSlice.js
├── pages/                    # route-level components
│   ├── Home.jsx
│   └── Dashboard.jsx
├── hooks/                       # shared custom hooks
│   └── useDebounce.js
├── context/                        # context providers
│   └── ThemeContext.jsx
├── services/                          # API calls
│   └── api.js
├── utils/                                # helper functions
├── App.jsx
└── main.jsx
```

---

## 14. Quick Reference Cheat Sheet

| Hook | Purpose |
|---|---|
| `useState` | local component state |
| `useEffect` | side effects (fetch, subscriptions, DOM) |
| `useContext` | consume shared context value |
| `useRef` | mutable value / DOM reference, no re-render on change |
| `useMemo` | memoize a computed value |
| `useCallback` | memoize a function reference |
| `useReducer` | complex state logic via reducer |
| `useLayoutEffect` | synchronous DOM measurement before paint |
| `useId` | stable unique IDs for accessibility |
| `useTransition` | mark state updates as non-urgent |
| `useDeferredValue` | defer re-rendering of a value |

| Concept | Key Idea |
|---|---|
| Props | read-only, parent → child |
| State | mutable (via setter), owned by component |
| Lifting state up | move shared state to common ancestor |
| Prop drilling | passing props through uninvolved intermediaries — fix with Context |
| Controlled component | form value driven by React state |
| Reconciliation | React's diffing algorithm, relies on stable `key` |
| Error boundary | class component catching render errors in children |
