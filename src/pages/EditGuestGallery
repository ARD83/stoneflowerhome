import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { useAuth } from "../contexts/AuthContext";

export default function EditGuestGallery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const ADMIN_EMAIL = "stoneflowerhome@gmail.com";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [guestName, setGuestName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    async function fetchItem() {
      try {
        const docRef = doc(db, "guestGallery", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setDescription(data.description || "");
          setGuestName(data.guestName || "");
          setImageUrl(data.image || "");
        } else {
          console.error("Item not found");
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    }
    fetchItem();
  }, [id]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Please upload JPG, PNG, or WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large. Compressing it for upload...");
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 4.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        setImageFile(compressedFile);
      } catch (error) {
        console.error("Image compression failed:", error);
      }
    } else {
      setImageFile(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let updatedImageUrl = imageUrl;

    try {
      if (imageFile) {
        const imageRef = ref(storage, `guestGallery/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        updatedImageUrl = await getDownloadURL(imageRef);
      }

      await setDoc(doc(db, "guestGallery", id), {
        title,
        description,
        guestName,
        image: updatedImageUrl,
        date: new Date(), // update date
      });

      navigate("/gallery");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, "guestGallery", id));
      navigate("/gallery");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (currentUser?.email !== ADMIN_EMAIL) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Access Denied</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto mt-20">
      <h1 className="text-2xl font-bold text-sea mb-4 text-center">Edit Guest Gallery Item</h1>
      <form onSubmit={handleSave} className="bg-white p-4 rounded-lg shadow-md">
        <label className="block text-sm text-gray-600 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full mb-3 p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
        />

        <label className="block text-sm text-gray-600 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows="3"
          className="w-full mb-3 p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
        ></textarea>

        <label className="block text-sm text-gray-600 mb-1">Guest Name</label>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="w-full mb-3 p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
        />

        {imageUrl && (
          <div className="mb-3">
            <img
              src={imageUrl}
              alt="Current"
              className="rounded-lg shadow max-h-48 mx-auto"
            />
          </div>
        )}

        <label className="block text-sm text-gray-600 mb-1">Replace Image</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="w-full mb-3"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-sea text-white p-2 rounded hover:bg-sunset"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 bg-coral text-white p-2 rounded hover:bg-red-700"
          >
            Delete Item
          </button>
        </div>
      </form>
    </div>
  );
}
