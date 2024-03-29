import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [seenBirds, setSeenBirds] = useState([]);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setSeenBirds(userData.seenBirds || []);
        }
      }).catch((error) => {
        console.error("Error fetching seen birds:", error);
      });
    }
  }, [user]);

  const signOut = () => {
    auth.signOut().then(() => {
      route.push("/auth/login");
    });
  };

  if (loading) return <h1>Loading...</h1>;
  if (!user) {
    route.push("/auth/login");
    return null;
  }

  return (
    <div>
      <h2>Welcome to your dashboard, {user.displayName}!</h2>
      <div id="birdCountContainer">
        <h3>Bird Species Seen: {seenBirds.length}</h3>
      </div>
      <ul>
        {seenBirds.map((bird, index) => (
          <li key={index} className={`listGroupItem ${bird.id ? 'seenBird' : ''}`}>
            <span>{bird.common_name}</span> - <span className="scientificName">{bird.scientific_name}</span>
            {/* Removed checkbox for non-interactive display */}
          </li>
        ))}
      </ul>
    </div>
  );
}







