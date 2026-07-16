import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useApp } from "../context/AppContext";
import { storage } from "../firebase/config";

export default function AdminBranches() {
  const { branches, addBranch, updateBranch, deleteBranch, toggleBranch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [notification, setNotification] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const emptyForm = { name: "", address: "", phone: "", hours: "", image: "", imageFile: null };
  const [form, setForm] = useState(emptyForm);

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const openAdd = () => {
    setEditingBranch(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (branch) => {
    setEditingBranch(branch);
    setForm({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      hours: branch.hours,
      image: branch.image || "",
      imageFile: null,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim() || !form.phone.trim() || !form.hours.trim()) {
      showNotif("Falta completar campos obligatorios");
      return;
    }
    if (form.name.length > 50 || form.address.length > 100 || form.phone.length > 100 || form.hours.length > 100) {
      showNotif(form.name.length > 50 ? "El nombre no puede superar 50 caracteres" : "Este campo no puede superar 100 caracteres");
      return;
    }

    let imageUrl = "";
    try {
      imageUrl = await uploadBranchImage();
    } catch (error) {
      showNotif(error.message === "Error al subir la imagen" ? "Error al subir la imagen" : "Error al guardar la sucursal");
      return;
    }

    const payload = { ...form, image: imageUrl, imagenUrl: imageUrl };

    if (editingBranch) {
      const result = await updateBranch(editingBranch.id, payload);
      showNotif(result.message);
      if (!result.success) return;
    } else {
      const result = await addBranch(payload);
      showNotif(result.message);
      if (!result.success) return;
    }
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const limit = name === "name" ? 50 : 100;
    if (value.length > limit) {
      showNotif(name === "name" ? "El nombre no puede superar 50 caracteres" : "Este campo no puede superar 100 caracteres");
      return;
    }
    setForm(prev => ({ ...prev, [name]: value, ...(name === "image" ? { imageFile: null } : {}) }));
  };

  const uploadBranchImage = async () => {
    if (!form.imageFile) return form.image.trim();

    try {
      const safeName = form.imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const imageRef = ref(storage, `sucursales/${Date.now()}-${safeName}`);
      const snapshot = await uploadBytes(imageRef, form.imageFile);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error subiendo imagen de sucursal:", error);
      throw new Error("Error al subir la imagen");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result, imageFile: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    const branch = branches.find(b => b.id === id);
    const result = await deleteBranch(id);
    setConfirmDelete(null);
    showNotif(result.message || `"${branch?.name}" eliminada.`);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestión de Sucursales</h1>
        <button onClick={openAdd} className="btn-primary" id="add-branch-btn">
          + Agregar Sucursal
        </button>
      </div>

      {notification && <div className="notification notification--success">{notification}</div>}

      <div className="admin-branches-grid">
        {branches.map(branch => (
          <div key={branch.id} className="admin-branch-card" id={`admin-branch-${branch.id}`}>
            <div className="admin-branch-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 className="admin-branch-card-name" style={{ fontSize: '1.15rem', fontWeight: '800' }}>{branch.name}</h3>
              <div className="admin-actions">
                <button
                  onClick={async () => {
                    const result = await toggleBranch(branch.id);
                    showNotif(result.message);
                  }}
                  className="admin-action-btn admin-action-btn--edit"
                >
                  {branch.active ? "Desactivar" : "Activar"}
                </button>
                <button onClick={() => openEdit(branch)} className="admin-action-btn admin-action-btn--edit">Editar</button>
                <button onClick={() => setConfirmDelete(branch.id)} className="admin-action-btn admin-action-btn--delete">Eliminar</button>
              </div>
            </div>
            <span className={`admin-banner-badge ${!branch.active ? "admin-banner-badge--inactive" : ""}`}>
              {branch.active ? "Activa" : "Inactiva"}
            </span>
            {branch.image && (
              <div style={{ height: '140px', overflow: 'hidden', borderRadius: '8px', marginBottom: '12px' }}>
                <img src={branch.image} alt={branch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div className="admin-branch-info" style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p><strong>Dirección:</strong> {branch.address}</p>
              <p><strong>Teléfono:</strong> {branch.phone}</p>
              <p><strong>Horario:</strong> {branch.hours}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingBranch ? "Editar Sucursal" : "Agregar Sucursal"}</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Nombre de la Sucursal *</label>
                <input type="text" name="name" required maxLength={50} value={form.name} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Dirección *</label>
                <input type="text" name="address" required maxLength={100} value={form.address} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Teléfono *</label>
                  <input type="tel" name="phone" required maxLength={100} pattern="[0-9\s()+]*" value={form.phone} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Horario *</label>
                  <input type="text" name="hours" required maxLength={100} value={form.hours} onChange={handleChange} className="form-input" placeholder="Ej: Lunes a sábado: 8 a.m. – 10 p.m. | Domingo: 9 a.m. – 9 p.m." />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Cargar Foto de Sucursal</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" style={{ color: '#94a3b8' }} />
              </div>

              <div className="form-group">
                <label className="form-label">O escribir URL de Imagen</label>
                <input type="url" name="image" maxLength={100} value={form.image} onChange={handleChange} className="form-input" placeholder="https://..." />
              </div>

              {form.image && (
                <div className="form-group">
                  <span className="form-label">Vista Previa:</span>
                  <img src={form.image} alt="Preview" style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '6px', marginTop: '6px' }} />
                </div>
              )}

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancelar</button>
                <button type="submit" className="btn-primary" id="save-branch-btn">{editingBranch ? "Guardar Cambios" : "Agregar Sucursal"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal modal--small" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">¿Eliminar esta sucursal?</h2>
            <p className="modal-text">Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button onClick={() => setConfirmDelete(null)} className="btn-outline">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} className="btn-danger" id="confirm-delete-branch">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
