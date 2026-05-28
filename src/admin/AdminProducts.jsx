import { useState } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/initialData";

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [notification, setNotification] = useState("");

  const emptyForm = { name: "", category: "analgesia", price: "", stock: "", image: "", specs: "", featured: false };
  const [form, setForm] = useState(emptyForm);

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image,
      specs: product.specs,
      featured: product.featured,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      image: form.image,
      specs: form.specs,
      featured: form.featured,
    };
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      showNotif(`"${data.name}" actualizado correctamente.`);
    } else {
      addProduct(data);
      showNotif(`"${data.name}" agregado correctamente.`);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    const prod = products.find(p => p.id === id);
    deleteProduct(id);
    setConfirmDelete(null);
    showNotif(`"${prod?.name}" dado de baja.`);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestión de Productos</h1>
        <button onClick={openAdd} className="btn-primary" id="add-product-btn">
          + Agregar Producto
        </button>
      </div>

      {notification && <div className="notification notification--success">{notification}</div>}

      {/* Products Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Destacado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const catInfo = CATEGORIES.find(c => c.id === p.category);
              return (
                <tr key={p.id}>
                  <td>
                    <div className="admin-product-cell">
                      <img src={p.image} alt={p.name} className="admin-product-thumb" />
                      <span className="admin-product-name">{p.name}</span>
                    </div>
                  </td>
                  <td><span className="admin-category-badge">{catInfo?.label}</span></td>
                  <td className="admin-price">${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>{p.featured ? <span className="admin-featured-yes">Sí</span> : <span className="admin-featured-no">No</span>}</td>
                  <td>
                    <div className="admin-actions">
                      <button onClick={() => openEdit(p)} className="admin-action-btn admin-action-btn--edit">Editar</button>
                      <button onClick={() => setConfirmDelete(p.id)} className="admin-action-btn admin-action-btn--delete">Baja</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingProduct ? "Editar Producto" : "Agregar Producto"}</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input type="text" name="name" required value={form.name} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Categoría *</label>
                  <select name="category" value={form.category} onChange={handleChange} className="form-select">
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Precio *</label>
                  <input type="number" name="price" required step="0.01" min="0" value={form.price} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input type="number" name="stock" required min="0" value={form.stock} onChange={handleChange} className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">URL de Imagen</label>
                <input type="url" name="image" value={form.image} onChange={handleChange} className="form-input" placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea name="specs" value={form.specs} onChange={handleChange} className="form-textarea" rows="3" />
              </div>
              <div className="form-group form-group--checkbox">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} id="product-featured" />
                <label htmlFor="product-featured" className="form-label">Marcar como Destacado</label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancelar</button>
                <button type="submit" className="btn-primary" id="save-product-btn">{editingProduct ? "Guardar Cambios" : "Agregar Producto"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal modal--small" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">¿Dar de baja este producto?</h2>
            <p className="modal-text">Esta acción eliminará el producto del catálogo.</p>
            <div className="modal-actions">
              <button onClick={() => setConfirmDelete(null)} className="btn-outline">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} className="btn-danger" id="confirm-delete-btn">Confirmar Baja</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
