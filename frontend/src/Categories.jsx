import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "./api";

export default function Categories() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  async function load() {
    const { data } = await api.get("/api/categories");
    setRows(data);
  }
  useEffect(() => { load(); }, []);

  function startEdit(row) {
    setEditing(row.id);
    setValue("name", row.name);
    setValue("description", row.description || "");
  }
  function cancelEdit() {
    reset();
    setEditing(null);
  }

  async function onSubmit(form) {
    try {
      if (editing) {
        await api.put(`/api/categories/${editing}`, form);
      } else {
        await api.post("/api/categories", form);
      }
      reset();
      setEditing(null);
      load();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  }

  async function remove(id) {
    if (!confirm("Delete category?")) return;
    try {
      await api.delete(`/api/categories/${id}`);
      load();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    }
  }

  return (
    <div>
      <h3>Categories</h3>

      <form onSubmit={handleSubmit(onSubmit)} style={{display:"grid", gap:8, maxWidth:420}}>
        <input placeholder="Name" {...register("name", {required:true})}/>
        <input placeholder="Description" {...register("description")}/>
        <div style={{display:"flex", gap:8}}>
          <button type="submit">{editing ? "Save" : "Add"}</button>
          {editing && <button type="button" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      <table border="1" cellPadding="6" style={{marginTop:16, width:"100%"}}>
        <thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Action</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.description}</td>
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
