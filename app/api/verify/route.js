import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { cert, getApps, initializeApp } from "firebase-admin/app";

const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!privateKey) {
    throw new Error("Missing FIREBASE_PRIVATE_KEY in environment variables");
}

// Initialize Admin only once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const auth = getAuth();

export async function POST(req) {
  const body = await req.json();
  const token = body.token;

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // You can create user session here or fetch custom data
    return NextResponse.json({ success: true, uid, email: decodedToken.email });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
