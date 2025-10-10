import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "./api";

const LIST_URL = "/api/categories";

export default function Categories(){
  const [rows, setRows] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  async function load(){
    const { data } = await api.get(LIST_URL);
    setRows(data);
  }
  useEffect(()=>{ load(); }, []);

  async function onSubmit(form){
    await api.post("/api/categories", form);
    reset();
    load();
  }
  async function onDelete(id){
    if(!confirm("Delete this category?")) return;
    await api.delete(`/api/categories/${id}`);
    load();
  }

  return (
    <section className="card">
      <h2>Categories</h2>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Name" {...register("name")} required />
        <input placeholder="Description" {...register("description")} />
        <div className="actions">
          <button className="btn btn--primary" type="submit">Add</button>
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th style={{width:90}}>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th style={{width:140}} className="right">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.description}</td>
              <td className="right">
                <button className="btn btn--danger" onClick={()=>onDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
