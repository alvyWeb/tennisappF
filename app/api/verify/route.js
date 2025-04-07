import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase-admin/firestore";

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
const db = getFirestore();

// API route to update and fetch data
export async function POST(req) {
  const body = await req.json();
  const { token, fileInputCover, fileInputProfile,  fullName, nickName, birthday, strongHand, backhand, country, city } = body;

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Update or create a user document in Firestore
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      coverImage: fileInputCover || "",
      profileImage: fileInputProfile || "",
      name: fullName || "",
      nickName: nickName || "",
      birthday: birthday || "",
      strongHand: strongHand || "",
      backHand: backhand || "",
      country: country || "",
      city: city || "",
    }, { merge: true });

    return NextResponse.json({ success: true, uid, email: decodedToken.email });
  } catch (error) {
    console.error("Error updating or saving user data:", error);
    return NextResponse.json({ error: "Failed to update or fetch user data" }, { status: 500 });
  }
}


export async function GET(req) {
  const { token } = req.url.searchParams;

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Fetch the user document from Firestore
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: userDoc.data() });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}


const fetchUserData = async (token) => {
  const res = await fetch("/api/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token })
  });

  const data = await res.json();
  if (data.success) {
    console.log("User Data:", data.data);
  } else {
    console.error("Error fetching data:", data.error);
  }
};

const updateUserData = async (token, fileInputCover, fileInputProfile,  fullName, nickName, birthday, strongHand, backhand, country, city) => {
  const res = await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, fileInputCover, fileInputProfile,  fullName, nickName, birthday, strongHand, backhand, country, city })
  });

  const data = await res.json();
  if (data.success) {
    console.log("User data updated successfully");
  } else {
    console.error("Error updating data:", data.error);
  }
};

