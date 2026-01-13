import { useTranslations } from 'next-intl';

export default function Logo() {
  const t = useTranslations('All');

  return (
    <div className="flex items-center justify-center">
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="60" height="60" rx="12" fill="#104134" />
        <path
          d="M30 46C31.6569 46 33 44.6569 33 43C33 41.3431 31.6569 40 30 40C28.3431 40 27 41.3431 27 43C27 44.6569 28.3431 46 30 46Z"
          fill="white"
        />
        <path
          d="M20 16L27 41H33L40 16"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 16C20 16 23 22 30 22C37 22 40 16 40 16"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
            d="M24 16V28"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
         <path
            d="M36 16V28"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
         <path
            d="M30 16V28"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
      </svg>
    </div>
  );
}