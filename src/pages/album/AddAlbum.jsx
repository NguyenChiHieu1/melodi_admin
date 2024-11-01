import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { url } from "../../App";
import AdminHome from "../../components/AdminHome";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  validateAlbumName,
  validateBgColour,
  validateDesc,
} from "../../validate/albums";
const AddAlbum = ({}) => {
  const navigate = useNavigate();

  const { name, roles, _id } = useSelector((state) => state.auth.loginInfo);
  const token = useSelector((state) => state.auth.loginToken);

  const [image, setImage] = useState(null);
  const [value, setValue] = useState({
    name: "",
    songs: [],
    bg_colour: "#ffffff",
    desc: "",
  });
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState([]);

  const validate = (album) => {
    // Validate album name
    if (!validateAlbumName(album.name)) {
      toast.error(
        "Invalid album name. Name must be at least 3 characters long."
      );
      return false;
    }

    // Validate artist IDs array
    // Validate background color (hex code)
    if (album.bg_colour && !validateBgColour(album.bg_colour)) {
      toast.error(
        "Invalid background color. Please use a valid hex color code."
      );
      return false;
    }

    // Validate description (optional)
    if (album.desc && !validateDesc(album.desc)) {
      toast.error(
        "Invalid description. Description cannot be empty if provided."
      );
      return false;
    }

    if (!image) {
      toast.error("Please select a photo");
      return false;
    }

    if (!Array.isArray(album.songs) || album.songs.length === 0) {
      toast.error("Invalid songs. Album must contain at least one song.");
      return false;
    }

    return true;
  };

  // Hàm xử lý submit
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log("image", image);
    console.log("songs", value.songs);
    try {
      if (validate(value)) {
        const arrArtist = [];
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("desc", value.desc);
        formData.append("bg_colour", value.bg_colour);
        value.songs.forEach((item, index) => {
          const parts = item.split("-");
          formData.append(`songs[${index}]`, parts[0]);
          arrArtist.push(parts[1]);
        });
        if (image) formData.append("image", image);
        if (roles !== "artist") {
          // formData.append(`artist[${index}]`, item.artist);
          const arTist = [...new Set(arrArtist)];
          arTist.forEach((item, index) => {
            formData.append(`artist[${index}]`, item);
          });
        }
        const response = await axios.post(`${url}/api/album/add`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          toast.success("Album added");
          setValue({
            name: "",
            status: "",
            songs: [],
            bg_colour: "#ffffff",
            desc: "",
            viewCount: 0,
            downloadCount: 0,
          });
          setImage(null);
        } else {
          toast.error("Something went wrong");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  // Hàm xử lý thay đổi input
  const onChangeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const fetchSongs = async () => {
    try {
      const params = {
        ...(roles === "artist" && { artist: _id }),
      };

      const queryParams = new URLSearchParams(params);
      // console.log(queryParams);
      const response = await axios.get(
        `${url}/api/song/songs?${queryParams.toString()}`
      );
      if (response.data.success) {
        // console.log(response);
        setSongs(response.data.data);
      }
    } catch (error) {
      toast.error(error.massage);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [roles]);

  return (
    <AdminHome>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex items-center justify-center">
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col justify-center gap-1 w-[90%] text-white"
          >
            <div className="mb-4">
              <div className="flex items-center gap-2">
                {/* Return Icon */}
                <i
                  className="bi bi-arrow-left text-3xl cursor-pointer text-gray-200 hover:text-gray-400"
                  onClick={() => {
                    navigate(-1);
                  }}
                ></i>
                {/* Tiêu đề */}
                <h1 className="text-xl font-medium  ml-[23rem]">
                  Create New Album
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 w-full">
              {/* Cột 1: Upload Image */}
              <div className="flex flex-col col-span-1 gap-2">
                <p>Upload Image</p>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  accept="image/*"
                  hidden
                />
                <label htmlFor="image" className="w-24">
                  <img
                    className="w-24 cursor-pointer rounded-lg"
                    src={
                      image ? URL.createObjectURL(image) : assets.upload_area
                    }
                    alt=""
                  />
                </label>
              </div>

              {/* Cột 2: Select Songs */}
              <div className="flex flex-col col-span-1 gap-2">
                <p>Select Songs</p>
                <select
                  multiple
                  // value={value.songs}
                  className="p-2 border rounded-lg w-full text-gray-800"
                  onChange={(e) => {
                    const selectedValues = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    setValue({ ...value, songs: selectedValues });
                  }}
                >
                  {songs?.map((item, index) => (
                    <option
                      key={index}
                      value={`${item._id}-${item.artist._id}`}
                    >
                      {`${item?.title} - ${item?.artist?.username}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col col-span-2 gap-8">
              {/* Album name */}
              <div className="flex flex-col gap-2.5">
                <p>Album name</p>
                <input
                  name="name"
                  onChange={onChangeHandler}
                  value={value.name}
                  className="bg-transparent outline-[#834a7d] rounded-md border-2 border-gray-400 p-2.5 w-full"
                  type="text"
                  placeholder="Type album name here"
                />
              </div>

              {/* Album description */}
              <div className="flex flex-col gap-2.5">
                <p>Album description</p>
                <input
                  name="desc"
                  onChange={onChangeHandler}
                  value={value.desc}
                  className="bg-transparent outline-[#834a7d] rounded-md border-2 border-gray-400 p-2.5 w-full"
                  type="text"
                  placeholder="Type album description here"
                />
              </div>

              {/* Background Colour */}
              <div className="flex flex-col gap-3">
                <p>Background Colour</p>
                <input
                  type="color"
                  name="bg_colour"
                  onChange={onChangeHandler}
                  value={value.bg_colour}
                  className="w-20 h-8 rounded-md"
                />
              </div>
            </div>

            <div className="col-span-3 flex justify-center mt-4">
              <button
                type="submit"
                className="text-base bg-[#834a7d] hover:bg-[#8d548d] text-white py-2.5 px-14 cursor-pointer rounded-md"
              >
                Add Album
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminHome>
  );
};

export default AddAlbum;
