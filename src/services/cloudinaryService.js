const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/qbc2vofe/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "farmagen_uploads";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export function validarImagenCloudinary(file) {
  if (!file) {
    throw new Error("No se selecciono ninguna imagen");
  }

  const extension = file.name?.split(".").pop()?.toLowerCase() || "";
  const isAllowedType = file.type ? ALLOWED_MIME_TYPES.includes(file.type) : true;
  const isAllowedExtension = ALLOWED_EXTENSIONS.includes(extension);

  if (!isAllowedType || !isAllowedExtension) {
    throw new Error("Formato no válido. Usa JPG, PNG o WEBP.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("La imagen no puede pesar más de 5 MB.");
  }
}

export async function subirImagenACloudinary(file, folder = "farmagen/uploads") {
  try {
    validarImagenCloudinary(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", folder);

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!response.ok || !data.secure_url) {
      throw new Error(data.error?.message || "No se pudo subir la imagen");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Error subiendo imagen a Cloudinary:", error);
    throw error;
  }
}
