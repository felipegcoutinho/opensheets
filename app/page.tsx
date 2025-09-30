import AuthenticationShell from "@/components/authentication-shell";
import LoginScreen from "./login/login-screen";

export const metadata = {
  title: "opensheets | login",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;

  return (
    <AuthenticationShell>
      <LoginScreen searchParams={resolved} />
    </AuthenticationShell>
  );
}
