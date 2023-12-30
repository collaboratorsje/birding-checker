import Nav from "./Nav";
import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/bird_samr.png" /> {/* Add your favicon link here */}
      </Head>
      <div className="mx-14">
        <Nav />
        <main>{children}</main>
      </div>
    </>
  );
}
