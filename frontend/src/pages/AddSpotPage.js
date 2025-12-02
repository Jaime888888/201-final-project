import React, { useState } from "react";
import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/AddSpotPage.css";
import { AuthContext } from '../context/AuthContext';
import NavBar from '../components/NavBar';
a1065f1e9dba282a0ea6368a7f2074bdcd1fc3e1

function AddSpotPage() {
  const { token } = useContext(AuthContext); // token

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    hasWifi: false,
    hasOutlets: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.name.trim() || !formData.address.trim()) {
      setError("Name and location are required.");
      return;
    }
    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      description: formData.description.trim(),
      hasWifi: formData.hasWifi,
      hasOutlets: formData.hasOutlets
    };
    setSubmitting(true);
    try {
      const res = await fetch("/api/spots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}` // attach token
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        setError("Could not create study spot.");
        setSubmitting(false);
        return;
      }
      navigate("/favorites");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-spot-page">
      <NavBar />
      <div className="add-spot-container">
        <h1 className="add-spot-title">Add a new study spot</h1>
        {error && <div className="add-spot-error">{error}</div>}
        <form className="add-spot-form" onSubmit={handleSubmit}>
          <label className="add-spot-field">
            Name
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
            Location
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address or general location"
              required
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
          <div className="add-spot-checkbox-row">
            <label className="add-spot-checkbox">
              <input
                type="checkbox"
                name="hasWifi"
                checked={formData.hasWifi}
                onChange={handleChange}
              />
              Wi-Fi available
            </label>
            <label className="add-spot-checkbox">
              <input
                type="checkbox"
                name="hasOutlets"
                checked={formData.hasOutlets}
                onChange={handleChange}
              />
              Outlets available
            </label>
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
