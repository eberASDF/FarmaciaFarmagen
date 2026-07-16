import { useState } from "react";
import { Edit3, PackagePlus, Star, Trash2, X } from "lucide-react";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/initialData";
import { storage } from "../firebase/config";

const PRODUCT_LIMITS = {
  name: 50,
  description: 300,
  text: 100,
  priceMax: 9999,
  stockMax: 9999,
};

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, user } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [notification, setNotification] = useState("");
  const [saving, setSaving] = useState(false);

  const emptyForm = { name: "", category: "analgesia", price: "", stock: "", image: "", imageFile: null, specs: "", featured: false };
  const [form, setForm] = useState(emptyForm);

  const formatProductDate = (value) => {
    if (!value) return "Sin fecha";
    const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
    if (Number.isNaN(date.getTime())) return "Sin fecha";
    return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
  };

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
      imageFile: null,
      specs: product.specs,
      featured: product.featured,
    });
    setShowModal(true);
  };

  const validateProductForm = () => {
    const name = form.name.trim();
    const category = form.category.trim();
    const description = form.specs.trim();
    const image = form.image.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!name || !category || form.price === "" || form.stock === "") return "Falta completar campos obligatorios";
    if (name.length > PRODUCT_LIMITS.name) return "El nombre no puede superar 50 caracteres";
    if (description.length > PRODUCT_LIMITS.description) return "La descripciÃ³n no puede superar 300 caracteres";
    if (!form.imageFile && image.length > PRODUCT_LIMITS.text) return "Este campo no puede superar 100 caracteres";
    if (Number.isNaN(price) || price <= 0) return "El precio debe ser mayor a 0";
    if (price > PRODUCT_LIMITS.priceMax) return "El precio no puede ser mayor a 9999";
    if (!Number.isInteger(stock)) return "El stock debe ser un nÃºmero entero";
    if (stock < 0) return "El stock no puede ser negativo";
    if (stock > PRODUCT_LIMITS.stockMax) return "El stock no puede ser mayor a 9999";
    return "";
  };

  const uploadProductImage = async () => {
    if (!form.imageFile) return form.image.trim();

    try {
      const safeName = form.imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const imageRef = ref(storage, `productos/${Date.now()}-${safeName}`);
      const snapshot = await uploadBytes(imageRef, form.imageFile);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error subiendo imagen de producto:", error);
      throw new Error("Error al subir la imagen");
    }
  };

  const tryDeleteStorageImage = async (imageUrl) => {
    if (!imageUrl || !String(imageUrl).includes("firebasestorage")) return;

    try {
      await deleteObject(ref(storage, imageUrl));
    } catch (error) {
      console.error("Error eliminando imagen de producto en Storage:", error);
      // Si la URL no corresponde a Storage o ya no existe, no detenemos la eliminación del producto.
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.role !== "admin") {
      showNotif("No tienes permisos para realizar esta acción");
      return;
    }

    const validationMessage = validateProductForm();
    if (validationMessage) {
      showNotif(validationMessage);
      return;
    }

    const data = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image.trim(),
      imageUrl: form.image.trim(),
      imagenUrl: form.image.trim(),
      specs: form.specs.trim(),
      descripcion: form.specs.trim(),
      featured: Boolean(form.featured),
      destacado: Boolean(form.featured),
    };

    if (editingProduct) {
      setSaving(true);
      try {
        const imageUrl = await uploadProductImage();
        const result = await updateProduct(editingProduct.id, {
          ...data,
          image: imageUrl,
          imageUrl,
          imagenUrl: imageUrl,
        });
        showNotif(result.message);
        if (result.success) {
          setForm(emptyForm);
          setShowModal(false);
        }
      } catch (error) {
        console.error("Error actualizando producto desde admin:", error);
        showNotif(error.message === "Error al subir la imagen" ? "Error al subir la imagen" : "Error al actualizar producto");
      } finally {
        setSaving(false);
      }
    } else {
      setSaving(true);
      try {
        const imageUrl = await uploadProductImage();
        const result = await addProduct({
          ...data,
          image: imageUrl,
          imageUrl,
          imagenUrl: imageUrl,
        });
        showNotif(result.message);
        if (result.success) {
          setForm(emptyForm);
          setShowModal(false);
        }
      } catch (error) {
        console.error("Error guardando producto desde admin:", error);
        showNotif(error.message === "Error al subir la imagen" ? "Error al subir la imagen" : "Error al guardar el producto");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (user?.role !== "admin") {
      showNotif("No tienes permisos para realizar esta acción");
      return;
    }

    const prod = products.find(p => p.id === id);
    const result = await deleteProduct(id);
    if (result.success) {
      await tryDeleteStorageImage(prod?.imagenUrl || prod?.imageUrl || prod?.image);
      setConfirmDelete(null);
    }
    showNotif(result.message);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "name" && value.length > PRODUCT_LIMITS.name) {
      showNotif("El nombre no puede superar 50 caracteres");
      return;
    }
    if (name === "specs" && value.length > PRODUCT_LIMITS.description) {
      showNotif("La descripciÃ³n no puede superar 300 caracteres");
      return;
    }
    if (name === "image" && value.length > PRODUCT_LIMITS.text) {
      showNotif("Este campo no puede superar 100 caracteres");
      return;
    }
    if ((name === "price" || name === "stock") && Number(value) > PRODUCT_LIMITS.priceMax) {
      showNotif(name === "price" ? "El precio no puede ser mayor a 9999" : "El stock no puede ser mayor a 9999");
      return;
    }
    if ((name === "price" || name === "stock") && Number(value) < 0) {
      showNotif(name === "price" ? "El precio debe ser mayor a 0" : "El stock no puede ser negativo");
      return;
    }
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "image" ? { imageFile: null } : {}),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showNotif("Error: Solo se permiten archivos de imagen.");
        e.target.value = ""; // Reset input
        return;
      }
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
        <div>
          <p className="admin-page-kicker">Catálogo</p>
          <h1 className="admin-page-title">Gestión de productos</h1>
        </div>
        <button onClick={openAdd} className="btn-primary" id="add-product-btn">
          <PackagePlus aria-hidden="true" /> Agregar producto
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
              <th>Actualización</th>
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
                      <img src={p.image || p.imagenUrl || ""} alt={p.name} className="admin-product-thumb" />
                      <span className="admin-product-name">{p.name}</span>
                    </div>
                  </td>
                  <td><span className="admin-category-badge">{catInfo?.label}</span></td>
                  <td className="admin-price">${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>{formatProductDate(p.actualizadoEn || p.creadoEn)}</td>
                  <td>{p.featured ? <span className="admin-featured-yes"><Star aria-hidden="true" /> Sí</span> : <span className="admin-featured-no">No</span>}</td>
                  <td>
                    <div className="admin-actions">
                      <button onClick={() => openEdit(p)} className="admin-action-btn admin-action-btn--edit" title="Editar producto" aria-label={`Editar ${p.name}`}><Edit3 aria-hidden="true" /></button>
                      <button onClick={() => setConfirmDelete(p.id)} className="admin-action-btn admin-action-btn--delete" title="Eliminar producto" aria-label={`Eliminar ${p.name}`}><Trash2 aria-hidden="true" /></button>
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
              <button onClick={() => setShowModal(false)} className="modal-close" aria-label="Cerrar"><X aria-hidden="true" /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input type="text" name="name" required maxLength={50} value={form.name} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Categoría *</label>
                  <select name="category" required value={form.category} onChange={handleChange} className="form-select">
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Precio *</label>
                  <input type="number" name="price" required step="0.01" min="0.01" max="9999" value={form.price} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input type="number" name="stock" required min="0" max="9999" step="1" value={form.stock} onChange={handleChange} className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Cargar Imagen desde el Dispositivo</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" style={{ color: '#94a3b8' }} />
              </div>
              <div className="form-group">
                <label className="form-label">O escribir URL de Imagen</label>
                <input type="url" name="image" maxLength={100} value={form.imageFile ? "" : form.image} onChange={handleChange} className="form-input" placeholder="https://..." />
              </div>
              {form.image && (
                <div className="form-group">
                  <span className="form-label">Vista Previa de Imagen:</span>
                  <img src={form.image} alt="Preview" style={{ width: '100%', maxHeight: '140px', objectFit: 'contain', borderRadius: '12px', marginTop: '6px', backgroundColor: '#0b0f19', border: '1px solid #1e293b', padding: '8px' }} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea name="specs" value={form.specs} onChange={handleChange} className="form-textarea" rows="3" maxLength={300} />
              </div>
              <div className="form-group form-group--checkbox">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} id="product-featured" />
                <label htmlFor="product-featured" className="form-label">Marcar como Destacado</label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancelar</button>
                <button type="submit" className="btn-primary" id="save-product-btn" disabled={saving}>{saving ? "Guardando..." : editingProduct ? "Guardar Cambios" : "Agregar Producto"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal modal--small" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">¿Seguro que deseas eliminar este producto?</h2>
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
