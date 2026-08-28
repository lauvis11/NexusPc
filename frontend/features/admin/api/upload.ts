import { API_URL } from "@/lib/constants";
import { UploadImageResponse } from "../types/upload";

export async function subirImagen(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/admin/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al subir la imagen");
  }

  return response.json();
}
