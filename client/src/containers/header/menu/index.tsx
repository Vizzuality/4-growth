import { FC } from "react";

import Link from "next/link";

import UserMenu from "./user";

export const classes = {
  link: "block px-4 py-2 hover:bg-muted transition-colors",
};

const Menu: FC = () => {
  return (
    <nav className="min-w-[150px]">
      <ul className="overflow-hidden py-2">
        <li>
          <Link href="/about" className={classes.link}>
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" className={classes.link}>
            Contact{" "}
          </Link>
        </li>
        <UserMenu />
      </ul>
    </nav>
  );
};

export default Menu;
