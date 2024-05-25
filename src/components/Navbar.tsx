import { Bird } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="navbar bg-neutral-100">
      <div className="container">
        <div className="flex-1">
          <Link className="flex items-center gap-1" href="/">
            <Bird />
            <span className="text-md font-bold leading-tight">PIPI BLOG</span>
          </Link>
        </div>
        <div className="flex-none">
          <Link
            href="/create"
            className="btn btn-ghost hover:bg-yellow-400 hover:text-white"
          >
            POST
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
