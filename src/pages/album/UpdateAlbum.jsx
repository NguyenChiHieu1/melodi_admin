import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { url } from "../../App";

import { useParams, useNavigate } from "react-router-dom";
import AdminHome from "../../components/AdminHome";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";
import {
  validateAlbumName,
  validateBgColour,
  validateDesc,
} from "../../validate/albums";

const UpdateAlbum = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID của album từ URL

  const { roles, _id } = useSelector((state) => state.auth.loginInfo);
  const token = useSelector((state) => state.auth.loginToken);

  const [image, setImage] = useState(null);
  const [value, setValue] = useState({
    name: "",
    image: "",
    songs: [],
    bg_colour: "#ffffff",
    desc: "",
  });
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState([]);
  const [artist, setArtist] = useState([]);
  const [status, setStatus] = useState("");

  const validate = async (album) => {
    if (!validateAlbumName(album.name)) {
      toast.error(
        "Invalid album name. Name must be at least 3 characters long."
      );
      return false;
    }

    if (album.bg_colour && !validateBgColour(album.bg_colour)) {
      toast.error(
        "Invalid background color. Please use a valid hex color code."
      );
      return false;
    }

    if (!validateDesc(album.desc)) {
      console.log("qua đây", album.desc);
      toast.error(
        "Invalid description. Description cannot be empty if provided."
      );
      return false;
    }

    if (!Array.isArray(album.songs) || album.songs.length === 0) {
      toast.error("Invalid songs. Album must contain at least one song.");
      return false;
    }

    return true;
  };

  // Hàm xử lý submit để cập nhật album
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const arTist = [...new Set(artist)];
      const check = await validate(value);
      if (check) {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("desc", value.desc);
        formData.append("bg_colour", value.bg_colour);
        value.songs.forEach((item, index) => {
          const parts = item.split("-");
          formData.append(`songs[${index}]`, parts[0]);
        });

        if (value.image) formData.append("image", value.image);
        if (roles === "leader") {
          arTist.forEach((item, index) => {
            formData.append(`artist[${index}]`, item);
          });
          formData.append("status", status);
        }

        const response = await axios.put(
          `${url}/api/album/update/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          toast.success("Album updated successfully!");
          setTimeout(() => {
            navigate("/manager-album/1");
          }, 1000);
        } else {
          toast.error("Something went wrong");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  // Lấy thông tin album từ API
  const fetchAlbum = async () => {
    try {
      const response = await axios.get(`${url}/api/album/${id}`);
      console.log(response);
      if (response.data.success) {
        const albumData = response.data.data;

        setValue({
          name: albumData.name,
          songs: albumData.songs,
          bg_colour: albumData.bg_colour,
          desc: albumData.desc,
        });
        setArtist(albumData.artist);
        setImage(albumData.image);
        setStatus(albumData.status);
      }
    } catch (error) {
      //   toast.error("Failed to fetch album details.");
      toast.error(error.message);
    }
  };

  const fetchSongs = async () => {
    try {
      const params = { ...(roles === "artist" && { artist: _id }) };
      const queryParams = new URLSearchParams(params);
      const response = await axios.get(
        `${url}/api/song/songs?${queryParams.toString()}`
      );
      if (response.data.success) {
        setSongs(response.data.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSongs();
    fetchAlbum().finally(() => setLoading(false));
  }, [roles, id]);

  const onChangeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file); // Tạo URL tạm thời cho ảnh
      setImage(objectUrl); // Cập nhật state với URL tạm thời
      setValue({ ...value, image: file });
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
            className="flex flex-col justify-center gap-1 w-[90%] text-white"
          >
            {/* title- */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <i
                  className="bi bi-arrow-left text-3xl cursor-pointer text-gray-200 hover:text-gray-400"
                  onClick={() => navigate(-1)}
                ></i>
                <h1 className="text-xl font-medium ml-[23rem]">Update Album</h1>
              </div>
            </div>
            {/* Body */}
            <div className="grid grid-cols-2 gap-8 w-full">
              <div className="flex flex-col col-span-1 gap-2">
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
                    className="w-28 cursor-pointer rounded-lg"
                    src={image || assets.upload_area} // Hiển thị ảnh từ máy tính hoặc ảnh mặc định
                    alt=""
                  />
                </label>
              </div>
              <div className="flex flex-col col-span-1 gap-2">
                <p>Select Songs</p>
                <select
                  multiple
                  className="p-2 border rounded-lg w-full text-gray-800"
                  onChange={(e) => {
                    const selectedValues = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value // Lấy giá trị ID bài hát đã chọn
                    );

                    // Lấy ra _id của các tác giả tương ứng với các bài hát đã chọn
                    const selectedArtists = selectedValues
                      .map((songId) => {
                        const song = songs.find((item) => item._id === songId);
                        return song ? song.artist._id : null; // Lấy _id của tác giả, trả về null nếu không tìm thấy
                      })
                      .filter((id) => id !== null); // Lọc ra các _id không null

                    setValue({ ...value, songs: selectedValues });
                    setArtist(selectedArtists);
                  }}
                  value={value.songs} // Giá trị của select sẽ là mảng các id bài hát đã chọn
                >
                  {songs.map((item, index) => (
                    <option key={index} value={item._id}>
                      {`${item?.title} - ${item?.artist?.username}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col col-span-2 gap-4">
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
              {roles === "leader" && (
                <div className="flex flex-col gap-3 w-52">
                  <p>Status</p>
                  <select
                    className="p-2 border rounded-lg w-full text-gray-800"
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                    value={status}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              )}
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
                Update Album
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminHome>
  );
};

export default UpdateAlbum;
