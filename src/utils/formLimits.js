export const FORM_LIMITS = {
  name: 50,
  description: 300,
  phone: 20,
  email: 100,
  password: 100,
  imageUrl: 500,
  category: 100,
  branch: 100,
  hours: 100,
  text: 100,
  numberMax: 9999,
};

export function getLimitMessage(fieldName, limit) {
  if (fieldName === "name" || fieldName === "nombre") return "El nombre no puede superar 50 caracteres.";
  if (fieldName === "description" || fieldName === "descripcion" || fieldName === "specs" || fieldName === "subtitle") return "La descripción no puede superar 300 caracteres.";
  if (fieldName === "phone" || fieldName === "telefono") return "El teléfono no puede superar 20 caracteres.";
  if (fieldName === "email" || fieldName === "correo") return "El correo no puede superar 100 caracteres.";
  if (fieldName === "password" || fieldName === "confirmPassword") return "La contraseña no puede superar 100 caracteres.";
  if (fieldName === "image" || fieldName === "imageUrl" || fieldName === "imagenUrl") return "La URL de imagen no puede superar 500 caracteres.";
  if (fieldName === "category" || fieldName === "categoria") return "La categoría no puede superar 100 caracteres.";
  if (fieldName === "branch" || fieldName === "sucursal") return "La sucursal no puede superar 100 caracteres.";
  if (fieldName === "hours" || fieldName === "horario") return "El horario no puede superar 100 caracteres.";
  return `Alcanzaste el límite de ${limit} caracteres.`;
}

export function notifyLimitReached({ fieldName, value, limit, notify }) {
  if (value.length === limit) {
    notify(getLimitMessage(fieldName, limit));
  }
}
