import { Button } from "@chakra-ui/react";
import React from "react";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import toast from "react-hot-toast";
const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);

  return (
    <>
      <Button
        position={"fixed"}
        top={"30px"}
        right={"30px"}
        size={"sm"}
        onClick={handleLogout}
      >
        <FiLogOut size={20} />
      </Button>
    </>
  );
};

export default LogoutButton;
