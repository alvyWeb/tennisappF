"use client";

import { useState } from "react";
import AuthForm from "./AuthForm";
import UserProfileForm from "./UserProfileForm";

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
