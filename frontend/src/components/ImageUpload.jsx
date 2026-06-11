import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { uploadAPI } from "../api/endpoints";
import { resolveImageUrl } from "../utils/imageUrl";
import "../styles/image-upload.css";

export default function ImageUpload({ value, onChange, disabled = false }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const inputRef = useRef(null);

  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecciona un archivo de imagen válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar 5 MB");
      return;
    }

    const localPreview = URL.createObjectURL(file);

    try {
      setUploading(true);
      setPreview(localPreview);

      const data = await uploadAPI.uploadImage(file);
      onChange(data.imagen);
      setPreview(data.imagen);
      toast.success("Imagen subida correctamente");
    } catch (error) {
      toast.error(error.message || "Error al subir imagen");
      setPreview(value || "");
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localPreview);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleUrlChange = (url) => {
    setPreview(url);
    onChange(url);
  };

  const displaySrc = resolveImageUrl(preview || value);

  return (
    <div className="image-upload">
      <div className="image-preview">
        <img
          src={displaySrc}
          alt="Vista previa"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = resolveImageUrl("");
          }}
        />
        {uploading && <div className="image-upload-overlay">Subiendo...</div>}
      </div>

      <div className="image-upload-actions">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFile}
          disabled={disabled || uploading}
          hidden
          id="moto-image-file"
        />
        <label htmlFor="moto-image-file" className={`btn btn-outline ${disabled || uploading ? "disabled" : ""}`}>
          📷 Subir foto
        </label>
      </div>

      <div className="form-group" style={{ marginTop: "0.75rem" }}>
        <label>O pegar URL de imagen</label>
        <input
          type="url"
          placeholder="https://ejemplo.com/moto.jpg"
          value={value?.startsWith("/uploads") ? "" : value || ""}
          onChange={(e) => handleUrlChange(e.target.value)}
          disabled={disabled || uploading}
        />
        {value?.startsWith("/uploads") && (
          <span className="field-hint">Imagen subida al servidor</span>
        )}
      </div>
    </div>
  );
}
