"use client";
import * as React from "react";
import {
  Button,
  IconButton,
  Typography,
  Collapse,
  Navbar,
} from "@material-tailwind/react";
import {
  Clock,
  Menu,
  ProfileCircle,
  Xmark,
} from "iconoir-react";
import { useAuth } from "react-oidc-context";

const LINKS = [
  {
    icon: Clock,
    title: "History",
    href: "#",
  },
  {
    icon: ProfileCircle,
    title: "Account",
    href: "#",
  },
];

function NavList() {
  return (
    <ul className="mt-4 flex flex-col gap-x-3 gap-y-1.5 lg:mt-0 lg:flex-row lg:items-center">
      {LINKS.map(({ icon: Icon, title, href }) => (
        <li key={title}>
          <Typography
            as="a"
            href={href}
            type="small"
            className="flex items-center gap-x-2 p-1 hover:text-primary"
          >
            <Icon className="h-4 w-4" />
            {title}
          </Typography>
        </li>
      ))}
    </ul>
  );
}

export default function NavbarDemo() {
  const [openNav, setOpenNav] = React.useState(false);
  const auth = useAuth();

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  const signOutRedirect = () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const logoutUri = "http://localhost:3001/"; // Update this for production
    const cognitoDomain = "https://us-west-27i0e8mdwo.auth.us-west-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <Navbar className="mx-auto w-full max-w-screen-xl">
      <div className="flex items-center">
        <Typography
          as="a"
          href="/"
          type="small"
          className="ml-2 mr-2 block py-1 font-semibold"
        >
          YT-Translator
        </Typography>
        <hr className="ml-1 mr-1.5 hidden h-5 w-px border-l border-t-0 border-secondary-dark lg:block" />
        <div className="hidden lg:block">
          <NavList />
        </div>
        {auth.isAuthenticated ? (
          <Button
            size="lg"
            className="hidden lg:ml-auto lg:inline-block p-2 rounded-lg"
            onClick={() => auth.removeUser()}
          >
            Sign Out
          </Button>
        ) : (
          <Button
            size="lg"
            className="hidden lg:ml-auto lg:inline-block p-2 rounded-lg"
            onClick={() => auth.signinRedirect()}
          >
            Sign In
          </Button>
        )}
        <IconButton
          size="sm"
          variant="ghost"
          color="secondary"
          onClick={() => setOpenNav(!openNav)}
          className="ml-auto grid lg:hidden"
        >
          {openNav ? <Xmark className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </IconButton>
      </div>

      <Collapse open={openNav}>
        <NavList />
        {auth.isAuthenticated ? (
          <Button
            isFullWidth
            size="sm"
            className="mt-4 px-2 rounded-lg"
            onClick={() => auth.removeUser()}
          >
            Sign Out
          </Button>
        ) : (
          <Button
            isFullWidth
            size="sm"
            className="mt-4 px-2"
            onClick={() => auth.signinRedirect()}
          >
            Sign In
          </Button>
        )}
      </Collapse>
    </Navbar>
  );
}
