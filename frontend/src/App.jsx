import { Box, Button } from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import Header from "./components/Header";
import PostPage from "./pages/PostPage";
import { Toaster } from "react-hot-toast";
import Homepage from "./pages/Homepage";
import Authpage from "./pages/Authpage";
import userAtom from "./atoms/userAtom";
import { useRecoilValue } from "recoil";
import UpdateProfile from "./pages/UpdateProfile";
import CreatePost from "./components/CreatePost";
import PageNotFound from "./pages/PageNotFound";
import ChatPage from "./ChatPage";
import SettingPage from "./pages/SettingPage";

function App() {
  const user = useRecoilValue(userAtom);
  const {pathname} = useLocation();
  return (
    <>
     <Box position={"relative"}  w={"full"}>
     <Container maxW={pathname === '/' ? {base: "620px", md: "900px"} : "620px"}>
        <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
        <Header />
        <Routes>
          <Route
            path="/"
            element={user ? <Homepage  user={user}/> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <Authpage /> : <Navigate to="/" />}
          />
          <Route
            path="/update"
            element={user ? <UpdateProfile /> : <Navigate to="/auth" />}
          />
          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage /> <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path="/:username/posts/:postId" element={<PostPage />} />
          <Route
            path="/user/chat"
            element={user ? <ChatPage /> : <Navigate to="/auth" />}
          />
          <Route
          path="/settings"
          element={user ? <SettingPage /> : <Navigate to="/auth" />}
        />
          {/* 404 page Not Found for unknown Url */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Container>
     </Box>
    </>
  );
}

export default App;
