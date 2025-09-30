import AuthenticationShell from "@/components/authentication-shell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "opensheets | login",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage({ children }) {
  return <AuthenticationShell>{children}</AuthenticationShell>;
}
