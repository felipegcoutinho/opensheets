export async function uploadImagem(
  imageFile: FormDataEntryValue | null,
  supabase: any,
): Promise<string | null> {
  if (!(imageFile instanceof File) || !imageFile.name) return null;

  const fileName = `${Date.now()}_${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("comprovantes")
    .upload(fileName, imageFile, { upsert: true });

  if (uploadError) {
    console.error("Erro ao fazer upload:", uploadError);
    return null;
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("comprovantes")
    .createSignedUrl(fileName, 31536000);

  if (signedUrlError) {
    console.error("Erro ao gerar Signed URL:", signedUrlError);
    return null;
  }

  return signedUrlData?.signedUrl || null;
}
