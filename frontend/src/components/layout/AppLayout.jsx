import { Link, NavLink, Outlet } from "react-router-dom";

import useCart from "../../hooks/useCart";

function AppLayout() {
  const { itemCount } = useCart();

  const baseLinkClass =
    "rounded-md px-3 py-2 text-sm font-medium transition-colors";
  const getNavClass = ({ isActive }) =>
    isActive
      ? `${baseLinkClass} bg-zinc-900 text-white`
      : `${baseLinkClass} text-zinc-700 hover:bg-zinc-200`;

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Wise Sales Store
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink to="/" className={getNavClass} end>
              Catálogo
            </NavLink>
            <NavLink to="/cart" className={getNavClass}>
              Carrinho
              <span className="ml-2 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-white">
                {itemCount}
              </span>
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;