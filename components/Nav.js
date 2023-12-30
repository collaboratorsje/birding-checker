// Nav.js
import Link from 'next/link';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../utils/firebase';
import SignOutButton from './SignOutButton'; // Import the SignOutButton component

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="relative flex justify-between items-center py-10">
      <Link href="/" passHref>
        <a title="Home">
          <Image
            src="/bird_samr.png"
            alt="birdsamr"
            width={80}
            height={80}
            layout="intrinsic"
            className="hover:opacity-80 cursor-pointer"
          />
        </a>
      </Link>

      <h1 className="title absolute left-1/2 transform -translate-x-1/2 text-4xl font-bold text-brown">
        <Image
          src="/bird-checker.png"
          alt="bird checker"
          width={280}
          height={90}
          layout="intrinsic"
          className="hover:opacity-80 cursor-pointer"
        />
      </h1>

      <ul className="flex items-center gap-10">
        {!user && (
          <Link href="/auth/login">
            <a className="py-2 px-4 text-lg bg-teal-500 text-white rounded-lg font-medium ml-8">
              Join now
            </a>
          </Link>
        )}
        {user && (
          <div className="flex items-center">
            <Link href="/dashboard">
              <a>
                <img
                  referrerPolicy="no-referrer"
                  src={user.photoURL}
                  alt="User Photo"
                  height={50}
                  width={50}
                  className="rounded-full mr-2"
                />
              </a>
            </Link>
            <SignOutButton />
          </div>
        )}
      </ul>
    </nav>
  );
}



