import { useEffect, useState } from "react";
import { resolveImageUrl, PLACEHOLDER } from "../utils/imageUrl";

export default function MotoImage({ src, alt, className = "" }) {
  const [imgSrc, setImgSrc] = useState(() => resolveImageUrl(src));

  useEffect(() => {
    setImgSrc(resolveImageUrl(src));
  }, [src]);

  return (
    <div className={`moto-card-image-wrap ${className}`.trim()}>
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onError={() => setImgSrc(PLACEHOLDER)}
      />
    </div>
  );
}
