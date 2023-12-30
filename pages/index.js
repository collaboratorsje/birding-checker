// pages/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { connectToDatabase } from '../utils/mongodb';
import { markBirdAsSeen, unmarkBirdAsSeen } from '../utils/firestoreFunctions';
import { auth, db } from '../utils/firebase';
import { doc, getDoc } from "firebase/firestore";
import SearchBar from '../components/searchBar';

export default function Home({ birds }) {
  const [seenBirds, setSeenBirds] = useState(new Set());
  const [filteredBirds, setFilteredBirds] = useState(birds);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setSeenBirds(new Set(userData.seenBirds || []));
        }
      }
    });

    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = birds.filter((bird) =>
      bird.common_name.toLowerCase().includes(lowercasedQuery) ||
      bird.scientific_name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredBirds(filtered);

    return () => unsubscribe();
  }, [searchQuery, birds]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCheckboxChange = async (birdId) => {
    const user = auth.currentUser;
    if (user) {
      if (seenBirds.has(birdId)) {
        await unmarkBirdAsSeen(user.uid, birdId);
        setSeenBirds(prevSeenBirds => new Set([...prevSeenBirds].filter(id => id !== birdId)));
      } else {
        await markBirdAsSeen(user.uid, birdId);
        setSeenBirds(new Set([...seenBirds, birdId]));
      }
    }
  };

  return (
    <div>
      <Head>
        <title>Bird-Checker</title>
        <meta name="description" content="A list of birds" />
      </Head>

      <SearchBar onSearch={handleSearch} />
      <h1>Birds</h1>
      <ul className="list-group">
        {filteredBirds.map((bird) => (
          <li key={bird._id} className={`listGroupItem ${seenBirds.has(bird._id) ? 'seenBird' : ''}`}>
            <span>{bird.common_name}</span> - <span className="scientificName">{bird.scientific_name}</span>
            <div className="customCheckbox">
              <input
                type="checkbox"
                id={`checkbox-${bird._id}`}
                checked={seenBirds.has(bird._id)}
                onChange={() => handleCheckboxChange(bird._id)}
              />
              <label htmlFor={`checkbox-${bird._id}`}></label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const { db } = await connectToDatabase();
    const birds = await db.collection('birds').find({}).toArray();
    return {
      props: {
        birds: JSON.parse(JSON.stringify(birds)),
      },
    };
  } catch (error) {
    console.error("Failed to fetch birds:", error);
    return { props: { birds: [] } };
  }
}