import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const gradients = [
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-green-500",
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-rose-500 to-red-500",
  "from-indigo-500 to-violet-500",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className,
}: AvatarProps) {
  const initials =
    fallback ||
    (alt
      ? alt
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?");

  const gradientIndex = alt ? hashString(alt) % gradients.length : 0;
  const gradient = gradients[gradientIndex];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br text-white font-bold shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg",
        gradient,
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="drop-shadow-sm">{initials}</span>
      )}
    </div>
  );
}