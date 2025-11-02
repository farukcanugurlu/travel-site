// src/pages/ToursAdmin.tsx
import { useEffect, useState } from "react";
import { mockToursRepo } from "../repo/mockToursRepo";
import type { Tour, NewTour, UpdateTour } from "../types/tour";
import TourForm from "../components/admin/TourForm";

const ToursAdmin = () => {
  const [items, setItems] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Tour | null>(null);
  const [visibleForm, setVisibleForm] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const list = await mockToursRepo.list();
    setItems(list);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (data: NewTour) => {
    await mockToursRepo.create(data);
    setVisibleForm(false);
    await refresh();
  };

  const handleUpdate = async (id: string, patch: UpdateTour) => {
    await mockToursRepo.update(id, patch);
    setEditing(null);
    await refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tour?")) return;
    await mockToursRepo.remove(id);
    await refresh();
  };

  return (
    <div className="container pt-80 pb-80">
      <h2 className="mb-20">Tours Admin</h2>

      {!visibleForm && !editing && (
        <button className="tg-btn-header" onClick={() => setVisibleForm(true)}>
          + Add Tour
        </button>
      )}

      {/* Create form */}
      {visibleForm && (
        <TourForm
          mode="create"
          onCancel={() => setVisibleForm(false)}
          onCreate={handleCreate}
        />
      )}

      {/* Edit form */}
      {editing && (
        <TourForm
          mode="edit"
          initial={editing}
          onCancel={() => setEditing(null)}
          onEdit={(patch) => handleUpdate(editing.id, patch)}
        />
      )}

      <hr className="my-30" />

      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p>No tours yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table tg-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Destination</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Published</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.destination}</td>
                  <td>${t.price}</td>
                  <td>{t.duration}</td>
                  <td>{t.published ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="p-btn mr-10"
                      onClick={() => setEditing(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="p-btn danger"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ToursAdmin;
