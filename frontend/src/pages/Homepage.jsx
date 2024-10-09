import React, { useEffect, useState } from "react";
import { Flex, Box } from "@chakra-ui/react";
import Post from "../components/Post";
import toast from "react-hot-toast";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import userAtom from "../atoms/userAtom";

const Homepage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const user= useRecoilValue(userAtom);
  console.log(user);
  useEffect(() => {
    const getfeedPost = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const response = await axios.get("/api/v1/posts/feedPosts");
        if (response.error) {
          toast.error(response.error.message);
        }
        setPosts(response.data.posts);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    getfeedPost();
  }, [user,setPosts]);
  return (
    <Flex gap="10" alignItems={"flex-start"}>
      <Box flex={70} >
        {!loading && posts.length === 0 && (
          <h1>Follow some users to see the feed</h1>
        )}
        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>
      <Box flex={30}>
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default Homepage;
