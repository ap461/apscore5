import Image from "next/image";
import Link from "next/link";
import type { GetNavigationReturn } from "@/lib/prismic";
import { IMAGE_PATHS } from "@/config/endpoints";

interface FooterProps {
  nav: GetNavigationReturn;
}

/**
 * Server component — site-wide footer.
 * All link groups and text come from Prismic navigation document.
 */
export default function Footer({ nav }: FooterProps) {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          {/* Brand column */}
          <div>
            <Image
              src={IMAGE_PATHS.logoDark}
              alt="APScore5"
              width={160}
              height={42}
              className="footer-logo"
            />
            <p>{nav.footerTagline}</p>
            <p className="disc">{nav.footerDisclaimer}</p>
          </div>

          {/* AP Courses column */}
          <div>
            <h4>AP Courses</h4>
            {nav.footerCourses.map((link) => (
              <Link key={link.url} href={link.url}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Site column */}
          <div>
            <h4>Site</h4>
            {nav.footerSite.map((link) => (
              <Link key={link.url} href={link.url}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Company column */}
          <div>
            <h4>Company</h4>
            {nav.footerCompany.map((link) => (
              <Link key={link.url} href={link.url}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
