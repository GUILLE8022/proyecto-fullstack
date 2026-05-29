const PLACEHOLDER = "https://via.placeholder.com/400x300?text=Moto";

export const getApiOrigin = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  return apiUrl.replace(/\/api\/?$/, "");
};

export const resolveImageUrl = (imagen) => {
  if (!imagen) return PLACEHOLDER;
  if (imagen.startsWith("http://") || imagen.startsWith("https://") || imagen.startsWith("data:")) {
    return imagen;
  }
  const origin = getApiOrigin();
  const path = imagen.startsWith("/") ? imagen : `/${imagen}`;
  return `${origin}${path}`;
};
