CREATE OR REPLACE FUNCTION delete_user_from_auth() 
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER on_profile_deleted
  AFTER DELETE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE delete_user_from_auth();

CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE USING (auth.uid() = id);
