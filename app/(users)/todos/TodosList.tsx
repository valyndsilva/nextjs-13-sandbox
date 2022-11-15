import Link from "next/link";
import React from "react";
import { Todo } from "../../../typings";

const fetchTodos = async () => {
  // Timeout for random number of seconds between 1 and 5
  const timeout = Math.floor(Math.random() * 5 + 1) * 1000;
  await new Promise((resolve) => setTimeout(resolve, timeout));
  
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/");
  const todos: Todo[] = await res.json();
  console.log(todos); // This will only be visible in the terminal as it is server side. It won't be visible in the browser console.
  return todos;
};

async function TodosList() {
  const todos = await fetchTodos();

  return (
    <>
      {todos.map((todo) => (
        <p key={todo.id}>
          <Link href={`/todos/${todo.id}`}>Todo: {todo.id}</Link>
        </p>
      ))}
    </>
  );
}

export default TodosList;
