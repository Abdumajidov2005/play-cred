import React, { useState } from "react";
import "./SlotManagement.css"; // CSS alohida import qilinadi
import { GoClock, GoPlus } from "react-icons/go";
import { LuRefreshCcw } from "react-icons/lu";
import {
  FaCheck,
  FaCheckCircle,
  FaRegEdit,
  FaTimesCircle,
  FaTrashAlt,
} from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { FaXmark } from "react-icons/fa6";
import { AlertCircleIcon, Save } from "lucide-react";

// Mock useData — real loyihada o'zgartiriladi
const useData = () => {
  const fields = [
    { id: "1", name: "Al Quoz Field", location: "Dubai" },
    { id: "2", name: "JLT Turf", location: "Dubai" },
  ];

  const slotConfigs = [
    {
      id: "SC-1",
      type: "DayOfWeek",
      daysOfWeek: ["Thursday", "Friday", "Saturday"],
      startTime: "19:00",
      endTime: "22:00",
      durationMinutes: 60,
      maxPlayers: 14,
      isActive: true,
      fieldId: "1",
    },
    {
      id: "SC-2",
      type: "SpecificDate",
      date: "2025-12-31",
      startTime: "20:00",
      endTime: "23:59",
      durationMinutes: 90,
      maxPlayers: 20,
      isActive: false,
      fieldId: "2",
    },
  ];

  const currentAdmin = { role: "Super Admin" };

  const addSlotConfig = async (slot) => {
    console.log("Qo'shildi:", slot);
    await new Promise((r) => setTimeout(r, 500));
  };

  const updateSlotConfig = async (slot) => {
    console.log("Yangilandi:", slot);
    await new Promise((r) => setTimeout(r, 500));
  };

  const deleteSlotConfig = async (id) => {
    console.log("O'chirildi:", id);
    await new Promise((r) => setTimeout(r, 500));
  };

  const publishSlotUpdates = async () => {
    console.log("User App ga yangilanish yuborildi");
    await new Promise((r) => setTimeout(r, 1000));
  };

  return {
    slotConfigs,
    fields,
    addSlotConfig,
    updateSlotConfig,
    deleteSlotConfig,
    publishSlotUpdates,
    currentAdmin,
  };
};

const SlotManagement = () => {
  const {
    slotConfigs,
    fields,
    addSlotConfig,
    updateSlotConfig,
    deleteSlotConfig,
    publishSlotUpdates,
    currentAdmin,
  } = useData();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [error, setError] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const canManageSlots = [
    "Founder & CEO",
    "Super Admin",
    "Operations Manager",
  ].includes(currentAdmin?.role || "");

  const handleCreate = () => {
    setEditingSlot({
      type: "DayOfWeek",
      daysOfWeek: ["Thursday", "Friday", "Saturday"],
      startTime: "19:00",
      endTime: "22:00",
      durationMinutes: 60,
      maxPlayers: 14,
      isActive: true,
      fieldId: fields.length > 0 ? fields[0].id : "",
    });
    setError(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (slot) => {
    setEditingSlot({ ...slot });
    setError(null);
    setIsDrawerOpen(true);
  };

  const handleSave = async () => {
    if (
      !editingSlot?.fieldId ||
      !editingSlot?.startTime ||
      !editingSlot?.endTime
    ) {
      setError("Field, start time, and end time are required.");
      return;
    }

    if (editingSlot.startTime >= editingSlot.endTime) {
      setError("Start time must be before end time.");
      return;
    }

    if (
      editingSlot.type === "DayOfWeek" &&
      (!editingSlot.daysOfWeek || editingSlot.daysOfWeek.length === 0)
    ) {
      setError("Please select at least one day.");
      return;
    }

    try {
      if (editingSlot.id) {
        await updateSlotConfig(editingSlot);
      } else {
        const newId = `SC-${Date.now()}`;
        await addSlotConfig({ ...editingSlot, id: newId });
      }
      setIsDrawerOpen(false);
      setEditingSlot(null);
      setError(null);
    } catch (err) {
      setError("An error occurred while saving.");
    }
  };

  const handleDelete = async (slot) => {
    const field = fields.find((f) => f.id === slot.fieldId);
    const confirmMsg = `Do you want to delete this slot rule?\n\nFiled: ${field?.name}\ Time: ${slot.startTime} - ${slot.endTime}\n\nThis will prevent future bookings.`;

    if (window.confirm(confirmMsg)) {
      await deleteSlotConfig(slot.id);
    }
  };

  const toggleDay = (day) => {
    if (!editingSlot?.daysOfWeek) return;
    const currentDays = editingSlot.daysOfWeek;
    if (currentDays.includes(day)) {
      setEditingSlot({
        ...editingSlot,
        daysOfWeek: currentDays.filter((d) => d !== day),
      });
    } else {
      setEditingSlot({ ...editingSlot, daysOfWeek: [...currentDays, day] });
    }
  };

  const handlePublish = async () => {
    if (
      !window.confirm(
        "This action will update the User App. Do you want to continue?"
      )
    )
      return;

    setIsPublishing(true);
    try {
      await publishSlotUpdates();
      alert("User App was successfully updated.");
    } catch (e) {
      alert("An error occurred while updating. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="slot-management-container">
      <div className="slot_header-section">
        <div>
          <h2 className="slot_title">
            <GoClock />
            Slot Management
          </h2>
          <p className="slot_subtitle">
            Configure available booking times for all fields.
          </p>
        </div>
        {canManageSlots && (
          <div className="slot_header-buttons">
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="slot_btn-publish"
            >
              <LuRefreshCcw />
              {isPublishing ? "Updating..." : "Submit Updates to User App"}
            </button>
            <button onClick={handleCreate} className="slot_btn-add">
              <GoPlus />
              Add New Slot Rule
            </button>
          </div>
        )}
      </div>

      {/* Jadval */}
      <div className="table-container">
        {slotConfigs.length === 0 ? (
          <div className="empty-state">
            No active slot rules. Bookings may not work.
          </div>
        ) : (
          <table className="slots-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Schedule Type</th>
                <th>Days/Date</th>
                <th>Time Range</th>
                <th>Duration/Players</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slotConfigs.map((slot) => {
                const field = fields.find((f) => f.id === slot.fieldId);
                return (
                  <tr key={slot.id}>
                    <td className="field-name">{field?.name || "Unknown"}</td>
                    <td>
                      <span
                        className={`type-badge ${
                          slot.type === "DayOfWeek" ? "weekly" : "specific"
                        }`}
                      >
                        {slot.type === "DayOfWeek" ? "Weekly" : "Specific Date"}
                      </span>
                    </td>
                    <td>
                      {slot.type === "DayOfWeek" ? (
                        <div className="days-tags">
                          {slot.daysOfWeek?.map((d) => (
                            <span key={d}>{d.substring(0, 3)}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="date-text">{slot.date}</span>
                      )}
                    </td>
                    <td className="time-range">
                      {slot.startTime} - {slot.endTime}
                    </td>
                    <td className="duration">
                      <div>{slot.durationMinutes} min</div>
                      <div className="small">Max {slot.maxPlayers} players</div>
                    </td>
                    <td className="slot_status">
                      {slot.isActive ? (
                        <span className="slot_status-active">
                          <FaCheckCircle /> Active
                        </span>
                      ) : (
                        <span className="slot_status-inactive">
                          <FaTimesCircle /> Inactive
                        </span>
                      )}
                    </td>

                    <td className="slot_actions">
                      {canManageSlots && (
                        <div className="slot_btns">
                          <button
                            onClick={() => handleEdit(slot)}
                            className="slot_btn-edit"
                            title="Edit"
                          >
                            <FaRegEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(slot)}
                            className="slot_btn-delete"
                            title="Delete"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Drawer (Yon panel) */}
      {isDrawerOpen && editingSlot && (
        <div
          className="slot_drawer-overlay"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>{editingSlot.id ? "Edit rule" : "New slot rule"}</h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="close-btn"
              >
                <FaXmark />
              </button>
            </div>

            <div className="drawer-body">
              <div className="form-group">
                <label>Field</label>
                <select
                  value={editingSlot.fieldId}
                  onChange={(e) =>
                    setEditingSlot({ ...editingSlot, fieldId: e.target.value })
                  }
                >
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Schedule type</label>
                <div className="type-toggle">
                  <button
                    onClick={() =>
                      setEditingSlot({ ...editingSlot, type: "DayOfWeek" })
                    }
                    className={editingSlot.type === "DayOfWeek" ? "active" : ""}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() =>
                      setEditingSlot({ ...editingSlot, type: "SpecificDate" })
                    }
                    className={
                      editingSlot.type === "SpecificDate" ? "active" : ""
                    }
                  >
                    Specific date
                  </button>
                </div>
              </div>

              {editingSlot.type === "DayOfWeek" ? (
                <div className="form-group">
                  <label>Select days</label>
                  <div className="days-grid">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={
                          editingSlot.daysOfWeek?.includes(day)
                            ? "day-selected"
                            : "day-normal"
                        }
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={editingSlot.date || ""}
                    onChange={(e) =>
                      setEditingSlot({ ...editingSlot, date: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="time-grid">
                <div className="form-group">
                  <label>Start time</label>
                  <input
                    type="time"
                    value={editingSlot.startTime}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        startTime: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>End time</label>
                  <input
                    type="time"
                    value={editingSlot.endTime}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        endTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Slot duration (min)</label>
                  <input
                    type="number"
                    value={editingSlot.durationMinutes}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        durationMinutes: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Max players</label>
                  <input
                    type="number"
                    value={editingSlot.maxPlayers}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        maxPlayers: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  checked={editingSlot.isActive}
                  onChange={(e) =>
                    setEditingSlot({
                      ...editingSlot,
                      isActive: e.target.checked,
                    })
                  }
                />
                <span>Rule active</span>
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircleIcon /> {error}
                </div>
              )}
              <div className="drawer-footer">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button onClick={handleSave} className="btn-save">
                  <Save /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotManagement;
