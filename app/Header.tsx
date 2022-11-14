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
