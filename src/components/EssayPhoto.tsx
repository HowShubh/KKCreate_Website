import Image from "next/image";
import type { EssayImage } from "@/lib/photoEssays";

// A photo-essay photograph. Renders the real image when one exists, otherwise
// the textured placeholder card with the image's mono label (as in the design
// mockups / essays that haven't had photos uploaded yet).
export function EssayPhoto({
  image,
  sizes,
  className = "",
  priority = false,
}: {
  image: EssayImage;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {image.src ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="essay-placeholder absolute inset-0 flex items-center justify-center">
          {image.label && (
            <span className="px-4 text-center font-mono text-[11px] text-content-soft/70">
              {image.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
