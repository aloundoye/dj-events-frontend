import Layout from "@/components/Layout";
import EventItem from "@/components/EventItem";
import { API_URL } from "@/config/index";
import { Pagination } from "@/components/Pagination";

const EVENTS_PER_PAGE = 3;

export default function EventsPage({ events, page, pageCount }) {
  console.log();
  return (
    <Layout>
      <h1>Events</h1>
      {events.data.length === 0 && <h3>No events to show</h3>}

      {events.data.map((event) => (
        <EventItem key={event.id} evt={event.attributes} />
      ))}

      <Pagination page={page} pageCount={pageCount} />
    </Layout>
  );
}

export async function getServerSideProps({ query: { page = 1 } }) {
  const qs = require("qs");
  const query = qs.stringify(
    {
      sort: ["date:asc"],
      populate: "image",
      pagination: {
        page: page,
        pageSize: EVENTS_PER_PAGE,
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const eventsRes = await fetch(`${API_URL}/api/events?${query}`);
  const events = await eventsRes.json();

  return {
    props: {
      events,
      page: events.meta.pagination.page,
      pageCount: events.meta.pagination.pageCount,
    },
  };
}
