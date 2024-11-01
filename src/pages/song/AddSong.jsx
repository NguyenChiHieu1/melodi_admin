import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { url } from "../../App";
import AdminHome from "../../components/AdminHome";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddSong = () => {
  const navigate = useNavigate();
  const { name, roles, _id } = useSelector((state) => state.auth.loginInfo);
  const token = useSelector((state) => state.auth.loginToken);

  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [value, setValue] = useState({
    title: "",
    artist: roles === "artist" ? _id : "",
    category: [],
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const validate = (song) => {
    if (!song.title || song.title.length < 3) {
      toast.error("Title must be at least 3 characters long.");
      return false;
    }
    if (!value.category || value.category.length === 0) {
      toast.error("Please select an category song");
      return false;
    }
    if (!audio) {
      toast.error("Please select an audio file.");
      return false;
    }
    if (!image) {
      toast.error("Please select an image.");
      return false;
    }
    return true;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (validate(value)) {
        const formData = new FormData();
        formData.append("title", value.title);
        formData.append("status", value.status);
        formData.append("artist", value.artist);
        value.category.forEach((item, index) => {
          formData.append(`category[${index}]`, item);
        });
        if (audio) formData.append("audio", audio);
        if (image) formData.append("image", image);

        const response = await axios.post(`${url}/api/song`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          toast.success("Song added successfully!");
          setValue({
            title: "",
            artist: roles === "artist" ? _id : "",
            category: [],
          });
          setImage(null);
          setAudio(null);
        } else {
          toast.error("Something went wrong.");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const onChangeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/category`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
                <h1 className="text-xl font-medium ml-[23rem]">
                  Create New Song
                </h1>
              </div>
            </div>
            <div className="flex flex-row gap-8 w-full">
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

              {/* Cột 2: Upload Audio */}
              <div className="flex flex-col col-span-1 gap-2">
                <p>Upload Audio</p>
                <input
                  onChange={(e) => setAudio(e.target.files[0])}
                  type="file"
                  id="audio"
                  accept="audio/*"
                  hidden
                />
                <label htmlFor="audio" className="w-24">
                  <img
                    className="w-24 cursor-pointer rounded-lg"
                    src={audio ? assets.upload_added : assets.upload_area}
                    alt=""
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col col-span-2 gap-8">
              {/* Song title */}
              <div className="flex flex-col gap-2.5">
                <p>Song Title</p>
                <input
                  name="title"
                  onChange={onChangeHandler}
                  value={value.title}
                  className="bg-transparent outline-[#834a7d] rounded-md border-2 border-gray-400 p-2.5 w-full"
                  type="text"
                  placeholder="Type song title here"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2.5">
                <p>Select Category</p>
                <select
                  multiple
                  onChange={(e) => {
                    const selectedValues = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    setValue({ ...value, category: selectedValues });
                  }}
                  className="p-2 border rounded-lg w-full bg-[#412C3A] outline-[#834a7d]"
                >
                  {categories?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-span-3 flex justify-center mt-4">
              <button
                type="submit"
                className="text-base bg-[#834a7d] hover:bg-[#8d548d] text-white py-2.5 px-14 cursor-pointer rounded-md"
              >
                Add Song
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminHome>
  );
};

export default AddSong;
