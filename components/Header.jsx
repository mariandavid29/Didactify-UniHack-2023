import logo from "../app/assets/elearning.png";
import Image from "next/image";
import Link from "next/link";

function Header({ children }) {
  return (
    <nav className="mx-auto flex h-32 w-[95%] max-w-6xl items-center justify-between sm:w-[90%]">
      <Link className="flex items-center justify-center gap-2" href="/">
        <Image
          src={logo}
          alt="Didactify logo"
          priority
          className=":h-8 w-8 lg:h-9 lg:w-9"
        />
        <p className="font-handwrite text-2xl sm:text-2xl">Didactify</p>
      </Link>
      {children}
    </nav>
  );
}

export default Header;
