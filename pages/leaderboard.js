// Leaderboard.js
import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from "firebase/firestore";

export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const usersRef = collection(db, "users");
                const snapshot = await getDocs(usersRef);
                
                const userData = snapshot.docs.map(doc => ({
                    name: doc.data().displayName || 'Anonymous', // Handle users without displayName
                    seenCount: doc.data().seenBirds ? doc.data().seenBirds.length : 0
                }));

                // Sort by seenCount and get top 10
                const sortedData = userData.sort((a, b) => b.seenCount - a.seenCount).slice(0, 10);

                setLeaderboardData(sortedData);
            } catch (err) {
                console.error("Error fetching leaderboard data:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboardData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading leaderboard. (Seth is still building this, check back later.)</p>;

    return (
        <div>
            <h1>Leaderboard</h1>
            <ul className="list-group">
                {leaderboardData.map((user, index) => (
                    <li key={index} className="list-group-item">
                        {user.name}: {user.seenCount} birds seen
                    </li>
                ))}
            </ul>
        </div>
    );
}


