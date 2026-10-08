// Drawn flag (the flag emoji shows as "BD" on Windows, so we draw it).
export default function Flag({ className = "inline-block h-[0.8em] w-[1.3em] align-[-0.1em] rounded-[2px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 18" className={className} role="img" aria-label="বাংলাদেশের পতাকা">
      <rect width="30" height="18" fill="#006a4e" />
      <circle cx="13.5" cy="9" r="5" fill="#f42a41" />
    </svg>
  );
}
