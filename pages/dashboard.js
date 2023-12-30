import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getNumberOfBirdsSeen } from "/utils/firestoreFunctions";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [birdsSeenCount, setBirdsSeenCount] = useState(null);

  useEffect(() => {
    if (user) {
      getNumberOfBirdsSeen(user.uid)
        .then((count) => {
          setBirdsSeenCount(count);
        })
        .catch((error) => {
          console.error("Error fetching birds seen count:", error);
        });
    }
  }, [user]);

  const signOut = () => {
    auth.signOut().then(() => {
      route.push("/auth/login");
    });
  };

  if (loading) return <h1>Loading</h1>;
  if (!user) {
    route.push("/auth/login");
    return null;
  }

  return (
    <div>
      <h2>Welcome to your dashboard {user.displayName}!</h2>
      {birdsSeenCount !== null && (
        <div id="birdCountContainer">
          <h3>Bird Species Seen: {birdsSeenCount}</h3>
        </div>
      )}
    </div>
  );
}


