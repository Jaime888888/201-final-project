import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddSpotPage.css";
import NavBar from '../components/NavBar';
import { createSpot } from '../api/spots';

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" }
];

function AddSpotPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    description: "",
    note: "",
    latitude: "",
    longitude: "",
    imageUrl: ""
  });
  const [hours, setHours] = useState([
    { dayOfWeek: 1, openTime: "09:00", closeTime: "17:00" }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHoursChange = (index, field, value) => {
    const newHours = [...hours];
    if (field === "dayOfWeek") {
      newHours[index][field] = parseInt(value, 10);
    } else {
      newHours[index][field] = value;
    }
    setHours(newHours);
  };

  const addHoursEntry = () => {
    setHours([...hours, { dayOfWeek: 1, openTime: "09:00", closeTime: "17:00" }]);
  };

  const removeHoursEntry = (index) => {
    if (hours.length > 1) {
      setHours(hours.filter((_, i) => i !== index));
    }
  };

  const formatTimeForAPI = (timeString) => {
    // Convert HH:MM format to HH:mm for API
    if (!timeString) return "";
    return timeString.substring(0, 5); // Ensure HH:mm format
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.name.trim() || !formData.address.trim()) {
      setError("Name and address are required.");
      return;
    }

    // Build payload matching the API structure
    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      type: formData.type.trim() || null,
      description: formData.description.trim() || null,
      note: formData.note.trim() || null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      imageUrl: formData.imageUrl.trim() || null,
      hours: hours.map(h => ({
        dayOfWeek: h.dayOfWeek,
        openTime: formatTimeForAPI(h.openTime),
        closeTime: formatTimeForAPI(h.closeTime)
      }))
    };

    setSubmitting(true);
    try {
      await createSpot(payload);
      navigate("/favorites");
    } catch (err) {
      const errorMessage = err.data?.error || err.message || "Could not create study spot.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-spot-page">
      <NavBar />
      <div className="add-spot-container">
        <h1 className="add-spot-title">Add a new study spot</h1>
        {error && <div className="add-spot-error" style={{ 
          padding: "12px", 
          marginBottom: "16px", 
          backgroundColor: "#fee2e2", 
          color: "#991b1b", 
          borderRadius: "8px",
          border: "1px solid #fecaca"
        }}>{error}</div>}
        <form className="add-spot-form" onSubmit={handleSubmit}>
          <label className="add-spot-field">
            Name *
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Leavey Library"
              required
            />
          </label>
          <label className="add-spot-field">
            Address *
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 University Ave, Los Angeles, CA"
              required
            />
          </label>
          <label className="add-spot-field">
            Type
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="e.g., Library, Coffee Shop, Study Lounge"
            />
          </label>
          <label className="add-spot-field">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Vibe, seating, best time to go..."
            />
          </label>
          <label className="add-spot-field">
            Note
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={2}
              placeholder="Additional notes or tips..."
            />
          </label>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <label className="add-spot-field" style={{ flex: "1", minWidth: "150px" }}>
              Latitude
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="37.7749"
                step="any"
              />
            </label>
            <label className="add-spot-field" style={{ flex: "1", minWidth: "150px" }}>
              Longitude
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="-122.4194"
                step="any"
              />
            </label>
          </div>
          <label className="add-spot-field">
            Image URL
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            <small style={{ marginTop: "4px", color: "#6b7280", fontSize: "0.85rem" }}>
              Enter a URL to an image of the study spot
            </small>
          </label>
          
          <div className="add-spot-field">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ fontWeight: "500" }}>Hours</label>
              <button
                type="button"
                onClick={addHoursEntry}
                style={{
                  padding: "6px 12px",
                  fontSize: "0.85rem",
                  backgroundColor: "#e5e7eb",
                  color: "#1f2937",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                + Add Day
              </button>
            </div>
            {hours.map((hour, index) => (
              <div key={index} style={{ 
                display: "flex", 
                gap: "12px", 
                alignItems: "flex-end",
                marginBottom: "12px",
                padding: "12px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb"
              }}>
                <label style={{ flex: "1", minWidth: "120px" }}>
                  <span style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "4px", display: "block" }}>Day</span>
                  <select
                    value={hour.dayOfWeek}
                    onChange={(e) => handleHoursChange(index, "dayOfWeek", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "0.95rem"
                    }}
                  >
                    {DAYS_OF_WEEK.map(day => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </label>
                <label style={{ flex: "1", minWidth: "100px" }}>
                  <span style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "4px", display: "block" }}>Open</span>
                  <input
                    type="time"
                    value={hour.openTime}
                    onChange={(e) => handleHoursChange(index, "openTime", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "0.95rem"
                    }}
                  />
                </label>
                <label style={{ flex: "1", minWidth: "100px" }}>
                  <span style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "4px", display: "block" }}>Close</span>
                  <input
                    type="time"
                    value={hour.closeTime}
                    onChange={(e) => handleHoursChange(index, "closeTime", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "0.95rem"
                    }}
                  />
                </label>
                {hours.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHoursEntry(index)}
                    style={{
                      padding: "10px 12px",
                      backgroundColor: "#fee2e2",
                      color: "#991b1b",
                      border: "1px solid #fecaca",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.9rem"
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <small style={{ color: "#6b7280", fontSize: "0.85rem" }}>
              Add hours for each day the spot is open. You can add multiple entries for the same day if hours vary.
            </small>
          </div>

          <div className="add-spot-actions">
            <button
              type="submit"
              className="add-spot-button add-spot-button-primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Create spot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSpotPage;
