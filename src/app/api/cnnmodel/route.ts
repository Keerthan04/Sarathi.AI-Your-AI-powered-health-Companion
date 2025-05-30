import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

const SKIN_BACKEND_URL =
  process.env.SKIN_BACKEND_URL || "http://localhost:6000/cnn-predict";
const MOUTH_BACKEND_URL =
  process.env.MOUTH_BACKEND_URL || "http://localhost:7000/cnn-predict-mouth";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Unsupported content type. Expected multipart/form-data." },
        { status: 400 }
      );
    }

    // Read the incoming formData (image file)
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const category = (formData.get("category") as string) || "skin"; // Default to "skin"

    console.log("Category:", category);
    console.log("File:", file?.name, file?.size);

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided or invalid file format" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Convert the File object to a buffer (needed for axios FormData)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const backendForm = new FormData();
    backendForm.append("file", buffer, file.name);

    // Choose the correct backend URL based on category
    const backendUrl =
      category === "skin" ? SKIN_BACKEND_URL : MOUTH_BACKEND_URL;

    console.log("Sending request to:", backendUrl);

    const response = await axios.post(backendUrl, backendForm, {
      headers: {
        ...backendForm.getHeaders(),
      },
      timeout: 30000, // 30 second timeout
    });

    console.log("Backend response:", response.data);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Proxy error details:", error);

    // Handle axios errors specifically
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNREFUSED") {
        return NextResponse.json(
          {
            error:
              "Backend service is not available. Please ensure the Flask server is running.",
          },
          { status: 503 }
        );
      }

      if (error.response) {
        // Backend responded with an error
        return NextResponse.json(
          {
            error: `Backend error: ${
              error.response.data?.error || error.response.statusText
            }`,
          },
          { status: error.response.status }
        );
      }

      if (error.request) {
        // Request was made but no response received
        return NextResponse.json(
          {
            error:
              "No response from backend service. Please check if the Flask server is running.",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: `Failed to process image: ${typeof error === "object" && error !== null && "message" in error ? (error as any).message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
