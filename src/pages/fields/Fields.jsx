import React, { useState } from "react";
import "./Fields.css";
import { Edit, Map, MapIcon, MapPin, Plus, Trash } from "lucide-react";

// useData hook — backend o'rniga oddiy mock (sizning haqiqiy kontekstingiz bilan almashtiriladi)
const useData = () => {
  const fields = [
    {
      id: "1",
      name: "Al Quoz Field",
      location: "Dubai",
      status: "Active",
      pricePerHour: 3,
      image: "imgs/fileds1.jpeg",
      mapLink: "https://www.google.com/maps",
    },
    {
      id: "2",
      name: "JLT Turf",
      location: "Dubai",
      status: "Maintenance",
      pricePerHour: 4,
      image: "imgs/fileds2.jpeg",
      mapLink: "https://www.google.com/maps",
    },
  ];

  const bookings = [
    { id: "b1", fieldId: "1", price: 3 },
    { id: "b2", fieldId: "1", price: 3 },
    { id: "b3", fieldId: "1", price: 3 },
  ];

  const currentAdmin = { role: "Super Admin" };

  const updateField = async (field) => {
    console.log("Yangilandi:", field);
    await new Promise((r) => setTimeout(r, 500));
  };

  const addField = async (field) => {
    console.log("Qoshildi:", field);
    await new Promise((r) => setTimeout(r, 500));
  };

  const deleteField = async (id) => {
    console.log("O'chirildi:", id);
    await new Promise((r) => setTimeout(r, 500));
  };

  return { fields, bookings, currentAdmin, updateField, addField, deleteField };
};

const Fields = () => {
  const { fields, updateField, addField, deleteField, bookings, currentAdmin } =
    useData();

  const [editingField, setEditingField] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canManageFields = [
    "Founder & CEO",
    "Super Admin",
    "Operations Manager",
  ].includes(currentAdmin?.role || "");

  const getFieldStats = (fieldId) => {
    const fieldBookings = bookings.filter((b) => b.fieldId === fieldId);
    const totalAvailableSlotsPerWeek = 12;
    const occupancyRate =
      totalAvailableSlotsPerWeek > 0
        ? (fieldBookings.length / totalAvailableSlotsPerWeek) * 100
        : 0;

    return {
      count: fieldBookings.length,
      revenue: fieldBookings.reduce((acc, b) => acc + b.price, 0),
      occupancy: Math.round(occupancyRate),
    };
  };

  const handleSave = async () => {
    if (!canManageFields || !editingField) return;
    setIsSaving(true);
    try {
      if (isCreating) {
        await addField(editingField);
      } else {
        await updateField(editingField);
      }
      setEditingField(null);
      setIsCreating(false);
    } catch (error) {
      alert("Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNew = () => {
    if (!canManageFields) return;
    const newField = {
      id: "",
      name: "Yangi maydon",
      location: "Dubai",
      status: "Active",
      pricePerHour: 3,
      image: "https://via.placeholder.com/400x250",
      mapLink: "",
    };
    setEditingField(newField);
    setIsCreating(true);
  };

  const handleDelete = async (id) => {
    if (!canManageFields) return;
    if (
      window.confirm(
        "Bu maydonni o'chirishni xohlaysizmi? Foydalanuvchi ilovasida darhol yangilanadi."
      )
    ) {
      try {
        await deleteField(id);
      } catch (err) {
        alert("O'chirishda xatolik.");
      }
    }
  };

  return (
    <div className="fields-container">
      <div className="fields_header">
        <h2>All Locations (Live)</h2>
        {canManageFields && (
          <button onClick={handleAddNew} className="fields_btn-add">
            <Plus /> Add New Field
          </button>
        )}
      </div>

      <div className="fields_grid">
        {fields.length === 0 && (
          <div className="no-fields">Field not found in database.</div>
        )}

        {fields.map((field) => {
          const stats = getFieldStats(field.id);
          return (
            <div key={field.id} className="fields_card">
              <div className="fields_card-img">
                <img
                  src={field.image || "https://via.placeholder.com/400x250"}
                  alt={field.name}
                />
                <span
                  className={`fields_status-badge ${
                    field.status === "Active"
                      ? "status-active"
                      : "status-maintenance"
                  }`}
                >
                  {field.status === "Active" ? "Active" : "Repair"}
                </span>
              </div>
              <div className="fields_card-body">
                <div className="fields_card-title">
                  <h3>{field.name}</h3>
                  {canManageFields && (
                    <div className="fields_actions">
                      <button
                        onClick={() => {
                          setEditingField(field);
                          setIsCreating(false);
                        }}
                        className="fields_btn-icon"
                        title="Edit"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleDelete(field.id)}
                        className="fields_btn-icon fields_btn-delete"
                        title="Delete"
                      >
                        <Trash />
                      </button>
                    </div>
                  )}
                </div>
                <div className="fields_location">
                  <span>
                    <MapPin /> {field.location}
                  </span>
                  {field.mapLink && (
                    <a
                      href={field.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fields_map-link"
                    >
                      <Map /> Xarita
                    </a>
                  )}
                </div>

                <div className="fields_stats">
                  <div className="fields_stat-box">
                    <div className="fields_stat-label">bookings</div>
                    <div className="fields_stat-value">{stats.count}</div>
                  </div>
                  <div className="fields_stat-box">
                    <div className="fields_stat-label">Booked</div>
                    <div className="fields_stat-value">{stats.occupancy}%</div>
                  </div>
                </div>

                <div className="fields_price-section">
                  <div>
                    <div className="fields_price-label">Hourly rate</div>
                    <div className="fields_price-value">
                      {field.pricePerHour} Credit
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {editingField && (
        <div
          className="fields_modal-overlay"
          onClick={() => !isSaving && setEditingField(null)}
        >
          <div className="fields_modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              {isCreating
                ? "Yangi maydon yaratish"
                : `Tahrirlash: ${editingField.name}`}
            </h3>
            <div className="fields_form-group">
              <label>Maydon nomi</label>
              <input
                type="text"
                value={editingField.name}
                onChange={(e) =>
                  setEditingField({ ...editingField, name: e.target.value })
                }
              />
            </div>
            <div className="fields_form-group">
              <label>Manzil</label>
              <input
                type="text"
                value={editingField.location}
                onChange={(e) =>
                  setEditingField({ ...editingField, location: e.target.value })
                }
              />
            </div>
            <div className="fields_form-group">
              <label>Soatlik narx (kredit)</label>
              <input
                type="number"
                value={editingField.pricePerHour}
                onChange={(e) =>
                  setEditingField({
                    ...editingField,
                    pricePerHour: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="fields_form-group">
              <label>Xarita havolasi</label>
              <input
                type="text"
                value={editingField.mapLink || ""}
                onChange={(e) =>
                  setEditingField({ ...editingField, mapLink: e.target.value })
                }
                placeholder="https://maps.google.com..."
              />
            </div>
            <div className="fields_form-group">
              <label>Holati</label>
              <select
                value={editingField.status}
                onChange={(e) =>
                  setEditingField({ ...editingField, status: e.target.value })
                }
              >
                <option value="Active">Faol</option>
                <option value="Maintenance">Ta'mirlash</option>
              </select>
            </div>
            <div className="fields_modal-actions">
              <button
                onClick={() => setEditingField(null)}
                className="btn-cancel"
                disabled={isSaving}
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                className="btn-save"
                disabled={isSaving}
              >
                {isSaving && <span className="fields_spinner"></span>}
                {isCreating ? "Yaratish" : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fields;
