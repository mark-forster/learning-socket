import React from "react";
import { Link } from "react-router-dom";
import { Flex, Image, useColorMode, Button } from "@chakra-ui/react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { BsFillChatDotsFill } from "react-icons/bs";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { IoSettings } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import userLogout from "../hooks/userLogout";
import authScreenAtom from "../atoms/authAtom";
const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const logout = userLogout();
  return (
    <>
      <Flex justifyContent={"space-between"} mt={6} mb={12}>
        {user && (
          <Link as={RouterLink} to="/">
            <AiFillHome size={24} />
          </Link>
        )}
        {!user && (
          <Link
            as={RouterLink}
            to="/auth"
            onClick={() => setAuthScreen("login")}
          >
            Login
          </Link>
        )}
        <Image
          cursor={"pointer"}
          alt="logo"
          w={6}
          src={colorMode === "dark" ? "/light-mode.png" : "/dark-mode.png"}
          onClick={toggleColorMode}
        />

        {user && (
          <Flex alignItems={"center"} gap={4}>
            <Link as={RouterLink} to={`/${user.username}`}>
              <FaCircleUser size={24} />
            </Link>
            <Link as={RouterLink} to="/user/chat">
              <BsFillChatDotsFill size={20} />
            </Link>
            <Link as={RouterLink} to="/settings">
              <IoSettings size={20} />
            </Link>
            <Button size={"xs"} onClick={logout}>
              <FiLogOut size={20} />
            </Button>
          </Flex>
        )}
        {!user && (
          <Link
            as={RouterLink}
            to="/auth"
            onClick={() => setAuthScreen("signup")}
          >
            Signup
          </Link>
        )}
      </Flex>
    </>
  );
};

export default Header;
