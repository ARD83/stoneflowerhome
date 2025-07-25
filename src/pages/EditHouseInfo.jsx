import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../contexts/AuthContext";
import backgroundImage from "../assets/explore-bg.jpg";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EditHouseInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const ADMIN_EMAIL = "stoneflowerhome@gmail.com";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const docRef = doc(db, "houseInfo", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setDescription(data.description);
          setLink(data.link || "");
          setImageUrl(data.image || "");
        } else {
          console.error("House Info not found");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
  }, [id]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let updatedImageUrl = imageUrl;

      if (imageFile) {
        const imageRef = ref(storage, `houseInfo/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        updatedImageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(db, "houseInfo", id), {
        title,
        description,
        link,
        image: updatedImageUrl,
      });

      navigate("/house-info/manage");
    } catch (err) {
      console.error("Error saving changes:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteDoc(doc(db, "houseInfo", id));
      navigate("/house-info/manage");
    } catch (err) {
      console.error("Error deleting entry:", err);
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
            Edit House Info
          </h1>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-md p-6">
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
            <ReactQuill value={description} onChange={setDescription} />
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

          {imageUrl && (
            <div className="mb-4">
              <img
                src={imageUrl}
                alt="Current"
                className="rounded-lg shadow max-h-48 mx-auto"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1 text-sea font-medium">Replace Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-sea text-white px-4 py-2 rounded-full shadow hover:bg-sunset transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-coral text-white px-4 py-2 rounded-full shadow hover:bg-red-700 transition"
            >
              Delete Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
