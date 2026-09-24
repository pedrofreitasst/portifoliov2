import Image from 'next/image';
import Link from 'next/link';

/** Home mark — PNG for now; swap to SVG later if needed. */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Pedro de Freitas — home"
      className={`inline-flex shrink-0 ${className}`}
    >
      <Image
        src="/logo.png"
        alt=""
        width={32}
        height={32}
        priority
        aria-hidden={true}
        className="h-8 w-8 rounded-full object-cover"
      />
    </Link>
  );
}