import type { ReactNode, HTMLAttributes } from "react";

export function Card({
  children,
  className = "",
  ...props
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`border border-blue-200 rounded-lg shadow-sm bg-white p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface HeaderProps {
  children: ReactNode;
  className?: string;
  icon?: string; // 🆕 ícono opcional
  alt?: string;  // texto alternativo opcional
}

export function CardHeader({ children, className = "", icon, alt }: HeaderProps) {
  return (
    <div className={`flex items-center gap-2 mb-2 ${className}`}>
      {icon && (
        <div className="cardIconCircle">
          <img src={icon} alt={alt || "icon"} />
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: { children: ReactNode; className?: string }) {
  return <h3 className={`text-lg font-bold text-blue-700 ${className}`}>{children}</h3>;
}

export function CardDescription({
  children,
  className = "",
}: { children: ReactNode; className?: string }) {
  return <p className={`text-sm text-blue-500 ${className}`}>{children}</p>;
}

export function CardContent({
  children,
  className = "",
}: { children: ReactNode; className?: string }) {
  return <div className={`text-sm text-gray-700 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: { children: ReactNode; className?: string }) {
  return <div className={`mt-2 border-t border-blue-100 pt-2 ${className}`}>{children}</div>;
}
