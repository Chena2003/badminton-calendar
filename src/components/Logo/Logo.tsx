import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Logo() {
  const t = useTranslations('All');

  return (
    <div className="flex items-center justify-center">
      <Image
        src="/logo.png"
        alt="Badminton Calendar Logo"
        width={60}
        height={60}
        priority
      />
    </div>
  );
}