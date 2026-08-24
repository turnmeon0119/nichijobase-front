const socialLinks = [
  // Re-enable these after official 日常BASE social accounts are ready.
  // {
  //   label: "X",
  //   href: "https://x.com/your-account",
  //   icon: <XIcon />,
  // },
  // {
  //   label: "Instagram",
  //   href: "https://www.instagram.com/your-account/",
  //   icon: <InstagramIcon />,
  // },
  {
    label: "Search",
    href: "/search",
    icon: <SearchIcon />,
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

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
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
