import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "./api";

export default function Companies() {
  const [rows, setRows] = useState([]);
  const [cats, setCats] = useState([]);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  async function load() {
    const [c1, c2] = await Promise.all([
      api.get("/api/companies"),
      api.get("/api/categories"),
    ]);
    setRows(c1.data);
    setCats(c2.data);
  }
  useEffect(() => { load(); }, []);

  function startEdit(row) {
    setEditing(row.id);
    setValue("name", row.name);
    setValue("category_id", String(row.category_id));
    setValue("ticker_symbol", row.ticker_symbol);
    setValue("description", row.description || "");
  }
  function cancelEdit() {
    reset();
    setEditing(null);
  }

  async function onSubmit(form) {
    try {
      form.category_id = Number(form.category_id);
      if (editing) {
        await api.put(`/api/companies/${editing}`, form);
      } else {
        await api.post("/api/companies", form);
      }
      reset();
      setEditing(null);
      load();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
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
        <div style={{display:"flex", gap:8}}>
          <button type="submit">{editing ? "Save" : "Add"}</button>
          {editing && <button type="button" onClick={cancelEdit}>Cancel</button>}
        </div>
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
              <td style={{display:"flex", gap:8}}>
                <button onClick={() => startEdit(r)}>Edit</button>
                <button onClick={() => remove(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
