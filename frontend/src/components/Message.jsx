import React,{useState} from "react";
import { Flex, Box, Text, Avatar,Skeleton,Image  } from "@chakra-ui/react";
import { BsCheckAll, BsCheck } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messageAtom";
import userAtom from "../atoms/userAtom";
const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilState(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          {message.text && (
            <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
              <Text color={"white"}>{message.text}</Text>
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheckAll size={16} />
              </Box>
            </Flex>
          )}
        {message.img && !imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.img}
								onLoad={() => setImgLoaded(true)}
								alt='Message image'
								borderRadius={4}
                hidden
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}
          {message.img && imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.img}
								alt='Message image'
								borderRadius={4}
							/>
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheckAll size={16} />
              </Box>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

          <Avatar src={user.profilePic} w={7} h={7} />
        </Flex>
      ) : (
        <Flex gap={2} alignSelf={"flex-start"}>
          <Avatar src={selectedConversation[0].userProfilePic} w={7} h={7} />
           {message.text && (
            <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
              <Text color={"white"}> {message.text}</Text>
            </Flex>
             
           )}
             {message.img && !imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.img}
								onLoad={() => setImgLoaded(true)}
								alt='Message image'
								borderRadius={4}
                hidden
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}
          {message.img && imgLoaded && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.img}
								alt='Message image'
								borderRadius={4}
							/>
              
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

        </Flex>
      )}
    </>
  );
};

export default Message;
