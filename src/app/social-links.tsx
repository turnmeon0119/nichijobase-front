const socialLinks = [
  {
    label: "X",
    href: "https://x.com/",
    icon: <XIcon />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: <InstagramIcon />,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: <DocumentIcon />,
  },
];

export default function SocialLinks() {
  return (
    <div className="flex shrink-0 items-center justify-end gap-2 lg:gap-3">
      {socialLinks.map((link) => {
        const isExternal = link.href.startsWith("http");

        return (
          <a
            key={link.label}
            href={link.href}
            aria-label={link.label}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            className="grid size-10 place-items-center rounded-2xl border border-transparent text-[var(--foreground)] hover:border-[var(--foreground)] hover:bg-[var(--surface)] hover:text-[var(--accent)] lg:size-11"
          >
            {link.icon}
          </a>
        );
      })}
    </div>
  );
}

function XIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
      <path d="M17.53 3h3.18l-6.95 7.95L21.94 21h-6.4l-5.01-6.55L4.79 21H1.6l7.43-8.5L1.19 3h6.56l4.53 5.99L17.53 3Zm-1.12 16.23h1.76L6.79 4.68H4.9l11.51 14.55Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h4" />
      <path d="M10 13h5" />
      <path d="M10 17h5" />
    </svg>
  );
}
