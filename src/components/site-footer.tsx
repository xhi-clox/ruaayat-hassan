import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Rubayat Hassan. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="#" aria-label="X / Twitter">
              <Twitter className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="#" aria-label="YouTube">
              <Youtube className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground">
          Admin
        </Link>
      </div>
    </footer>
  );
}
