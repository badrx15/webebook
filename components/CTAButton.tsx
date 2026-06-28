'use client';

import Link from 'next/link';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  large?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function CTAButton({
  href,
  children,
  large = false,
  className = '',
  onClick,
}: CTAButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg bg-[#C0281A] font-bold text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#C0281A] focus:ring-offset-2 ${
        large ? 'px-10 py-5 text-xl' : 'px-8 py-4 text-lg'
      } ${className}`}
    >
      {children}
    </Link>
  );
}
