import React from "react";
import { Todo } from "../../../typings";

type PageProps = {
  params: {
    todoId: string;
  };
};

const fetchTodo = async (todoId: string) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`
  );
  const todo: Todo = await res.json();
  console.log(todo); // This will only be visible in the terminal as it is server side. It won't be visible in the browser console.
  return todo;
};

async function TodoPage({ params: { todoId } }: PageProps) {
  const todo = await fetchTodo(todoId);
  return (
    <div className="p-10 bg-yellow-200 border-2 m-2 shadow-lg">
      <p>
        #{todo.id}: {todo.title}
      </p>
      <p className="border-t border-black mt-5 text-right">
        Completed: {todo.completed ? "Yes" : "No"}
      </p>
      <p>By User: {todo.userId}</p>
    </div>
  );
}

export default TodoPage;
