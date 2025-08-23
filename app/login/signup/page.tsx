import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignupForm from "./signup-form";
import Link from "next/link";

export default async function SignUp(props) {
  const searchParams = await props.searchParams;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Criar conta</CardTitle>
        <CardDescription className="text-muted-foreground normal-case">
          Entre com seu nome, email e senha para criar sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
        {searchParams?.message && (
          <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
            {searchParams.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
