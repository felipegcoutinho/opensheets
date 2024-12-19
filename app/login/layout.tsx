import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenSheets | Login",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage({ children }) {
  return (
    <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 rounded bg-primary-color dark:bg-green-950" />
      </div>
      <div className="mx-auto lg:p-8">{children}</div>
    </div>
  );
}
