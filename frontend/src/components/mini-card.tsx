import type { LucideIcon } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export interface MiniCardProps {
    /** Judul atau label kartu */
    title: string;
    /** Nilai atau angka utama yang ditampilkan */
    value: string | number;
    /** Icon dari lucide-react (opsional) */
    icon?: LucideIcon;
    /** Subtitle atau deskripsi tambahan (opsional) */
    subtitle?: string;
    /** Warna tema kartu: blue, green, red, yellow, purple (default: blue) */
    variant?: "blue" | "green" | "red" | "yellow" | "purple" | "orange" | "slate";
    /** Fungsi callback ketika kartu diklik (opsional) */
    onClick?: () => void;
    /** Menambahkan efek hover jika ada onClick */
    isClickable?: boolean;
    /** Tag atau badge tambahan di sudut kanan atas (opsional) */
    badge?: string;
    /** Warna badge */
    badgeVariant?: "default" | "secondary" | "success" | "warning" | "error";
    /** Perubahan persentase atau tren (opsional) */
    trend?: {
        value: number;
        isPositive: boolean;
        label?: string;
    };
}

const variantStyles = {
    blue: {
        icon: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
        text: "text-blue-600 dark:text-blue-400",
    },
    green: {
        icon: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
        text: "text-green-600 dark:text-green-400",
    },
    red: {
        icon: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
        text: "text-red-600 dark:text-red-400",
    },
    yellow: {
        icon: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
        text: "text-yellow-600 dark:text-yellow-400",
    },
    purple: {
        icon: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
        text: "text-purple-600 dark:text-purple-400",
    },
    orange: {
        icon: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
        text: "text-orange-600 dark:text-orange-400",
    },
    slate: {
        icon: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
        text: "text-slate-600 dark:text-slate-400",
    },
};

const badgeVariantMap = {
    default: "default",
    secondary: "secondary",
    success: "default", // Using default with green styling
    warning: "secondary", // Using secondary with warning styling
    error: "destructive",
} as const;

const MiniCard: React.FC<MiniCardProps> = ({
    title,
    value,
    icon: Icon,
    subtitle,
    variant = "blue",
    onClick,
    isClickable = !!onClick,
    badge,
    badgeVariant = "default",
    trend,
}) => {
    const styles = variantStyles[variant];

    return (
        <Card
            onClick={onClick}
            className={`${isClickable ? "cursor-pointer transition-all hover:shadow-lg hover:border-opacity-80 active:scale-95" : ""}`}
        >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-start gap-3">
                    {Icon && (
                        <div className={`rounded-lg p-2 ${styles.icon}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                </div>
                {badge && (
                    <Badge variant={badgeVariantMap[badgeVariant] as any}>
                        {badge}
                    </Badge>
                )}
            </CardHeader>

            <CardContent className="pb-4">
                {/* Value dengan Trend */}
                <div className="flex items-baseline gap-2">
                    <p className={`text-3xl font-bold ${styles.text}`}>{value}</p>
                    {trend && (
                        <div
                            className={`flex items-center gap-1 text-xs font-semibold ${trend.isPositive
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                        >
                            <span>{trend.isPositive ? "↑" : "↓"}</span>
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>

                {/* Trend Label */}
                {trend?.label && (
                    <p className="mt-2 text-xs text-muted-foreground">{trend.label}</p>
                )}
            </CardContent>
        </Card>
    );
};

export default MiniCard;
