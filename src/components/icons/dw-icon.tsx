export function DwIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 2a10 10 0 1 1-10 10" />
        <path d="M2 12a10 10 0 1 0 10-10" />
        <path d="M22 12a10 10 0 1 1-10-10" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }
  