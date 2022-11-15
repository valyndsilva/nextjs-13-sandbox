import React from "react";
import { Todo } from "../../../../typings";
import { notFound } from "next/navigation";

export const dynamicParams = true;

type PageProps = {
  params: {
    todoId: string;
  };
};

const fetchTodo = async (todoId: string) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`,
    { next: { revalidate: 60 } }
  );
  const todo: Todo = await res.json();
  console.log(todo); // This will only be visible in the terminal as it is server side. It won't be visible in the browser console.
  return todo;
};

async function TodoPage({ params: { todoId } }: PageProps) {
  const todo = await fetchTodo(todoId);

  if (!todo.id) return notFound();

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

//You cannot use SSG or ISR if you are not telling NextJS how to fetch the initial pages to go ahead and render. Instead of getStaticPaths in NextJS 12  we use generateStaticParams() to do this in NextJS 13.
export async function generateStaticParams() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/");
  const todos: Todo[] = await res.json();
  //Just pre-build first 10 pages to avoid being rate limited by DEMO TYPICODE API
  const trimmedTodos = todos.splice(0, 10);
  return trimmedTodos.map((todo) => ({
    todoId: todo.id.toString(),
  }));
}
