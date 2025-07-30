import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { url } from '../App';
import { toast } from 'react-toastify';

const AddSong = () => {
  const [image, setImage] = useState(null); // Changed from false to null for clarity
  const [song, setSong] = useState(null); // Changed from false to null for clarity
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [artist, setArtist] = useState('');
  const [movie, setMovie] = useState('');
  const [album, setAlbum] = useState('none');
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);

  const onSubmitHandeler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      if (!name || !desc || !artist || !movie) {
        toast.error('Song name, description, artist, and movie are required');
        setLoading(false);
        return;
      }
      if (!image || !(image instanceof File)) {
        toast.error('Please select a valid image file');
        setLoading(false);
        return;
      }
      if (!song || !(song instanceof File)) {
        toast.error('Please select a valid audio file');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('artist', artist);
      formData.append('movie', movie);
      formData.append('image', image);
      formData.append('audio', song);
      formData.append('album', album);

      // Debug FormData
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
        if (pair[0] === 'image' || pair[0] === 'audio') {
          console.log(`${pair[0]} name: ${pair[1].name}, size: ${pair[1].size}`);
        }
      }

      const response = await axios.post(`${url}/api/song/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Song added');
        setName('');
        setDesc('');
        setArtist('');
        setMovie('');
        setAlbum('none');
        setImage(null);
        setSong(null);
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error occurred while adding song');
    } finally {
      setLoading(false);
    }
  };

  const loadAlbumData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      if (response.data.success) {
        setAlbumData(response.data.albums);
      } else {
        toast.error('Unable to load albums data');
      }
    } catch (error) {
      toast.error('Error occurred while loading albums');
    }
  };

  useEffect(() => {
    loadAlbumData();
  }, []);

  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form onSubmit={onSubmitHandeler} className="flex flex-col items-start gap-8 text-gray-600">
      <div className="flex gap-8">
        <div className="flex flex-col gap-4">
          <p>UPLOAD SONG</p>
          <input
            onChange={(e) => setSong(e.target.files[0] || null)}
            type="file"
            id="song"
            accept="audio/*"
            hidden
          />
          <label htmlFor="song">
            <img
              src={song ? assets.upload_added : assets.upload_song}
              className="w-24 cursor-pointer"
              alt=""
            />
          </label>
        </div>
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
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              className="w-24 cursor-pointer"
              alt=""
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <p>SONG NAME</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Type Here"
          type="text"
          required
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p>SONG DESCRIPTION</p>
        <input
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Type Here"
          type="text"
          required
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p>ARTIST</p>
        <input
          onChange={(e) => setArtist(e.target.value)}
          value={artist}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Type Here"
          type="text"
          required
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p>MOVIE</p>
        <input
          onChange={(e) => setMovie(e.target.value)}
          value={movie}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Type Here"
          type="text"
          required
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p>ALBUM</p>
        <select
          onChange={(e) => setAlbum(e.target.value)}
          value={album}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]"
        >
          <option value="none">None</option>
          {albumData.map((item, index) => (
            <option key={index} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="text-base bg-black text-white py-2.5 px-14 cursor-pointer">
        ADD
      </button>
    </form>
  );
};

export default AddSong;