import { ProfileForm } from "./profile";

function page() {
  return (
    <div className="mt-4 w-full">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Ajustes</h3>
          <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>

          <ProfileForm />
        </div>
      </div>
    </div>
  );
}

export default page;
