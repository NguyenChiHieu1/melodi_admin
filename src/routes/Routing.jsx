import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login/Login";
import ListSong from "../pages/song/ListSong";
import ListAlbum from "../pages/album/ListAlbum";
import AddAlbum from "../pages/album/AddAlbum";
import UpdateAlbum from "../pages/album/UpdateAlbum";

import PrivateRoute from "./PrivateRoute";
import SignUp from "../pages/signup/SignUp";
import PublicRoute from "./PublicRoute";
import PageNotFound from "../pages/PageNotRound";
import UpdateSong from "../pages/song/UpdateSong";
import AddSong from "../pages/song/AddSong";
import ListCategory from "../pages/category/ListCategory";
import AddCategory from "../pages/category/AddCategory";
import UpdateCategory from "../pages/category/UpdateCategory";
import ListAccount from "../pages/account/ListAccount";
import AddAccount from "../pages/account/AddAccount";
import UpdateAccount from "../pages/account/UpdateAccount";
import { useSelector } from "react-redux";

const Routing = () => {
  const loginInfo = useSelector((state) => state?.auth?.loginInfo);

  // Kiểm tra nếu `loginInfo` là null hoặc undefined, gán giá trị mặc định
  const { name, roles, _id } = loginInfo || {};

  return (
    <BrowserRouter>
      <Routes>
        {/* Các route cần bảo vệ */}
        <Route element={<PublicRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="sign-up" element={<SignUp />} />
        </Route>
        {/* {["artist", "leader"].includes(roles) && (
          <> */}
        <Route path="/manager-album">
          <Route
            index
            element={
              <PrivateRoute>
                <ListAlbum />
              </PrivateRoute>
            }
          />
          <Route
            index
            element={
              <PrivateRoute>
                <ListAlbum />
              </PrivateRoute>
            }
          />
          <Route
            path=":page"
            element={
              <PrivateRoute>
                <ListAlbum />
              </PrivateRoute>
            }
          />
          <Route
            path="add"
            element={
              <PrivateRoute>
                <AddAlbum />
              </PrivateRoute>
            }
          />
          <Route
            path="update/:id"
            element={
              <PrivateRoute>
                <UpdateAlbum />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="/manager-song">
          <Route
            index
            element={
              <PrivateRoute>
                <ListSong />
              </PrivateRoute>
            }
          />
          <Route
            path=":page"
            element={
              <PrivateRoute>
                <ListSong />
              </PrivateRoute>
            }
          />
          <Route
            path="add"
            element={
              <PrivateRoute>
                <AddSong />
              </PrivateRoute>
            }
          />
          <Route
            path="update/:id"
            element={
              <PrivateRoute>
                <UpdateSong />
              </PrivateRoute>
            }
          />
        </Route>
        {/* </>
        )} */}

        {roles === "leader" && (
          <>
            <Route path="/manager-category">
              <Route
                index
                element={
                  <PrivateRoute>
                    <ListCategory />
                  </PrivateRoute>
                }
              />
              <Route
                path=":page"
                element={
                  <PrivateRoute>
                    <ListCategory />
                  </PrivateRoute>
                }
              />
              <Route
                path="add"
                element={
                  <PrivateRoute>
                    <AddCategory />
                  </PrivateRoute>
                }
              />
              <Route
                path="update/:id"
                element={
                  <PrivateRoute>
                    <UpdateCategory />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route path="/manager-account">
              <Route
                index
                element={
                  <PrivateRoute>
                    <ListAccount />
                  </PrivateRoute>
                }
              />
              <Route
                path=":page"
                element={
                  <PrivateRoute>
                    <ListAccount />
                  </PrivateRoute>
                }
              />
              <Route
                path="add"
                element={
                  <PrivateRoute>
                    <AddAccount />
                  </PrivateRoute>
                }
              />
              <Route
                path="update/:id"
                element={
                  <PrivateRoute>
                    <UpdateAccount />
                  </PrivateRoute>
                }
              />
            </Route>
          </>
        )}
        {/* <Route path="/manager-category">
          <Route
            index
            element={
              <PrivateRoute>
                <ListCategory />
              </PrivateRoute>
            }
          />
          <Route
            path=":page"
            element={
              <PrivateRoute>
                <ListCategory />
              </PrivateRoute>
            }
          />
          <Route
            path="add"
            element={
              <PrivateRoute>
                <AddCategory />
              </PrivateRoute>
            }
          />
          <Route
            path="update/:id"
            element={
              <PrivateRoute>
                <UpdateCategory />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="/manager-account">
          <Route
            index
            element={
              <PrivateRoute>
                <ListAccount />
              </PrivateRoute>
            }
          />
          <Route
            path=":page"
            element={
              <PrivateRoute>
                <ListAccount />
              </PrivateRoute>
            }
          />
          <Route
            path="add"
            element={
              <PrivateRoute>
                <AddAccount />
              </PrivateRoute>
            }
          />
          <Route
            path="update/:id"
            element={
              <PrivateRoute>
                <UpdateAccount />
              </PrivateRoute>
            }
          />
        </Route> */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
