import { FaPencilAlt, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import styles from "@/styles/Event.module.css";

export default function EventPage({ evt }) {
  const deleteEvent = (event) => {};

  return (
    <Layout>
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${evt.id}`}>
            <a>
              <FaPencilAlt /> Edit Event
            </a>
          </Link>
          <a href="#" className={styles.delete} onClick={deleteEvent}>
            <FaTimes /> Delete Event
          </a>
        </div>

        <span>
          {new Date(evt.date).toLocaleDateString("en-US")} at {evt.time}
        </span>
        <h1>{evt.name}</h1>
        {evt.image.data && (
          <div className={styles.image}>
            <Image
              src={evt.image.data.attributes.formats.medium.url}
              width={960}
              height={600}
              alt="event image"
            />
          </div>
        )}
      </div>

      <h3>Performers:</h3>
      <p>{evt.performers}</p>

      <h3>Description:</h3>
      <p>{evt.description}</p>

      <h3>Venue: {evt.venue}</h3>
      <p>{evt.address}</p>

      <Link href="/events">
        <a className={styles.back}>{"<"}Go Back</a>
      </Link>
    </Layout>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/events`);
  const events = await res.json();
  const paths = events.data.map((event) => ({
    params: { slug: event.attributes.slug },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params: { slug } }) {
  const qs = require("qs");
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: "image",
    },
    {
      encodeValuesOnly: true,
    }
  );
  const response = await fetch(`${API_URL}/api/events?${query}`);
  const events = await response.json();

  return {
    props: {
      evt: events.data[0].attributes,
    },
    revalidate: 1,
  };
}
