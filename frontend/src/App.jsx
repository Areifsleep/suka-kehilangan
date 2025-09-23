import { useState } from "react";

import "./styles/global.css";
import viteLogo from "/vite.svg";
import reactLogo from "./assets/react.svg";
import { Button } from "./components/ui/button";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-5xl mx-auto p-8 text-center">
      {/* Logo Section */}
      <div className="flex justify-center gap-8">
        <a
          href="https://vite.dev"
          target="_blank"
        >
          <img
            src={viteLogo}
            alt="Vite logo"
            className="h-24 transition hover:drop-shadow-[0_0_2em_#646cffaa]"
          />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
        >
          <img
            src={reactLogo}
            alt="React logo"
            className="h-24 transition hover:drop-shadow-[0_0_2em_#61dafbaa] animate-spin-slow"
          />
        </a>
      </div>

      {/* Title */}
      <h1 className="mt-8 text-4xl font-bold">Vite + React + Tailwind</h1>

      {/* Card Section */}
      <div className="mt-6 p-6 border rounded-xl shadow bg-white/5">
        <Button onClick={() => setCount((count) => count + 1)}>count is {count}</Button>
        <p className="mt-4 text-gray-600">
          Edit <code className="font-mono">src/App.jsx</code> and save to test HMR
        </p>
      </div>

      {/* Footer */}
      <p className="mt-6 text-gray-500">Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default App;
