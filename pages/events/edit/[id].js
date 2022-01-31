import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Modal from "@/components/Modal";
import ImageUpload from "@/components/ImageUpload";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/config/index";
import styles from "@/styles/Form.module.css";
import moment from "moment";
import { FaImage } from "react-icons/fa";
import qs from "qs";

export default function EditEventPage({ event }) {
  const [showModal, setShowModal] = useState(false);

  const [values, setValues] = useState({
    name: event.data.attributes.name,
    performers: event.data.attributes.performers,
    venue: event.data.attributes.venue,
    address: event.address,
    date: moment(event.data.attributes.date).format("yyyy-MM-DD"),
    time: event.data.attributes.time,
    description: event.data.attributes.description,
  });

  const [imagePreview, setImagePreview] = useState(
    event.data.attributes.image.data
      ? event.data.attributes.image.data.attributes.formats.thumbnail.url
      : null
  );

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //validation
    const hasEmptyFields = Object.values(values).some(
      (element) => element === ""
    );

    if (hasEmptyFields) {
      toast.error("Please fill in all fields");
    }

    const res = await fetch(`${API_URL}/api/events/${event.data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { ...values } }),
    });

    if (!res.ok) {
      toast.error("Something Went Wrong");
    } else {
      const event = await res.json();
      router.push(`/events/${event.data.attributes.slug}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const imageUploaded = async () => {
    const query = qs.stringify(
      {
        populate: "image",
      },
      {
        encodeValuesOnly: true,
      }
    );

    const res = await fetch(`${API_URL}/api/events/${event.data.id}?${query}`);
    const data = await res.json();

    setImagePreview(
      data.data.attributes.image.data.attributes.formats.thumbnail.url
    );
    setShowModal(false);
  };

  return (
    <Layout title="Add New Event">
      <Link href="/events">Go back</Link>
      <h1>Edit Event</h1>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="name">Event Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="performers">Performers</label>
            <input
              type="text"
              name="performers"
              id="performers"
              value={values.performers}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="venue">Venue</label>
            <input
              type="text"
              name="venue"
              id="venue"
              value={values.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              value={values.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={values.date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="time">Time</label>
            <input
              type="text"
              name="time"
              id="time"
              value={values.time}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor="description">Event Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <input type="submit" value="Update event" className="btn" />
      </form>
      {imagePreview ? (
        <>
          <h2>Event Image</h2>
          <Image
            src={imagePreview}
            alt="event-image"
            height={100}
            width={170}
          />
        </>
      ) : (
        <h2>No image uploaded</h2>
      )}
      <div>
        <button className="btn-secondary" onClick={() => setShowModal(true)}>
          <FaImage /> Set Image
        </button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload eventId={event.data.id} imageUploaded={imageUploaded} />
      </Modal>
    </Layout>
  );
}

export async function getServerSideProps({ params: { id } }) {
  const query = qs.stringify(
    {
      populate: "image",
    },
    {
      encodeValuesOnly: true,
    }
  );
  const res = await fetch(`${API_URL}/api/events/${id}?${query}`);
  const event = await res.json();

  return {
    props: { event },
  };
}
