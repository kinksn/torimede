"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <button className="btn" onClick={() => router.back()}>
      <ArrowLeft />
      Back
    </button>
  );
};

export default BackButton;
