import Head from "next/head";
import styles from "../styles/Layout.module.css";
import Header from "./Header";
import Footer from "./Footer";
import Showcase from "./Showcase";
import { useRouter } from "next/router";
export default function Layout(props) {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
        <meta name="keywords" content={props.keywords} />
      </Head>
      <Header />
      {router.pathname === "/" && <Showcase />}
      <div className={styles.container}>{props.children}</div>
      <Footer />
    </div>
  );
}

Layout.defaultProps = {
  title: "Dj Events | Find the hottest parties",
  description: "Find the latest DJ and other musical events",
  keywords: "music, dj, edm, events",
};
