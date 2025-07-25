import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../contexts/AuthContext";
import backgroundImage from "../assets/explore-bg.jpg";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AddHouseInfo() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const ADMIN_EMAIL = "stoneflowerhome@gmail.com";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // HTML string
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Please upload JPG, PNG, or WebP.");
        return;
      }
      setImageFile(file);
    }
  };

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
        description, // stored as HTML
        link,
        image: imageUrl,
        date: new Date(),
      });

      navigate("/house-info/manage");
    } catch (err) {
      console.error("Error adding house info:", err);
    }
  };

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Access Denied</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative pt-[80px]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10"></div>

      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-4">
            Add House Info
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6">
          <div className="mb-4">
            <label className="block mb-1 text-sea font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border border-olive rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sea font-medium">Description</label>
            <ReactQuill value={description} onChange={setDescription} className="bg-white" />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sea font-medium">Optional Link</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-2 border border-olive rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sea font-medium">Image (optional)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-sea text-white px-6 py-2 rounded-full shadow hover:bg-sunset transition"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
