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
//   throw new Error("Whoops!!! Something broke!")
  const data = await res.json();
  return data;
};

async function SearchResults({ params: { searchTerm } }: PageProps) {
  // get the searchterm and use it to fetch results using an external API which will give us search results
  const searchResults: SearchResult = await search(searchTerm);
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
