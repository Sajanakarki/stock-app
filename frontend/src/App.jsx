import { useState } from "react";
import Categories from "./Categories.jsx";
import Companies from "./Companies.jsx";

export default function App() {
  const [tab, setTab] = useState("categories");

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "Inter, system-ui" }}>
      <h2 style={{ marginBottom: 16 }}>Stock App</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button onClick={() => setTab("categories")} disabled={tab === "categories"}>Categories</button>
        <button onClick={() => setTab("companies")} disabled={tab === "companies"}>Companies</button>
      </div>

      {tab === "categories" ? <Categories /> : <Companies />}
    </div>
  );
}
