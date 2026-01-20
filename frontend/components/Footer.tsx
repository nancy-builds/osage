import Link from 'next/link';
import { GraduationCap, Facebook, Instagram, Linkedin, Github } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
<footer className="bg-background border-t border-border py-10">
  <div className="container mx-auto px-4 text-center">

    <div className="flex flex-col items-center gap-3 mb-8">
      <Link
        href="/"
        className="flex items-center gap-2 text-2xl font-bold text-foreground"
      >
        <GraduationCap className="w-8 h-8" />
        <span>Osage</span>
      </Link>

      <p className="text-muted-foreground max-w-xs">
        Fast, fresh, and delivered to your door. Order your favorites anytime.
      </p>

      <div className="flex gap-5 mt-3 justify-center">
        {[
          { href: "https://www.facebook.com/tuyetnhunqqq/", icon: Facebook },
          { href: "https://www.instagram.com/tuyetnhunqqq/", icon: Instagram },
          { href: "https://github.com/nancy-builds", icon: Github },
        ].map(({ href, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Icon className="w-6 h-6" />
          </a>
        ))}

        <a className="text-muted-foreground hover:text-primary transition-colors">
          <Linkedin className="w-6 h-6" />
        </a>
      </div>
    </div>

    <div className="flex flex-col gap-3 text-xs text-muted-foreground pb-20">
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
