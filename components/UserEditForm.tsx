"use client";

import { useState } from "react";
import { AdminUser, UserRole } from "@/lib/types/admin";

interface UserEditFormProps {
  user: AdminUser;
  onSave: (updates: Partial<AdminUser & { password?: string }>) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function UserEditForm({ user, onSave, onCancel, loading }: UserEditFormProps) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    role: user.role,
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Partial<AdminUser & { password?: string }> = {
      username: formData.username,
      email: formData.email,
      role: formData.role,
    };
    if (formData.password) {
      updates.password = formData.password;
    }
    onSave(updates);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Kullanıcı Adı *</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">E-posta *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Rol *</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
          className="w-full px-4 py-2 border border-neutral-border rounded-lg"
        >
          <option value="admin">Admin - Tam Yetki</option>
          <option value="ik">IK - İnsan Kaynakları</option>
          <option value="knowledge-base">Bilgi Merkezi - Knowledge Base</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Yeni Şifre (Boş bırakılırsa değişmez)</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-border rounded-lg"
          placeholder="Yeni şifre girin..."
        />
      </div>
      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-neutral-border text-neutral-heading rounded-lg hover:bg-neutral-light transition-colors"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={loading || !formData.username || !formData.email}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}

