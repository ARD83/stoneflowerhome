import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function AddHouseInfo() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      if (imageFile) {
        const imageRef = ref(storage, `houseInfo/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "houseInfo"), {
        title,
        description,
        link,
        image: imageUrl,
      });
      navigate("/house-info");
    } catch (error) {
      console.error("Error adding house info:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-4 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-sea">Add House Info</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border rounded p-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          required
          className="border rounded p-2"
        />
        <input
          type="url"
          placeholder="Optional Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="border rounded p-2"
        />
        <button
          type="submit"
          className="bg-sea text-white py-2 rounded hover:bg-sunset transition"
        >
          Save
        </button>
      </form>
    </div>
  );
}
