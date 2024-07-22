import {
  BrainCog,
  Combine,
  Grid2X2,
  Menu,
  Package2,
  Trash,
  Trash2
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";

const navLinks = [
  { href: "/", icon: Grid2X2, label: "Dashboard" },
  { href: "/bin", icon: Trash2, label: "Bin Status" },
  { href: "/dispose", icon: Combine, label: "Dispose Logs" },
  { href: "/prediction", icon: BrainCog, label: "Prediction" },
];

const renderNavLink = (link: any) => (
  <Link
    key={link.label}
    to={link.href}
    className="flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:text-primary"
  >
    <link.icon className="w-4 h-4" />
    {link.label}
    {link.badge && (
      <Badge className="flex items-center justify-center w-6 h-6 ml-auto rounded-full shrink-0">
        {link.badge}
      </Badge>
    )}
  </Link>
);

const renderNavLinkInSheet = (link: any) => (
  <Link
    key={link.label}
    to={link.href}
    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${
      link.label === "Orders" ? "bg-muted text-foreground" : ""
    }`}
  >
    <link.icon className="w-5 h-5" />
    {link.label}
    {link.badge && (
      <Badge className="flex items-center justify-center w-6 h-6 ml-auto rounded-full shrink-0">
        {link.badge}
      </Badge>
    )}
  </Link>
);

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex flex-col h-full max-h-screen gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 text-primary">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Trash className="w-6 h-6" />
              <span className="">e-SegBin</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinks.map(renderNavLink)}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex items-center gap-4 p-4 lg:px-6 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="w-6 h-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                {navLinks.map(renderNavLinkInSheet)}
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex flex-col flex-1 gap-4 px-6 lg:gap-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
