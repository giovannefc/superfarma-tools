import {
  ArrowLeftRight,
  CreditCard,
  FileText,
  Home,
  Menu,
  Receipt,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { NavLink, Outlet, useLoaderData } from "react-router";

import logo_short from "~/assets/logo_sort.png";
import logo from "~/assets/sfp_logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { cn } from "~/lib/utils";
import { findAll as findAllParceiros } from "~/models/parceiro.server";
import { requireUser } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const parceiros = await findAllParceiros(user.id);

  return {
    user,
    parceiros,
  };
}

const navigationGroups = [
  {
    label: "Home",
    items: [
      { name: "Dashboard", href: "/panel", icon: Home, restrict: false },
      {
        name: "Orçamentos",
        href: "/panel/orcamentos",
        icon: FileText,
        restrict: false,
      },
      {
        name: "Empréstimos",
        href: "/panel/emprestimos",
        icon: ArrowLeftRight,
        restrict: false,
      },
      {
        name: "Conferência Cartões",
        href: "/panel/conciliations",
        icon: CreditCard,
        restrict: true,
      },
    ],
  },
  {
    label: "Relatórios",
    items: [
      {
        name: "Balanço",
        href: "/panel/relatorios",
        icon: TrendingUp,
        restrict: true,
      },
      {
        name: "Vendas",
        href: "/panel/relatorios/vendas",
        icon: ShoppingCart,
        restrict: true,
      },
      {
        name: "Despesas",
        href: "/panel/relatorios/despesas",
        icon: Receipt,
        restrict: true,
      },
    ],
  },
];

const userNavigation = [{ name: "Sair", href: "/logout" }];

// Componente para o conteúdo do sidebar
function SidebarContent({
  isAdmin,
  onNavigate,
}: {
  isAdmin: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="bg-muted/10 flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <NavLink
          to="/panel"
          onClick={onNavigate}
          className="flex items-center gap-2 font-semibold"
        >
          <img className="w-auto opacity-90" src={logo} alt="SFP" />
        </NavLink>
      </div>

      {/* Navigation */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2">
        {navigationGroups
          .map(group => ({
            ...group,
            items: group.items.filter(
              item => !item.restrict || (item.restrict && isAdmin),
            ),
          }))
          .filter(group => group.items.length > 0)
          .map(group => (
            <div
              key={group.label}
              className="relative flex w-full min-w-0 flex-col"
            >
              {/* Group Label */}
              <div className="text-muted-foreground/70 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium">
                {group.label}
              </div>

              {/* Group Items */}
              <ul className="flex w-full min-w-0 flex-col gap-1">
                {group.items.map(item => (
                  <li key={item.name} className="group/menu-item relative">
                    <NavLink
                      to={item.href}
                      end={
                        item.href === "/panel" ||
                        item.href === "/panel/relatorios"
                      }
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          "hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm transition-all",
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground",
                        )
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function Panel() {
  const { user } = useLoaderData<typeof loader>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop sidebar */}
      <div className="bg-muted/40 hidden border-r md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <SidebarContent isAdmin={user.isAdmin} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col">
        {/* Top header */}
        <header className="bg-muted/40 flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
          {/* Mobile menu button */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SidebarContent
                isAdmin={user.isAdmin}
                onNavigate={() => setSidebarOpen(false)}
              />
            </SheetContent>
          </Sheet>

          {/* Spacer */}
          <div className="w-full flex-1" />

          {/* Header actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={logo_short} alt="SFP" />
                    <AvatarFallback>
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.email}</p>
                    <p className="text-muted-foreground text-xs">
                      {user.isAdmin ? "Administrador" : "Usuário"}
                    </p>
                  </div>
                </div>
                <Separator />
                {userNavigation.map(item => (
                  <DropdownMenuItem key={item.name} asChild>
                    <a href={item.href}>{item.name}</a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
