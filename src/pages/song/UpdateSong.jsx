import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminHome from "../../components/AdminHome";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";
import { url } from "../../App";
import { assets } from "../../assets/assets";

const UpdateSong = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID bài hát từ URL
  const { roles } = useSelector((state) => state.auth.loginInfo);
  const token = useSelector((state) => state.auth.loginToken);

  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({
    title: "",
    category: [],
    status: "pending",
    image: "",
    audio: "",
  });

  // Lấy danh mục từ API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/category`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch categories.");
    }
  };

  // Lấy thông tin bài hát
  const fetchSong = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list/${id}`);
      if (response.data.success) {
        const songData = response.data.data;
        setValue({
          title: songData.title,
          category: songData.category.map((cate) => cate._id),
          status: songData.status,
          image: songData.image,
          audio: songData.audio,
        });
        setImage(songData.image);
        setAudio(songData.audio);
      }
    } catch (error) {
      toast.error("Failed to fetch song details.");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCategories();
    fetchSong().finally(() => setLoading(false));
  }, [id]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", value.title);
      formData.append("status", value.status);
      value.category.forEach((item, index) => {
        formData.append(`category[${index}]`, item);
      });
      if (value.image) formData.append("image", value.image);
      if (value.audio) formData.append("audio", value.audio);

      const response = await axios.put(
        `${url}/api/song/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Song updated successfully!");
        setTimeout(() => {
          navigate("/manager-song/1");
        }, 1000);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const onChangeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImage(objectUrl);
      setValue({ ...value, image: file });
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setAudio(objectUrl);
      setValue({ ...value, audio: file });
    }
  };

  return (
    <AdminHome>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex items-center justify-center">
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col justify-center gap-1 w-[90%]"
          >
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <i
                  className="bi bi-arrow-left text-3xl cursor-pointer text-gray-600 hover:text-gray-800"
                  onClick={() => navigate(-1)}
                ></i>
                <h1 className="text-2xl font-bold text-gray-800 ml-[23rem]">
                  Update Song
                </h1>
              </div>
            </div>
            <div className="flex flex-row gap-8 w-full">
              <div className="flex flex-col  gap-2">
                <p>Upload Image</p>
                <input
                  onChange={handleImageChange}
                  type="file"
                  id="image"
                  accept="image/*"
                  hidden
                />
                <label htmlFor="image" className="w-28">
                  <img
                    className="w-28 cursor-pointer"
                    src={image || "/path/to/default-image"} // Đường dẫn mặc định
                    alt=""
                  />
                </label>
              </div>
              <div className="flex flex-col  gap-2">
                <p>Upload Audio</p>
                <input
                  onChange={handleAudioChange}
                  type="file"
                  id="audio"
                  accept="audio/*"
                  hidden
                />
                <label htmlFor="audio" className="w-28">
                  <img
                    className="w-28 cursor-pointer"
                    src={audio ? assets.upload_added : assets.upload_area}
                    alt="Audio"
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-col col-span-2 gap-4">
              <div className="flex flex-col gap-2.5">
                <p>Song Title</p>
                <input
                  name="title"
                  onChange={onChangeHandler}
                  value={value.title}
                  className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-full"
                  type="text"
                  placeholder="Type song title here"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <p>Select Categories</p>
                <select
                  multiple
                  className="p-2 border rounded-lg w-full"
                  onChange={(e) => {
                    const selectedValues = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    setValue({ ...value, category: selectedValues });
                  }}
                  value={value.category}
                >
                  {categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-3 w-52">
                <p>Status</p>
                <select
                  className="p-2 border rounded-lg w-full"
                  onChange={(e) =>
                    setValue({ ...value, status: e.target.value })
                  }
                  value={value.status}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="col-span-3 flex justify-center mt-4">
              <button
                type="submit"
                className="text-base bg-[#834a7d] hover:bg-[#8d548d] text-white py-2.5 px-14 cursor-pointer rounded-md"
              >
                Update Song
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminHome>
  );
};

export default UpdateSong;
