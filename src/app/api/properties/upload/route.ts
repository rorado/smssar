import { NextResponse } from "next/server";
import { type UploadApiResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  if (
    !session?.user?.id ||
    (session.user.role !== "SELLER" && session.user.role !== "ADMIN")
  ) {
    return NextResponse.json(
      { error: "Only admins and sellers can upload files." },
      { status: 403 },
    );
  }
  const propertyUploadsFolder = `kirae/properties/${session.user.email || session.user.id}`;

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  // Convert Blob to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const upload = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "auto", folder: propertyUploadsFolder },
          (err, result) => {
            if (err || !result) {
              const error = err || new Error("Upload failed");
              console.error("Cloudinary upload stream error:", error);
              return reject(error);
            }
            resolve(result);
          },
        )
        .end(buffer);
    });
    return NextResponse.json({
      url: upload.secure_url,
      publicId: upload.public_id,
      resourceType: upload.resource_type,
    });
  } catch (error) {
    console.error("Upload error details:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Cloudinary upload failed.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (
    !session?.user?.id ||
    (session.user.role !== "SELLER" && session.user.role !== "ADMIN")
  ) {
    return NextResponse.json(
      { error: "Only admins and sellers can delete files." },
      { status: 403 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    publicId?: string;
    resourceType?: "image" | "video" | "raw";
  } | null;

  if (!body?.publicId) {
    return NextResponse.json(
      { error: "publicId is required." },
      { status: 400 },
    );
  }

  try {
    await cloudinary.uploader.destroy(body.publicId, {
      resource_type: body.resourceType ?? "image",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Cloudinary delete failed." },
      { status: 500 },
    );
  }
}
