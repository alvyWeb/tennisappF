"use client";

import { useState } from "react";
import AuthForm from "../components/AuthForm";
import UserProfileForm from "../app/info/page";

export default function MainPage() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <AuthForm onLogin={setUser} />
      ) : (
        <UserProfileForm />
      )}
    </div>
  );
}
