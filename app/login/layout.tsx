import Header from "@/components/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "opensheets | Login",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] w-full items-center justify-center p-6 md:p-10">
      <Header />
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
