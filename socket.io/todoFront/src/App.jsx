import { useEffect, useState } from "react";
import socket from "./socket";
import "./App.css";

function App() {

  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {

    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("update", (data) => {
      setTodos(data);
    });

    return () => {
      socket.off("update");
    };

  }, []);

  const addTodo = () => {

    if (text.trim() === "") return;

    socket.emit("newItem", text);

    setText("");

  };

  const updateTodo = (id) => {

    socket.emit("updateObj", {
      id,
      value: text,
    });

    setText("");
    setEditingId(null);

  };

  const deleteTodo = (id) => {

    socket.emit("deleteItem", id);

  };

  return (
    <div className="container">

      <h1>Socket Todo App</h1>

      <div className="input-box">

        <input
          type="text"
          placeholder="Enter Todo"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {editingId ? (
          <button onClick={() => updateTodo(editingId)}>
            Update
          </button>
        ) : (
          <button onClick={addTodo}>
            Add
          </button>
        )}

      </div>

      <ul>

        {todos.map((todo) => (

          <li key={todo.id}>

            <span>{todo.value}</span>

            <div>

              <button
                onClick={() => {
                  setEditingId(todo.id);
                  setText(todo.value);
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>

            </div>

          </li>

        ))}

      </ul>

    </div>
  );
}

export default App;