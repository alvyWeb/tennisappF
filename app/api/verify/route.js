import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { cert, getApps, initializeApp } from "firebase-admin/app";

// const privateKey = process.env.FIREBASE_PRIVATE_KEY;

// if (!privateKey) {
//     throw new Error("Missing FIREBASE_PRIVATE_KEY in environment variables");
// }

// Initialize Admin only once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "atpenn-4fc94",
      clientEmail: "firebase-adminsdk-9hahq@atpenn-4fc94.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC56XM1rucpkMT6\nqNolYy9Zzcn+m4fvB8CwWiUwuDGBDPx4ZY5FBaGtnXxreCsATHheUI7q0/PHQlKi\nsS7v5hN/G2tdT/B9A7g++Pff4M8nz4s8+G2N1B2aNY2FmG7hEF6rx62R3dHos0w+\njkiF6sH9IeHF2JRIvcqN7XWJrToacIDESSrP2sH2D6XFZLawOIWDoedcdgTd0F9Y\nKGHpjGY2MKekOyrGAkLisehpR7xOW7NMmvuTptNMt5FVuUzh+GHQ9YlxXgNISM9b\nEg6YxDSg56MKlc7AJQuWgi36rIdLpYpSkUHgdVPEETGfyV5ctt6oKUW3kQCdE/9q\nqxZr5f/ZAgMBAAECggEAB2g/lgrPHK8EciTqdXqOB0AgRVvcCXrfw1xWxqn9avIM\nrcgEvZzw/qew2TVTUp05Xy9K1Ry3G0rPW7pp2iwVaHHmurPggJKhM30cSdgSrjg3\niNPbGuoHIz7xUbqA5x24WpQc8ca1Qitr+m1qgqTCWua6hfVQSdT/WN1LsBMYprdK\n/9UA4ta9wQE4n2FO0Rhvq6Bo7jdTAIoAV1PGmlLHtDx9qURnm2RTagq2E+5ccdSh\nDrxDO/247qEhh3JtdDez1vC3SlxHLyeoLUQ98Lk2P/i4IvP4yO/jisTIv6v169AU\nRMVq3i2etWYCs7ZNrfdndocHyHCyzyKdxZZfGWVcOwKBgQDwh4G/UQUEezGWy6Ah\nfiFGFsoYRJNx7zc+862tAoVcLzOUzZ1I8PjUgDVIuECUPAl/8sDUzhczQ8oSGSz6\n18H/pkvmk4Hkn4xVGc2y36BW5WRAxpaUlgZkXIg90IKgSBHYDuUGTznLpUT3je93\nwknuz4+vro4pZw77HJdYUfOodwKBgQDF3qCO4x4qqBU1yi0TGv5q3gXZhbK1dKbd\nK31xOnzdYnUiWjrGjD+Vum7i6r9BixVYQpn8p6FYZe3j1bEL3IKe44Mys2r+NtyJ\ndW65Y06dSRpfNZ+ZG/wg8dG5N6PbCuWy/3vWCXr5ma+0G7hVIjxuHNIG5iSoEeH1\nypc+3hz+LwKBgEOvPhmiKPFL4XZ3soX6Qk7A1vnhQkSLdlZmp/bJgNGiDrfO7HW8\nKalSsqvV/YY5Jss0eoLnw6uPZeuV3gxwbo0MNMubsq+tHgZMjo/JUgth3cZEm9cQ\nKJhRWZ1bcYa9ARh1iIkv/imKRlALRtnCeJ+VFO/xBNwtvg93yjb2SMSdAoGAWK+m\nCyUk2j2n9AoAFfYdXkzRFmPka4wzViIuAVgTqy58Db+fZGpr/XIoTTCmNHxgPsTr\nO+DuYi6dZ2baCdT1/r0+irT8GaEBS+MEk7c8/yZK2a2xMPDoGuQH+hpEKONDfO0h\n1hc9tS37IKDkB9RmfXwRbuIsP+B0BLSfAaCQIiUCgYAGfFstk/1MNqH9WM1N4GiL\ngIPh7ddYmir2aWLzfn7fy1pabm8ar46lZKqegzMTndTSgM3Vm8z34VER6LZsvm7C\nBLwBEK1+KcmdvEYv++P+StrXjqd2TFidZHohTThhc69xCr3EeRF2ZADKOlDAbSh/\neUutREWZMD0GILVpQVRVvw==\n-----END PRIVATE KEY-----\n",
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
