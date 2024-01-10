// Nav.js
import Link from 'next/link';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../utils/firebase';
import SignOutButton from './SignOutButton'; // Import the SignOutButton component

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center py-10">
      {/* Left-aligned items container */}
      <div className="flex items-center">
        {/* Home link with bird image */}
        <Link href="/" passHref>
          <a title="Home" className="hover:opacity-80 cursor-pointer">
            <Image
              src="/bird_samr.png"
              alt="birdsamr"
              width={60}
              height={60}
              layout="fixed"
            />
          </a>
        </Link>
      </div>

      {/* Center-aligned item - bird checker image */}
      {/* The margin-auto on the left and right will push the element to the center */}
      <div className="mx-auto">
        <Link href="/leaderboard" passHref>
          <a className="hover:opacity-80 cursor-pointer">
            <Image
              src="/bird-checker.png"
              alt="bird checker"
              width={202}
              height={65}
              layout="intrinsic"
              priority // This ensures the image is preloaded
            />
          </a>
        </Link>
      </div>

      {/* Right-aligned items container */}
      <div className="flex items-center">
        {/* Conditionally rendered login/join now button or user image */}
        {!user && (
          <Link href="/auth/login">
            <a className="py-2 px-4 text-lg bg-teal-500 text-white rounded-lg font-medium ml-8">
              Join now
            </a>
          </Link>
        )}
        {user && (
          <>
            <Link href="/dashboard">
              <a className="hover:opacity-80 cursor-pointer">
                <Image
                  referrerPolicy="no-referrer"
                  src={user.photoURL}
                  alt="User Photo"
                  width={40}
                  height={40}
                  layout="fixed"
                  className="rounded-full"
                />
              </a>
            </Link>
            <SignOutButton />
          </>
        )}
      </div>
    </nav>
  );
}



