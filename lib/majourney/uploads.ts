import { adminRequest } from "./api-client";

type PresignResponse = {
  uploadUrl: string;
  publicUrl: string;
  expiresAt: string;
};

/**
 * Uploads a file to Cloudflare R2 via the backend's presigned-URL flow:
 * 1. Ask the backend to sign a PUT URL for this exact content type/length.
 * 2. PUT the file straight to R2 (bytes never touch our backend).
 * 3. Return the public URL to save on the owning resource.
 */
export async function uploadImage(
  file: File,
  folder: string,
  token: string | null
): Promise<string> {
  const presign = await adminRequest<PresignResponse>("/api/admin/uploads/presign", token, {
    method: "POST",
    body: {
      folder,
      contentType: file.type,
      contentLength: file.size,
    },
  });

  const putResponse = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!putResponse.ok) {
    throw new Error(`Upload to storage failed with status ${putResponse.status}.`);
  }

  return presign.publicUrl;
}
