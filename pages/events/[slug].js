import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import styles from "@/styles/Event.module.css";
import { useRouter } from "next/router";

export default function EventPage({ evt }) {
  const router = useRouter();

  const deleteEvent = async (event) => {
    if (confirm("Are you sure ?")) {
      const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      } else {
        router.push("/events");
      }
    }
  };

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
          {new Date(evt.attributes.date).toLocaleDateString("en-US")} at{" "}
          {evt.attributes.time}
        </span>
        <h1>{evt.attributes.name}</h1>
        <ToastContainer />
        {evt.attributes.image.data && (
          <div className={styles.image}>
            <Image
              src={evt.attributes.image.data.attributes.formats.medium.url}
              width={960}
              height={600}
              alt="event image"
            />
          </div>
        )}
      </div>

      <h3>Performers:</h3>
      <p>{evt.attributes.performers}</p>

      <h3>Description:</h3>
      <p>{evt.attributes.description}</p>

      <h3>Venue: {evt.attributes.venue}</h3>
      <p>{evt.attributes.address}</p>

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
      evt: events.data[0],
    },
    revalidate: 1,
  };
}
