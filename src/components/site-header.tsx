import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-headline text-2xl font-bold tracking-wider">RUBAYAT HASSAN</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="px-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60">Galleries</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {CATEGORIES.map(category => (
                <DropdownMenuItem key={category.slug} asChild>
                  <Link href={`/gallery/${category.slug}`}>{category.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/commissions" className="transition-colors hover:text-foreground/80 text-foreground/60">Commissions</Link>
        </nav>
      </div>
    </header>
  );
}
