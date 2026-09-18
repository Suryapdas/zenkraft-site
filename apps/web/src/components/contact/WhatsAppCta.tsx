// FR-010: WhatsApp CTA must use the verified configured number, prefilled with context where supported.
function toWhatsAppDigits(number: string): string {
  return number.replace(/[^\d]/g, "");
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20l1.5-4.2A8 8 0 1112 20a8 8 0 01-4.2-1.2L4 20z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WhatsAppCta({
  whatsappNumber,
  message = "Hi ZENKRAFT, I'd like to discuss a project.",
  className,
  children = "Chat on WhatsApp",
  icon = false,
}: {
  whatsappNumber: string;
  message?: string;
  className?: string;
  children?: React.ReactNode;
  icon?: boolean;
}) {
  const href = `https://wa.me/${toWhatsAppDigits(whatsappNumber)}?text=${encodeURIComponent(message)}`;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {icon ? (
        <span className="inline-flex items-center gap-2">
          <ChatIcon />
          {children}
        </span>
      ) : (
        children
      )}
    </a>
  );
}
