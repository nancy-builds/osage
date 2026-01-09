import Link from 'next/link';
import { GraduationCap, Facebook, Instagram, Linkedin, Github } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
<footer className="bg-white border-t border-gray-200 py-10">
  <div className="container mx-auto px-4 text-center">

    <div className="flex flex-col items-center gap-3 mb-8">
      <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900">
        <GraduationCap className="w-8 h-8" />
        <span>Osage</span>
      </Link>

      <p className="text-gray-600 max-w-xs">
        Fast, fresh, and delivered to your door. Order your favorites anytime.
      </p>

      <div className="flex gap-5 mt-3 justify-center">
        <a 
        href="https://www.facebook.com/tuyetnhunqqq/"
        className="text-gray-500 hover:text-primary"
        >
          <Facebook className="w-6 h-6" />
        </a>
        <a 
        href="https://www.instagram.com/tuyetnhunqqq/" 
        className="text-gray-500 hover:text-primary"
        >
          <Instagram className="w-6 h-6" />
        </a>
        <a 
        href="https://github.com/nancy-builds"
        className="text-gray-500 hover:text-primary">
          <Github className="w-6 h-6" />
        </a>

        <a 
        href="#" 
        className="text-gray-500 hover:text-primary"
        >
          <svg className="w-6 h-6" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
          </svg>
        </a>
        
        <a href="#" className="text-gray-500 hover:text-primary">
        <Linkedin className="w-6 h-6" />
        </a>
      </div>
    </div>

    <div className="flex flex-col gap-3 text-xs text-gray-500 pb-20">
      <div className="flex justify-center gap-4">
        <Link href="/privacy" className="hover:text-primary">Privacy</Link>
        <Link href="/terms" className="hover:text-primary">Terms</Link>
      </div>
      <span>© 2025 Osage. All rights reserved.</span>
    </div>
  </div>
</footer>

  );
}
