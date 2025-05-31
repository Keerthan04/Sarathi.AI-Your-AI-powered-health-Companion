import { loginPatient } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400 }
      );
    }
    const loginResult = await loginPatient(email, password);
    if (!loginResult) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
    console.log("Login successful:", loginResult);
    return NextResponse.json(
      { message: "Login successful", patient: loginResult },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}