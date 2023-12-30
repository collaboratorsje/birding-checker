import { auth } from '../utils/firebase';
import { useRouter } from 'next/router';

export default function SignOutButton() {
  const route = useRouter();

  const signOut = () => {
    auth.signOut().then(() => {
      route.push('/auth/login');
    });
  };

  return (
    <button
      onClick={signOut}
      className="sign-out-button"
    >
      Sign out
    </button>
  );
}