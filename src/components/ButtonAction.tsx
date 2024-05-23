import { Pen, Trash } from "lucide-react";
import Link from "next/link";

const ButtonAction = () => {
  return (
    <div>
      <Link href="/edit/1" className="btn mr-2">
        <Pen />
        Edit
      </Link>
      <button className="btn btn-error">
        <Trash />
        Delete
      </button>
    </div>
  );
};

export default ButtonAction;
