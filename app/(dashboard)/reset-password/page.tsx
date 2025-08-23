import { resetPasswordAction } from "@/app/actions/auth/auth";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword(props) {
  const searchParams = await props.searchParams;

  return (
    <form className="flex w-full max-w-md flex-col gap-2 p-4 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Reset password</h1>
      <p className="text-foreground/60 text-sm">
        Please enter your new password below.
      </p>
      <Label htmlFor="password">New password</Label>
      <PasswordInput name="password" placeholder="New password" required />
      <Label htmlFor="confirmPassword">Confirm password</Label>
      <PasswordInput name="confirmPassword" placeholder="Confirm password" required />
      <SubmitButton formAction={resetPasswordAction}>
        Reset password
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
