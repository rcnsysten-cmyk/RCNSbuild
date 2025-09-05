export function DlIcon(props: React.SVGProps<SVGSVGElement>) {
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
        <path d="M12 2v4" />
        <path d="M14.5 4.5 12 7 9.5 4.5" />
        <path d="m12 7-5 3 5 10 5-10z" />
        <path d="M7 10h10" />
      </svg>
    );
  }
  