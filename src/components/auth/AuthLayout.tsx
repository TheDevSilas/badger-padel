import { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="min-h-screen flex items-center justify-center px-4 w-full">
        {children}
      </div>
    </div>
  );
}
