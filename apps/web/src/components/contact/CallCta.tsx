function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.9-1.9c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V19c0 .6-.4 1-1 1C10.9 20 4 13.1 4 4.6c0-.6.4-1 1-1h2.3c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1L6.6 10.8z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CallCta({
  phoneNumber,
  className,
  children = "Call Us",
  icon = false,
}: {
  phoneNumber: string;
  className?: string;
  children?: React.ReactNode;
  icon?: boolean;
}) {
  return (
    <a href={`tel:${phoneNumber.replace(/\s+/g, "")}`} className={className}>
      {icon ? (
        <span className="inline-flex items-center gap-2">
          <PhoneIcon />
          {children}
        </span>
      ) : (
        children
      )}
    </a>
  );
}
