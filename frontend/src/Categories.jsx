import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "./api";

const LIST_URL = "/api/category";

export default function Categories() {
  const [rows, setRows] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  async function load() {
    try {
      const { data } = await api.get(LIST_URL);
      setRows(data);
    } catch (e) {
      console.error("Load categories failed:", e?.response?.data || e.message);
      setRows([{ id: "ERR", name: "Failed to load (check console)", description: "" }]);
    }
  }
  useEffect(() => { load(); }, []);

  async function onSubmit(form) {
    try {
      await api.post("/api/categories", form);
      reset();
      load();
    } catch (e) {
      alert("Create failed: " + (e?.response?.data?.error || e.message));
    }
  }

  return (
    <div>
      <h3>Categories</h3>
      <form onSubmit={handleSubmit(onSubmit)} style={{display:"grid", gap:8, maxWidth:420}}>
        <input placeholder="Name" {...register("name", {required:true})}/>
        <input placeholder="Description" {...register("description")}/>
        <button type="submit">Add</button>
      </form>

      <table border="1" cellPadding="6" style={{marginTop:16, width:"100%"}}>
        <thead><tr><th>ID</th><th>Name</th><th>Description</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{r.description}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
