import Link from 'next/link';
import { Gamepad2, Shield } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <span className="font-headline text-2xl font-bold">
              MuBuilds
            </span>
          </Link>
        </div>
        <Button asChild variant="outline" className="bg-background/80 backdrop-blur-sm">
          <Link href="/admin">
            <Shield className="mr-2 h-4 w-4" />
            Painel Admin
          </Link>
        </Button>
      </div>
    </header>
  );
}
