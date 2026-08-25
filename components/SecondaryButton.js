import Link from "next/link";

export default function SecondaryButton({ children, href, className = "", onClick, type = "button", disabled = false }) {
  const baseClass = `btn btn-secondary ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {children}
      </Link>
    );
  }
  
  return (
    <button type={type} className={baseClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
