import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../App'; // Ensure this points to your backend (e.g., http://localhost:5000)

const AddAlbum = () => {
  const [image, setImage] = useState(null); // Changed from false to null for clarity
  const [colour, setColour] = useState('#121212');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false); // Fixed typo: loding -> loading

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      if (!name || !desc || !image) {
        toast.error('Please fill in all fields and select an image');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('image', image);
      formData.append('bgColour', colour);

      // Debug FormData
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
        if (pair[0] === 'image') {
          console.log(`image name: ${pair[1].name}, size: ${pair[1].size}`);
        }
      }

      const response = await axios.post(`${url}/api/album/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Album added successfully');
        setName('');
        setDesc('');
        setColour('#121212');
        setImage(null);
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      console.error('Error adding album:', error);
      toast.error(error.response?.data?.error || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-start gap-8 text-gray-600">
      <div className="flex flex-col gap-4">
        <p>UPLOAD IMAGE</p>
        <input
          onChange={(e) => setImage(e.target.files[0] || null)}
          type="file"
          id="image"
          accept="image/*"
          hidden
        />
        <label htmlFor="image">
          <img
            className="w-24 cursor-pointer"
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt=""
          />
        </label>
      </div>
      <div className="flex flex-col gap-2.5">
        <p>ALBUM NAME</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          type="text"
          placeholder="Type here"
          required
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p>ALBUM DESCRIPTION</p>
        <input
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          type="text"
          placeholder="Type here"
          required
        />
      </div>
      <div className="flex flex-col gap-3">
        <p>Background color</p>
        <input
          onChange={(e) => setColour(e.target.value)}
          value={colour}
          type="color"
        />
      </div>
      <button
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
        type="submit"
      >
        ADD
      </button>
    </form>
  );
};

export default AddAlbum;