import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/add-debt", label: "Add Debt" },
  { href: "/customers", label: "Customers" },
  { href: "/settings", label: "Settings" },
];

export function Nav() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-3">
        <span className="font-semibold text-gray-900">Kitabu ya Deni</span>
        <div className="flex gap-4 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-600 hover:text-gray-900">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}