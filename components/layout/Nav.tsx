import Link from "next/link";
import Image from "next/image";
import type { GetNavigationReturn } from "@/lib/prismic";
import { SITE_ROUTES, IMAGE_PATHS } from "@/config/endpoints";

interface NavProps {
  nav: GetNavigationReturn;
}

/**
 * Server component — sticky top navigation bar.
 * Links come from Prismic navigation document.
 */
export default function Nav({ nav }: NavProps) {
  return (
    <div className="nav-wrap">
      <nav className="container nav" aria-label="Main navigation">
        <Link href={SITE_ROUTES.home} aria-label="APScore5 Home">
          <Image
            src={IMAGE_PATHS.logoLight}
            alt="APScore5 logo"
            width={220}
            height={90}
            className="brand-logo"
            priority
          />
        </Link>

        <div className="nav-links">
          {nav.navLinks.map((link) => (
            <Link key={link.url} href={link.url} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <Link href={SITE_ROUTES.login} className="nav-login">
            Log in
          </Link>
          <Link href={SITE_ROUTES.signup} className="btn btn-p">
            Start Free
          </Link>
        </div>
      </nav>
    </div>
  );
}
