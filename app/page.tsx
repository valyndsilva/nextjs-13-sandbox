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
