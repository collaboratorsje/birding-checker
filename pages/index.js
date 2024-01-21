import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { connectToDatabase } from '../utils/mongodb';
import { markBirdAsSeen, unmarkBirdAsSeen } from '../utils/firestoreFunctions';
import { auth, db } from '../utils/firebase';
import { doc, getDoc } from "firebase/firestore";
import SearchBar from '../components/searchBar';
import { useRouter } from 'next/router';

export default function Home({ birds }) {
  const router = useRouter();
  const [seenBirds, setSeenBirds] = useState(new Set());
  const [filteredBirds, setFilteredBirds] = useState(birds);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (router.pathname === '/') {
      console.log('Adding homepageBody class');
      document.body.classList.add('homepageBody');
    }
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          // Adjust to handle the object structure for seenBirds
          setSeenBirds(new Set(userData.seenBirds.map(bird => ({ ...bird }))));
        }
      }
    });

    return () => {
      console.log('Removing homepageBody class');
      document.body.classList.remove('homepageBody');
      unsubscribe();
    };
  }, [router.pathname]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = birds.filter((bird) =>
      bird.common_name.toLowerCase().includes(lowercasedQuery) ||
      bird.scientific_name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredBirds(filtered);
  }, [searchQuery, birds]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCheckboxChange = async (bird) => {
    const user = auth.currentUser;
    if (user) {
      const isSeen = Array.from(seenBirds).some(seenBird => seenBird.id === bird._id);
      if (isSeen) {
        await unmarkBirdAsSeen(user.uid, bird._id);
        setSeenBirds(prevSeenBirds => new Set([...prevSeenBirds].filter(b => b.id !== bird._id)));
      } else {
        await markBirdAsSeen(user.uid, bird._id, bird.common_name, bird.scientific_name);
        setSeenBirds(prevSeenBirds => new Set([...prevSeenBirds, {
          id: bird._id, 
          common_name: bird.common_name, 
          scientific_name: bird.scientific_name
        }]));
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
          <li key={bird._id} className={`listGroupItem ${Array.from(seenBirds).some(seenBird => seenBird.id === bird._id) ? 'seenBird' : ''}`}>
            <span>{bird.common_name}</span> - <span className="scientificName">{bird.scientific_name}</span>
            <div className="customCheckbox">
              <input
                type="checkbox"
                id={`checkbox-${bird._id}`}
                checked={Array.from(seenBirds).some(seenBird => seenBird.id === bird._id)}
                onChange={() => handleCheckboxChange(bird)}
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
    const birds = await db.collection('birds').find({}).sort({ common_name: 1 }).toArray();
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
