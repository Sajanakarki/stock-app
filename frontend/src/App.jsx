import { useState } from "react";
import Categories from "./Categories.jsx";
import Companies from "./Companies.jsx";
import "./App.css";

export default function App(){
  const [tab, setTab] = useState("categories");

  return (
    <div className="container">
      <h1 className="app-title">Stock App</h1>

      <div className="tabs">
        <button
          className="tab"
          aria-selected={tab === "categories"}
          onClick={() => setTab("categories")}
        >
          Categories
        </button>
        <button
          className="tab"
          aria-selected={tab === "companies"}
          onClick={() => setTab("companies")}
        >
          Companies
        </button>
      </div>

      {tab === "categories" ? <Categories/> : <Companies/>}
    </div>
  );
}
