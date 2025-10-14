import { FC } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import UserMenu from "./user";

export const classes = {
  link: "block px-4 py-2 hover:bg-muted transition-colors",
};

const Menu: FC = () => {
  const pathname = usePathname();
  const showLinks = !/^\/(?:explore|sandbox)/.test(pathname);

  return (
    <nav className="min-w-[150px]">
      <ul className="overflow-hidden py-2">
        <li>
          <a
            href="https://4growth-project.eu/"
            target="_blank"
            rel="noopener noreferrer"
            title="4Growth project site"
            className={classes.link}
          >
            4Growth project site
          </a>
        </li>
        {showLinks && (
          <>
            <li>
              <Link href="/" className={classes.link}>
                Survey analysis
              </Link>
            </li>
            <li>
              <Link href="/projections" className={classes.link}>
                Projections
              </Link>
            </li>
          </>
        )}
        <li>
          <Link href="/about" className={classes.link}>
            About
          </Link>
        </li>
        <li>
          <Link href="/contact-us" className={classes.link}>
            Contact Us{" "}
          </Link>
        </li>
        <UserMenu />
      </ul>
    </nav>
  );
};

export default Menu;
