import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  index?: number;
}

const gradientBgs = [
  "from-amber-500/10 to-orange-500/5",
  "from-emerald-500/10 to-green-500/5",
  "from-purple-500/10 to-pink-500/5",
  "from-blue-500/10 to-cyan-500/5",
];

const iconColors = [
  "from-amber-500 to-amber-600",
  "from-emerald-500 to-green-500",
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
];

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
  index = 0,
}: StatsCardProps) {
  const gradientBg = gradientBgs[index % gradientBgs.length];
  const iconColor = iconColors[index % iconColors.length];

  return (
    <Card className={cn("overflow-hidden hover-lift animate-fade-in-up group", className)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-4 sm:p-6 relative">
        {/* Subtle gradient background */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          gradientBg
        )} />

        <div className="flex items-start justify-between gap-3 relative">
          <div className="space-y-1 sm:space-y-2 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{value}</p>
            {description && (
              <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    trend === "up" && "bg-emerald-500/10 text-emerald-600",
                    trend === "down" && "bg-red-500/10 text-red-600",
                    trend === "neutral" && "bg-muted text-muted-foreground"
                  )}
                >
                  {trend === "up" && "↑"}
                  {trend === "down" && "↓"} {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={cn(
            "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white flex-shrink-0 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl",
            iconColor
          )}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}