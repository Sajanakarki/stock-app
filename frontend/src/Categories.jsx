import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "./api";

const LIST_URL = "/api/categories";

export default function Categories() {
  const [rows, setRows] = useState([]);
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: { id: "", name: "", description: "" },
  });
  const editingId = watch("id"); 

  // ---- data ----
  async function load() {
    const { data } = await api.get(LIST_URL);
    setRows(data);
  }
  useEffect(() => { load(); }, []);

  // ---- create / update / delete ----
  async function create(form) {
    await api.post("/api/categories", form);
    reset();
    load();
  }
  async function update(form) {
    await api.put(`/api/categories/${form.id}`, form);
    reset();
    load();
  }
  async function remove(id) {
    if (!confirm("Delete this category?")) return;
    await api.delete(`/api/categories/${id}`);
    // if we deleted the one we were editing, clear the form
    if (String(id) === String(editingId)) reset();
    load();
  }

  // ---- edit helpers ----
  function startEdit(row) {
    setValue("id", row.id);
    setValue("name", row.name);
    setValue("description", row.description ?? "");
    // focus UX (optional)
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function cancelEdit() {
    reset(); // back to add mode
  }

  return (
    <section className="card">
      <h2>Categories</h2>

      <form
        className="form"
        onSubmit={handleSubmit((f) => (f.id ? update(f) : create(f)))}
      >
        <input type="hidden" {...register("id")} />
        <input placeholder="Name" {...register("name", { required: true })} />
        <input placeholder="Description" {...register("description")} />

        <div className="row actions">
          <button className="btn btn--primary" type="submit">
            {editingId ? "Save" : "Add"}
          </button>
          {editingId && (
            <button
              className="btn btn--ghost"
              type="button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th style={{ width: 90 }}>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th style={{ width: 220 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.description}</td>
              <td>
                <div className="row">
                  <button
                    className="btn btn--secondary"
                    type="button"
                    onClick={() => startEdit(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn--danger"
                    type="button"
                    onClick={() => remove(r.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
