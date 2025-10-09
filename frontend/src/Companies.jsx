import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "./api";

export default function Companies() {
  const [rows, setRows] = useState([]);
  const [cats, setCats] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  async function load() {
    const [c1, c2] = await Promise.all([
      api.get("/api/companies"),
      api.get("/api/categories"),
    ]);
    setRows(c1.data);
    setCats(c2.data);
  }
  useEffect(() => { load(); }, []);

  async function onSubmit(form) {
    try {
      form.category_id = Number(form.category_id);
      await api.post("/api/companies", form);
      reset();
      load();
    } catch (e) {
      alert("Create failed: " + (e?.response?.data?.error || e.message));
    }
  }

  async function remove(id) {
    if (!confirm("Delete company?")) return;
    await api.delete(`/api/companies/${id}`);
    load();
  }

  return (
    <div>
      <h3>Companies</h3>
      <form onSubmit={handleSubmit(onSubmit)} style={{display:"grid", gap:8, maxWidth:520}}>
        <input placeholder="Name" {...register("name", {required:true})}/>
        <select {...register("category_id", {required:true})} defaultValue="">
          <option value="" disabled>Choose category</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Ticker symbol" {...register("ticker_symbol", {required:true})}/>
        <input placeholder="Description" {...register("description")}/>
        <button type="submit">Add</button>
      </form>

      <table border="1" cellPadding="6" style={{marginTop:16, width:"100%"}}>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Category</th><th>Ticker</th><th>Action</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.category_name}</td>
              <td>{r.ticker_symbol}</td>
              <td><button onClick={() => remove(r.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
