import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useApp } from "../context/AppContext";
import { storage } from "../firebase/config";

export default function AdminCarousel() {
  const { banners, addBanner, updateBanner, deleteBanner, toggleBanner } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [notification, setNotification] = useState("");

  const emptyForm = { title: "", subtitle: "", image: "", imageFile: null, ctaText: "", ctaLink: "" };
  const [form, setForm] = useState(emptyForm);

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const openAdd = () => {
    setEditingBanner(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (banner) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      imageFile: null,
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showNotif("Falta completar campos obligatorios");
      return;
    }
    if (form.title.length > 50 || form.subtitle.length > 300 || form.ctaText.length > 100) {
      showNotif(form.title.length > 50 ? "El nombre no puede superar 50 caracteres" : form.subtitle.length > 300 ? "La descripciÃ³n no puede superar 300 caracteres" : "Este campo no puede superar 100 caracteres");
      return;
    }
    let imageUrl = "";
    try {
      imageUrl = await uploadBannerImage();
    } catch (error) {
      showNotif(error.message === "Error al subir la imagen" ? "Error al subir la imagen" : "Error al guardar el banner");
      return;
    }

    const payload = { ...form, image: imageUrl, imagenUrl: imageUrl };

    if (editingBanner) {
      const result = await updateBanner(editingBanner.id, payload);
      showNotif(result.message);
      if (!result.success) return;
    } else {
      const result = await addBanner(payload);
      showNotif(result.message);
      if (!result.success) return;
    }
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const limit = name === "title" ? 50 : name === "subtitle" ? 300 : 100;
    if (value.length > limit) {
      showNotif(name === "title" ? "El nombre no puede superar 50 caracteres" : name === "subtitle" ? "La descripciÃ³n no puede superar 300 caracteres" : "Este campo no puede superar 100 caracteres");
      return;
    }
    setForm(prev => ({ ...prev, [name]: value, ...(name === "image" ? { imageFile: null } : {}) }));
  };

  const uploadBannerImage = async () => {
    if (!form.imageFile) return form.image.trim();

    try {
      const safeName = form.imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const imageRef = ref(storage, `banners/${Date.now()}-${safeName}`);
      const snapshot = await uploadBytes(imageRef, form.imageFile);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error subiendo imagen de banner:", error);
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

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestión del Carrusel</h1>
        <button onClick={openAdd} className="btn-primary" id="add-banner-btn">
          + Agregar Banner
        </button>
      </div>

      {notification && <div className="notification notification--success">{notification}</div>}

      <div className="admin-banners-grid">
        {banners.map(banner => (
          <div key={banner.id} className="admin-banner-card" id={`admin-banner-${banner.id}`}>
            <div className="admin-banner-img-wrap">
              <img src={banner.image} alt={banner.title} className="admin-banner-img" />
              <span className={`admin-banner-badge ${!banner.active ? "admin-banner-badge--inactive" : ""}`}>
                {banner.active ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="admin-banner-body">
              <h3 className="admin-banner-title">{banner.title}</h3>
              <p className="admin-banner-sub">{banner.subtitle}</p>
              
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '8px 0 16px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span><strong>CTA:</strong> {banner.ctaText || "—"}</span>
                <span><strong>Link:</strong> {banner.ctaLink || "—"}</span>
              </div>
              
              <div className="admin-banner-actions">
                <button 
                  onClick={async () => {
                    const result = await toggleBanner(banner.id);
                    showNotif(result.message);
                  }} 
                  className="btn-outline" 
                  style={{ padding: '6px 10px', fontSize: '0.8rem', flexGrow: 1 }}
                >
                  {banner.active ? "Desactivar" : "Activar"}
                </button>
                <button 
                  onClick={() => openEdit(banner)} 
                  className="btn-primary" 
                  style={{ padding: '6px 10px', fontSize: '0.8rem', backgroundColor: 'var(--primary)', flexGrow: 1 }}
                >
                  Editar
                </button>
                <button 
                  onClick={async () => {
                    const result = await deleteBanner(banner.id);
                    showNotif(result.message);
                  }} 
                  className="btn-danger" 
                  style={{ padding: '6px 10px', fontSize: '0.8rem', flexGrow: 1 }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingBanner ? "Editar Banner" : "Agregar Banner"}</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Título *</label>
                <input type="text" name="title" required maxLength={50} value={form.title} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Subtítulo</label>
                <textarea name="subtitle" value={form.subtitle} onChange={handleChange} className="form-textarea" rows="2" maxLength={300} />
              </div>
              
              <div className="form-group">
                <label className="form-label">Cargar Imagen de Banner</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" style={{ color: '#94a3b8' }} />
              </div>

              <div className="form-group">
                <label className="form-label">O escribir URL de Imagen</label>
                <input type="url" name="image" maxLength={100} value={form.image} onChange={handleChange} className="form-input" placeholder="https://..." />
              </div>

              {form.image && (
                <div className="form-group">
                  <span className="form-label">Vista Previa de Imagen:</span>
                  <img src={form.image} alt="Preview" style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '6px', marginTop: '6px' }} />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Texto del Botón (CTA)</label>
                  <input type="text" name="ctaText" maxLength={100} value={form.ctaText} onChange={handleChange} className="form-input" placeholder="Ej: Ver Ofertas" />
                </div>
                <div className="form-group">
                  <label className="form-label">Link del Botón</label>
                  <select name="ctaLink" value={form.ctaLink} onChange={handleChange} className="form-select">
                    <option value="">Selecciona una opción...</option>
                    <option value="/">Inicio</option>
                    <option value="/products">Todos los Medicamentos</option>
                    <option value="/products?featured=true">Medicamentos Destacados</option>
                    <option value="/branches">Sucursales</option>
                    <option value="/login">Iniciar Sesión</option>
                    <option value="/register">Crear Cuenta</option>
                    <option value="/products?cat=analgesia">Categoría: Analgesia</option>
                    <option value="/products?cat=respiratorio">Categoría: Respiratorio</option>
                    <option value="/products?cat=vitaminas">Categoría: Vitaminas</option>
                    <option value="/products?cat=gastro">Categoría: Gastro</option>
                    <option value="/products?cat=dermatologia">Categoría: Dermatología</option>
                    <option value="/products?cat=diabetes">Categoría: Diabetes</option>
                    <option value="/products?cat=oftalmologia">Categoría: Oftalmología</option>
                    <option value="/products?cat=infantil">Categoría: Infantil</option>
                    <option value="/products?cat=cuidado-personal">Categoría: Cuidado Personal</option>
                    <option value="/products?cat=salud-sexual">Categoría: Salud Sexual</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancelar</button>
                <button type="submit" className="btn-primary" id="save-banner-btn">{editingBanner ? "Guardar Cambios" : "Agregar Banner"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
