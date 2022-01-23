import Layout from "@/components/Layout";
import EventItem from "@/components/EventItem";
import { API_URL } from "@/config/index";

export default function EventsPage({ events }) {
  console.log();
  return (
    <Layout>
      <h1>Events</h1>
      {events.data.length === 0 && <h3>No events to show</h3>}

      {events.data.map((event) => (
        <EventItem key={event.id} evt={event.attributes} />
      ))}
    </Layout>
  );
}

export async function getStaticProps() {
  const qs = require("qs");
  const query = qs.stringify(
    {
      sort: ["date:asc"],
      populate: "image",
    },
    {
      encodeValuesOnly: true,
    }
  );
  const res = await fetch(`${API_URL}/api/events?${query}`);
  const events = await res.json();

  return {
    props: { events },
    revalidate: 1,
  };
}
