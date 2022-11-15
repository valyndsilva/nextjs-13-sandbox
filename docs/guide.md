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
  return(
  <html>
    <body>
        {children}
    </body>
  </html>
  )
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
  return(
  <html>
    <body>
        {children}
    </body>
  </html>
  )
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
    <html>
    <body>
      <Header />
      {children}
    </body>
    </html>
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

If you run "npm run build" you will notice the /todos/[todoId] page is a Server-side rendered page.

```
λ /todos/[todoId]
λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
```

### Different Rendering methods:

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

You cannot use SSG or ISR if you are not telling NextJS how to fetch the initial pages to go ahead and render.
Instead of getStaticPaths we use generateStaticParams() to do this.

Update app/todos/[todoId]/pages.tsx fetch request to use ISR and revalidate after every 60 seconds and also use generateStaticParams:

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
    `https://jsonplaceholder.typicode.com/todos/${todoId}`,
    { next: { revalidate: 60 } }
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

export async function generateStaticParams() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/");
  const todos: Todo[] = await res.json();
  //Just pre-build first 10 pages to avoid being rate limited by DEMO TYPICODE API
  const trimmedTodos = todos.splice(0, 10);
  return trimmedTodos.map((todo) => ({
    todoId: todo.id.toString(),
  }));
}

```

If you run "npm run build" you will notice the todos/[todoId]/ is SSG rendered.

```
● /todos/[todoId]                        154 B          69.4 kB
    ├ /todos/1
    ├ /todos/2
    ├ /todos/3
    └ [+7 more paths]
 ●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
```

In NextJS 12 there was a fallback option in ISR. If the SSG page was not generated at build time we could attempt to SSR the page and cache it if we get a response. If there was no response it returns a 404.

When you run "npm run dev" you will notice the http://localhost:3000/todos/1 loads very fast until todo 10 as it was SSG.
But from 10-... it SSR, then caches it.

In NextJS 13 we have the ability to dynamically SSR and cache the pages that were not SSG at build time. This is a very powerful option. The ISR option let's you revalidate the pages using the { next: { revalidate: 60 } }.
So after 60 seconds has elapsed it revalidates the cache and rebuild.
A user that comes before the 60 seconds has elapsed get's served the old version after the 60 seconds it SSR the new version of the page and replaces the cache.

### notFound function and dynamicParams:

We also have the option to SSR pages that were not created when the site was SSG using dynamicParams and notFound.

```
import React from "react";
import { Todo } from "../../../typings";
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

```

If you go to a page that does not exist ex:http://localhost:3000/todos/250 you get a "404 | This page could not be found."

### Create a custom not-found.tsx page in app/todos/[todoId]/:

```
import React from "react";

function NotFound() {
  return <div>Uh oh! Couldn't find requested resource</div>;
}

export default NotFound;

```

#### Note:

When you run in developer mode: "npm run dev" it always SSR the page.
The only way to test your SSG is to use "npm run build" and then "npm run start" to see the effect of the SSG site.

### Create a layout.tsx in the app/todos directory:

```
import TodosList from "./TodosList";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex">
      <div>
        {/*@ts-ignore*/}
        <TodosList />
      </div>
      <div className="flex-1">{children}</div>
    </main>
  );
}
```

Update the app/todos/page.tsx:

```
import React from "react";
import TodosList from "./TodosList";

function Todos() {
  return (
    <div>
      <h1> Todos will be listed here...</h1>
    </div>
  );
}

export default Todos;

```

In this case only the children portion are re-rendered.

## Implementing SSR with a Search Example:

- Use the loading and error file
- Create a client component if you need to have an interactivity

### Create a search route:

In app directory create a app/search/page.tsx:

```
import React from "react";

function Search() {
  return <div>Search</div>;
}

export default Search;

```

In app directory create a app/search/Search.tsx component:

```
import React from "react";

function Search() {
  return <div>Search Comp</div>;
}

export default Search;

```

In app directory create a app/search/layout.tsx:

```
import Search from "./Search";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex space-x-4 divide-x-2 p-5">
      <div>
        <h1>Search</h1>
      </div>
      <div className="flex-1 pl-5">
        <Search />
        <div>{children}</div>
      </div>
    </main>
  );
}

```

### Adding Client Components:

Client Components are rendered on the client. With Next.js 13, Client Components can also be pre-rendered on the server and hydrated on the client.

To use a Client Component, create a file inside app and add the "use client" directive at the top of the file (before any imports).

You only need to mark components as 'use client' when they use client hooks such as useState or useEffect. It's best to leave components that do not depend on client hooks without the directive so that they can automatically be rendered as a Server Component when they aren't imported by another Client Component. This helps ensure the smallest amount of client-side JavaScript.

#### When to use Client components:

- Add interactivity and event listeners (onClick(), onChange(), etc)
- Use State and Lifecycle Effects (useState(), useReducer(), useEffect(), etc)
- Use browser-only APIs
- Use custom hooks that depend on state, effects, or browser-only APIs
- Use React Class components

#### Update app/search/Search.tsx and set it as a Client-side component:

```
"use client";

import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";

function Search() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch("");
    router.push(`/search/${search}`);
  };
  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={search}
        placeholder="Enter the search term"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="submit"
        className="bg-teal-500 text-white font-bold py-2 px-4 rounded-lg"
      >
        Search
      </button>
    </form>
  );
}

export default Search;

```

### Register on [Serp API](https://serpapi.com/):

Register, login and get your private key to use Serp API in your project.
Create a .env.local:

```
SERP_API_KEY=......
```

### Add a searchTerm route:

Create a [searchTerm] folder and in it page.tsx.

In app/search/[searchTerm]/page.tsx:

```
import React from "react";
import { resourceLimits } from "worker_threads";

interface PageProps {
  params: {
    searchTerm: string;
  };
}

interface SearchResult {
  organic_results: [
    {
      position: number;
      title: string;
      link: string;
      thumbnail: string;
      snippet: string;
    }
  ];
}

const search = async (searchTerm: string) => {
  const res = await fetch(
    `https://serpapi.com/search.json?q=${searchTerm}&api_key=${process.env.SERPAPI_API_KEY}`
  );
  const data = await res.json();
  return data;
};

async function SearchResults({ params: { searchTerm } }: PageProps) {
  // get the searchterm and use it to fetch results using an external API which will give us search results
  const searchResults = await search(searchTerm);
  return (
    <div>
      <p className="text-grey-500 text-sm">You searched for: {searchTerm}</p>
      <ol className="space-y-5 p-5">
        {searchResults.organic_results.map((result) => (
          <li key={result.position} className="list-decimal">
            <p className="font-bold">{result.title}</p>
            <p>{result.snippet}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default SearchResults;

```

Now when you search a term you will get the results but with a delay as it is blocking and then it loads the results onto screen.

<b>Note: </b>
In NextJS 13 we have the loading.tsx and error.tsx file conventions.


### Implementing the "new" Loading State Functionality:

The special file loading.js enables showing an instant loading state from the server while the content of a route segment loads. Once all data fetching in the route segment has finished, the loading UI will be swapped for the page.

In the app/search/[searchTerm]/loading.tsx:

```
import React from "react";

function Loading() {
  return <div>Loading Search Results...</div>;
}

export default Loading;

```

Now when you search a term when it is blocking at that point it will show the loading.tsx placeholder as a fallback and then show the searchResults.

### ### Implementing the "new" Error State Functionality:

In app/search/[searchTerm]/error.tsx:
You can use the boilerplate provided by nextjs [here](https://beta.nextjs.org/docs/api-reference/file-conventions/error)

```
"use client";

// 'use client' marks this page as a Client Component
// https://beta.nextjs.org/docs/rendering/server-and-client-components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <p>Something went wrong!</p>
      <button onClick={() => reset()}>Reset error boundary</button>
    </div>
  );
}

```

To test the error update app/search/[searchTerm]/page.tsx:

In the search function just add a throw new Error as below:

```
const search = async (searchTerm: string) => {
  const res = await fetch(
    `https://serpapi.com/search.json?q=${searchTerm}&api_key=${process.env.SERPAPI_API_KEY}`
  );
   throw new Error("Whoops!!! Something broke!")
  const data = await res.json();
  return data;
};
```

In the developer env you will see the error pop up on the screen. On production the error won't be seen.
You can edit how you wish to design your error page in error.tsx.

### Making Head Name Dynamic:

In app/layout.tsx add the head and title tags:

```
import "../styles/globals.css";
import Header from "./Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>
          NextJS 13 Sandbox
        </title>
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}

```

If you wanted to change it dynamically based on the routes:
Ex: In app/search/head.tsx:

```
import React from "react";

function Head() {
  return (
    <>
      <title>Search Page</title>
    </>
  );
}

export default Head;

```

Now when you visit http://localhost:3000/search you will notice the page title is updated accordingly.

### Adding Route Groups:

Create app/developer/page.tsx:

```
import React from "react";

function Developer() {
  return <div>Developer</div>;
}

export default Developer;

```

Create app/dashboard/page.tsx:

```
import React from "react";

function Dashboard() {
  return <div>Dashboard</div>;
}

export default Dashboard;

```

Now if we have more additional routes and say we want "search" and "todos" routes only for users and "developer" and "dashboard" routes only for admins but we wanted to separate it in our folder structure. This would break the routing system. In NextJS we can use Route Groups to help with this issue using () around the folder name.

So let's create a (users) and (admin) folder in app directory and move the "search" and "todos" routes in (users) and "developer"  and "dashboard" routes in (admin) and update the imports automatically.

Now "npm run dev" and you will see the none of the routes are affected.

If you use Route Groups and want to have different layouts across the (users) and (admin) folders you have to delete the app/layout.tsx and create a new layout.tsx in each folder. But you can only have 1 main page.tsx in the app directory. YOu cannot add separate page.ysx in the route groups.

### Implementing React Suspense Boundary and Streaming:
With Next.js, your UI can be resilient to inconsistent network speeds. Fast requests can be streamed to the client as soon as they are ready. Slow, or inconsistent requests, can be wrapped in a Suspense boundary to show a fallback component until they've completed rendering on the server.

Just like we have server components that get blocked by the await calls we show a loading.tsx state. Similarly using a Suspense we can use a fallback component to do the same.

In app/page.tsx:
```
import React, { Suspense } from "react";
import TodosList from "./(users)/todos/TodosList";

function page() {
  return (
    <div>
      <Suspense
        fallback={<p className="text-teal-500">Loading Todos Block 1...</p>}
      >
        <h1>Loading Todos Block 1 using Suspense Boundary Fallback</h1>
        <div className="flex space-x-2">
          {/*@ts-ignore */}
          <TodosList />
        </div>
      </Suspense>
      <Suspense
        fallback={<p className="text-gray-500">Loading Todos Block 2...</p>}
      >
        <h1>Loading Todos Block 2 using Suspense Boundary Fallback</h1>
        <div className="flex space-x-2">
          {/*@ts-ignore */}
          <TodosList />
        </div>
      </Suspense>
    </div>
  );
}

export default page;


```

Update the TodoList.tsx to have a random timeout:
```
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

```
You can stream UI in Next.js using loading.js (for an entire route segment) or with Suspense boundaries (for more granular loading UI).

Streaming allows you to incrementally send UI from the server to client, progressively rendering components and pages. This enables displaying content faster, without waiting for all data fetching to complete before the UI is rendered.

Streaming is particularly beneficial when there's a slow network request for retrieving data. Rather than the entire page being blocked from rendering due to a slow API or database lookup... 
UI can be incrementally sent to the client. Users don't have to wait for the entire page to load before they can start interacting with it.