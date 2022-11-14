# NextJS 13 - Quick Reference Sandbox

## Setup NextJS 13 project with Tailwind CSS:

npx create-next-app -e with-tailwindcss nextjs-13-sandbox  
cd nextjs-13-sandbox  
git init  
git remote add origin https://github.com/valyndsilva/nextjs-13-sandbox.git
git branch -M main  
git push -u origin main
npm run dev

## [NextJS 13 folder structure setup:](https://beta.nextjs.org/docs/upgrade-guide)

### Create app directory in root:

Anything in the app directory is a server component.

### Enable app directory in next.config.js:

Use the experimental flag to enable app directory in your NextJs project.

```
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
};
```

Next, restart your nextjs server.

```
npm run dev
```

### Update tailwind.config.js to include files form app directory:

```
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### File Conventions

There are 7 different File Conventions (reserved keywords) to create a file in the app directory:

- Layout
- Page
- Loading
- Error
- Template
- Head
- Not Found

Inside the app directory, folders are used to define routes. Each folder represents a route segment that maps to a URL segment. To create a nested route, you can nest folders inside each other.

Ex: app/dashboard/settings > root segment/segment/leaf segment

A special page.js file is used to make route segments publicly accessible.
app/dashboard/settings has a page.tsx file
URL path will be example.com/dashboard/settings

/dashboard/analytics doesn't have a page.tsx file
URL path is not publicly accessible because it does not have a corresponding page.js file.

## App Directory Setup:

### Creating the index/homepage in app directory:

In app directory we create a page.tsx file using rfce:

```
import React from "react";

function page() {
  return <div>Homepage</div>;
}

export default page;

```

You receive an error:

```
Conflicting app and page file was found, please remove the conflicting files to continue:
error -   "pages/index.tsx" - "app/page.tsx"
```

Now delete the index.tsx file in pages directory.

### Create a [layout.tsx](https://beta.nextjs.org/docs/api-reference/file-conventions/layout) in the app directory:

A layout is UI that is shared between routes.

- children: (required) React component containing the route segments the layout is wrapping.
- params: (optional) The dynamic route parameters object from the root segment down to that layout.

```
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}

```

### Enable Tailwind CSS in the project:

Move "import '../styles/globals.css' from pages/\_app.tsx to app/layout.tsx.

```
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
```

Next test if Tailwind CSS is enabled by adding a few tailwind styles in page.tsx:

```
import React from "react";

function page() {
  return <div className="text-red-500">Homepage</div>;
}

export default page;
```

### Adding components to the layout.tsx:

You can add different components to the layout to make them available throughout all the pages on the site.

Ex: Create a Header.tsx componet in app directory:

```
import React from "react";

function Header() {
  return (
    <header className="p-5 bg-teal-500">
      <p>Header</p>
    </header>
  );
}

export default Header;

```

Next in layout.tsx:

```
import "../styles/globals.css";
import Header from "./Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Header />
      {children}
    </section>
  );
}
```

In NextJS 12 we added the page routes in the pages directory. From NextJS 13 onwards we follow a different folder structure using the app directory.

## Building a Todo App with Server Side Components:

### Create a todos folder in the app directory.

This folder has access to all the 7 file conventions.

In todos/page.tsx:

```
import React from "react";

function Todos() {
  return <div>Todos</div>;
}

export default Todos;

```

### Update app/Header.tsx:

```
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <header className="p-5 bg-teal-500">
      <Link href="/" className="px-2 py-1 bg-white text-teal-500 rounded-lg">
        Home
      </Link>
    </header>
  );
}

export default Header;
```

The app directory lets you keep components next to the level the are required. You can still have a components folder in your project however out this directory it will not be a server component.

Typically in NextJS 12 you were not able to make an await request inside of functional components. You needed to have a piece of state and you were not allowed to make your functional components async.
<b>In NextJS 13 it is possible to now fetch a the top-level in react because by default it is a server component.</b>

### Create in the root typings.d.ts:

```
export type Todo = {
  userId: number;
  id: number;
  titles: string;
  completed: boolean;
};
```

### In app/todos create TodosList.tsx:

```
import Link from "next/link";
import React from "react";
import { Todo } from "../../typings";

const fetchTodos = async () => {
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

```

The Link component will try to pre-fecth the todoid pages in advanced. We need to create the pages so nextJS know what to do with the route or we receive errors.

### Create a Dynamic Route inside the new app directory:

In NextJS 12 we used to create a file inside of a folder with [id].tsx in the pages directory.
In NextJS 13 we create a folder in todos folder called [todoId] and in it a file page.tsx.

In app/todos/[todoId]/pages.tsx:

```
import React from "react";

type PageProps = {
  params: {
    todoId: string;
  };
};

function TodoPage({ params: { todoId } }: PageProps) {
  return <div>TodoPage:{todoId}</div>;
}

export default TodoPage;

```

The route http://localhost:3000/todos/9 should work.

### Update todos/page.tsx to include TodosList.tsx

```
import React from "react";
import TodosList from "./TodosList";

function Todos() {
  return (
    <div>
      {/*@ts-ignore*/}
      <TodosList />
    </div>
  );
}

export default Todos;

```

If you want to use a click Handler, hook or any UI element that needs binding to the element you need to use a client side component.

### Using the "new" Server Side Components with async/await to Fetch Todos:

In app/todos/[todoId]/pages.tsx:

```
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

```

If you run "npm run build" you will notice the /todos/[todoId] page is a Sevrer-side rendered page.

```
 λ /todos/[todoId]
λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
```

In NextJS 13 they have upgraded the fetch API to use a 2nd argument.

- If we wanted to force SSR method: {cache:'no-cache'}

```
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {cache:'no-cache'});
```

- If we wanted to force SSG method: {cache:'force-cache'}

```
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {cache:'force-cache'});
```

- If we wanted to force ISR method: {next:{revalidate:60}}

```
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {next:{revalidate:60}});
```
