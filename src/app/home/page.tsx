"use client";

import { useEffect, useState } from "react";
import { getSessionFromClient, getTokenFromClient } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import ActionButtons from "@/components/ActionButtons";

type Admin = {
  _id: string;
  name: string;
  email: string;
  phone: string;
};

export default function HomePage() {
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", logo: null as File | null });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const sessionUser = getSessionFromClient();
    setUser(sessionUser);
    setLoading(false);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = getTokenFromClient();
      const res = await fetch("https://doitdubby.visionadvertisingsolutions.com/api/admin/work-categories", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setSubmitting(true);
    try {
      const token = getTokenFromClient();
      const fd = new FormData();
      fd.append("name", formData.name);
      if (formData.logo) {
        fd.append("logo", formData.logo);
      }

      const url = editingCategory
        ? `https://doitdubby.visionadvertisingsolutions.com/api/admin/work-categories/${editingCategory._id}`
        : "https://doitdubby.visionadvertisingsolutions.com/api/admin/work-categories";

      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      if (!res.ok) throw new Error("Request failed");

      setFormData({ name: "", logo: null });
      setShowAddForm(false);
      setEditingCategory(null);
      await fetchCategories();
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({ name: category.name, logo: null });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setFormData({ name: "", logo: null });
  };

  if (loading) {
    return <div style={{ padding: "40px", color: "white" }}>Loading...</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "32px",
            borderRadius: "16px",
            marginBottom: "32px",
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div>
            <h1 style={{ color: "white", fontSize: "32px", marginBottom: "8px" }}>
              📂 Work Categories
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px" }}>
              Create and manage your work categories. Total: {categories.length}
            </p>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <button
              onClick={() => {
                setEditingCategory(null);
                setFormData({ name: "", logo: null });
                setShowAddForm((prev) => !prev);
              }}
              style={{
                padding: "14px 24px",
                fontSize: "16px",
                background: showAddForm ? "rgba(255, 0, 0, 0.6)" : "#4f46e5",
                border: "none",
                borderRadius: "10px",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {showAddForm ? "❌ Cancel" : "➕ Add Category"}
            </button>
            <LogoutButton />
          </div>
        </div>

        {/* Form */}
        {showAddForm && (
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "32px",
              borderRadius: "16px",
              marginBottom: "32px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <h2 style={{ color: "white", fontSize: "20px", marginBottom: "16px" }}>
              {editingCategory ? "✏️ Edit Category" : "➕ Create New Category"}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "24px" }}>
              <div>
                <label htmlFor="name" style={{ color: "white", marginBottom: "8px", display: "block" }}>
                  Category Name
                </label>
                <input
                  id="name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    width: "100%",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                />
              </div>

              <div>
                <label htmlFor="logo" style={{ color: "white", marginBottom: "8px", display: "block" }}>
                  {editingCategory ? "New Logo (optional)" : "Category Logo"}
                </label>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.files?.[0] || null })
                  }
                  required={!editingCategory}
                  style={{
                    color: "white",
                    padding: "14px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.1)",
                    width: "100%",
                  }}
                />
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                  PNG, JPG. Max 2MB.
                </p>
              </div>

              {editingCategory?.logo && (
                <div>
                  <p style={{ color: "white", marginBottom: "8px" }}>Current Logo</p>
                  <img
                    src={editingCategory.logo}
                    alt={editingCategory.name}
                    style={{ height: "60px", borderRadius: "10px", border: "1px solid white" }}
                  />
                </div>
              )}

              <div style={{ display: "flex", gap: "16px" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "14px 28px",
                    background: "#10b981",
                    border: "none",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "10px",
                    flex: 1,
                    cursor: "pointer",
                  }}
                >
                  {submitting
                    ? editingCategory
                      ? "⏳ Updating..."
                      : "⏳ Creating..."
                    : editingCategory
                    ? "✅ Update"
                    : "✅ Create"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: "14px 28px",
                    background: "#ef4444",
                    border: "none",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "10px",
                    flex: 1,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Category List */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "32px",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {categories.length === 0 ? (
            <div style={{ textAlign: "center", color: "white" }}>
              <p style={{ fontSize: "18px" }}>📂 No categories yet</p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                Click "Add Category" to create your first one.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "24px",
              }}
            >
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {cat.logo ? (
                      <img
                        src={cat.logo}
                        alt={cat.name}
                        style={{ width: "48px", height: "48px", borderRadius: "8px" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "8px",
                          background: "#4b5563",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        📂
                      </div>
                    )}
                    <div>
                      <h4 style={{ margin: 0 }}>{cat.name}</h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                        ID: {cat._id}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(cat)}
                    style={{
                      padding: "10px 16px",
                      background: "#6366f1",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    ✏️ Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <ActionButtons />
        </div>
      </div>
    </div>
  );
}
