import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "./api";

export default function Companies(){
  const [rows, setRows] = useState([]);
  const [cats, setCats] = useState([]);
  const { register, handleSubmit, reset, setValue } = useForm();

  async function load(){
    const [{ data: companies }, { data: categories }] = await Promise.all([
      api.get("/api/companies"),
      api.get("/api/categories"),
    ]);
    setRows(companies);
    setCats(categories);
  }
  useEffect(()=>{ load(); }, []);

  async function onSubmit(f){
    await api.post("/api/companies", f);
    reset();
    load();
  }
  function patchForm(c){
    setValue("name", c.name);
    setValue("category_id", c.category_id);
    setValue("ticker_symbol", c.ticker_symbol);
    setValue("description", c.description);
    setValue("id", c.id); // hidden for update
  }
  async function onUpdate(f){
    await api.put(`/api/companies/${f.id}`, f);
    reset();
    load();
  }
  async function onDelete(id){
    if(!confirm("Delete this company?")) return;
    await api.delete(`/api/companies/${id}`);
    load();
  }

  return (
    <section className="card">
      <h2>Companies</h2>

      <form
        className="form"
        onSubmit={handleSubmit((f)=> f.id ? onUpdate(f) : onSubmit(f))}
      >
        <input type="hidden" {...register("id")} />
        <input placeholder="Name" {...register("name")} required />
        <select {...register("category_id")} required>
          <option value="">Choose category</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Ticker symbol" {...register("ticker_symbol")} />
        <input placeholder="Description" {...register("description")} />
        <div className="row mt-8">
          <button className="btn btn--primary" type="submit">Save</button>
          <button className="btn btn--ghost" type="button" onClick={()=>reset()}>Clear</button>
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th style={{width:90}}>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Ticker</th>
            <th style={{width:180}} className="right">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td><span className="badge">{r.category_name}</span></td>
              <td>{r.ticker_symbol}</td>
              <td className="right">
                <div className="row">
                  <button className="btn" onClick={()=>patchForm(r)}>Edit</button>
                  <button className="btn btn--danger" onClick={()=>onDelete(r.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}