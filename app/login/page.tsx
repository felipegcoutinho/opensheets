import LoginScreen from "./login-screen";

export default async function Login(props) {
  const searchParams = await props.searchParams;

  return <LoginScreen searchParams={searchParams} />;
}
