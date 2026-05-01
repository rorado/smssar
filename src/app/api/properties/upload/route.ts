import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "SELLER") {
    return NextResponse.json(
      { error: "Only sellers can upload files." },
      { status: 403 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  // Convert Blob to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, (err, result) => {
          if (err || !result) return reject(err || new Error("Upload failed"));
          resolve(result);
        })
        .end(buffer);
    });
    return NextResponse.json({ url: (upload as any).secure_url });
  } catch (error) {
    return NextResponse.json(
      { error: "Cloudinary upload failed." },
      { status: 500 },
    );
  }
}
