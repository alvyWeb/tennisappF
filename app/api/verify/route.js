import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { cert, getApps, initializeApp } from "firebase-admin/app";

const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCZfh+H50MdinLp\nLhOgcZiNmctk7cRxyJtLBWXilMwwIrb6atBDQZclqmlWUaKWO3brnrpF8rL2ESTZ\nUjQ82HmvKaL6GIH10Gp4A7YGSaHk0rUw+Ir3RY0Ls7tV0JsCPFHc7UgKraiFo69z\n/NbCcZzAT7Wz2MJsgt59ulsx8JZMO1MEv4w+sDjX4q8Sx6omOHmTuACVPrv+OvYT\nMRMYFNOK8/0/Ouuz5hiXJMXDfUNNTU6H6Sut1TnnVEq2iYz1KdecogLtNgNqhkyA\nkOGOrRTVno0k6iBRCJSinZ1ozRfYc4Z+Vikf6Wlht1gTpoVA8KZO5RmxGIF6n/ee\nYf5fY/hNAgMBAAECggEACEQwG4gbZ7hglulJ2k6z2hBp0U4y0bPtlR09zvWXh5If\nC558B9s88iTa1nDAEloyfd8HBiRbegATXXbdZFd+Oi5CXji6qwvl5/+/KliF1QZ6\nBqCkD0waHAK6eJUq+/RWrlDDG/wdQtE9bkA0KrWmrP69+OkYE3L624eRSL+9wG4u\nEg8flUPntocmarUHYVcAdZr25/QCXlPyrQLE3dNxSCDDBnLMaFXvNF89F6apZRbD\nFD5cciSPniMBeGDFFDVCkesyQ9KdUoYgWzSqcd/vRZ9z1HFNkIH8KAlsQg8jG19j\nj/lIrwd1+bX7IQodqfOzho24ddmNlIjbgpk8uKl+uwKBgQDVZ06jq8B6y8uDSI75\nagoWr3+Ft0qAVKICgTjFgLPANmzpf6iXzgfAftnrDrvGdacaAS/mMnNITL1uFZAV\n667pSJ5vXWio2+ec/eRvX/naCZ7HMVam0VxA9m47jz1sDYmeu7Qu+Ax3D4su1K4o\ndE7mCTX4lT1oZ0wYQiKkRuhqxwKBgQC4IW8xlcQdweaUNZu5z6DRv4ZzVGd2WjBT\nD5k5IWuoRL+2kPueH8vhxhUAk1YsiCSwHpvrLhBBHs4oy5sINeGURG/HtePT9v8W\nst6Eo4VXxN/vcnXYT6dYtkLfL4THf7wtzKc5arC8/3QWdXW37iaz9an6hFYnGp8e\n5rE0Bh3QSwKBgExbzL2vxQ2rQkTVf6MrGDUJ0t1rulK09ctjpYa2CJtsXggmz5KR\n/CAaw6rh+LqIeqRJbHQ39RwXqWhsesP9MvbyLw62I67YEMYR6t0XQHWOH6wysUi7\nfQEZrFPPazDwnx+XFmAADaXEgA7ftvlutJSHEzLBY9mprIa5k1+op50dAoGAXEnl\nwaSfN4sIVyDHfMpkgLzOVt/nO5rYvckDs27c1uoebRMeCpNFTVRLEo7GkmtqeBvf\nanEcFIesLSZf/i2Dcx0aKa8xEfyqvmXIwhJzsxoqY4mrJ1BFQGGaAuN+Wb/cQdhh\nuJWRICmptdgJuLbVDz4ChF3wEIl3V7Wo+7pVFyECgYEAqn6N3IQ423Fx3PaQS4bK\n1JNbGoEXBjg6g2VELMIkgM37T+lNUTDIWMICNPzEsVD80ZWvFS9zFh0RQMlnnkTj\n8RHmrsfLg50c9ijeLBmU1grvqFmyL47/jFgPgBL5gJJLCBbYJg5Qqgr//4qMqxZa\n4hKol9rkvsGgKr1G6H0nhmY=\n-----END PRIVATE KEY-----\n";

// if (!privateKey) {
//     throw new Error("Missing FIREBASE_PRIVATE_KEY in environment variables");
// }

// Initialize Admin only once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "atpenn-4fc94",
      clientEmail: "firebase-adminsdk-9hahq@atpenn-4fc94.iam.gserviceaccount.com",
      privateKey: privateKey?.replace(/\\n/g, '\n'),
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
