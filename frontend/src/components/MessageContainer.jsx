import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Image,
  Divider,
  Avatar,
  useColorModeValue,
  SkeletonCircle,
  Skeleton,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  selectedConversationAtom,
  conversationsAtom,
} from "../atoms/messageAtom";
import axios from "axios";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import { useRef } from "react";
import messageSound from "../assets/sounds/msgSound.mp3";

const MessageContainer = () => {
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [loadingMessage, setLoadingMessage] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef(null);
  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }

      // make a sound if the window is not focused
      // if (!document.hasFocus()) {
      // 	const sound = new Audio(messageSound);
      // 	sound.play();
      // }

      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => socket.off("newMessage");
  }, [socket, selectedConversation, setConversations,messages]);
// make a sound if the window is not focused
if (!document.hasFocus()) {
  const sound = new Audio(messageSound);
  sound.play()}
  useEffect(() => {
	const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;
	if (lastMessageIsFromOtherUser) {
		socket.emit("markMessagesAsSeen", {
			conversationId: selectedConversation._id,
			userId: selectedConversation.userId,
		});
	}

	socket.on("messagesSeen", ({ conversationId }) => {
		if (selectedConversation._id === conversationId) {
			setMessages((prev) => {
				const updatedMessages = prev.map((message) => {
					if (!message.seen) {
						return {
							...message,
							seen: true,
						};
					}
					return message;
				});
				return updatedMessages;
			});
		}
	});
  },[socket, currentUser._id, messages, selectedConversation] )


  useEffect(() => {
	messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
  useEffect(() => {
    setLoadingMessage(true);
    setMessages([]);
    try {
      if (selectedConversation.mock) return;
      // Fetch messages from API or local storage here. This is just a mockup.
      const getMessages = async () => {
        const response = await axios.get(
          `/api/v1/messages/${selectedConversation.userId}`
        );
        setMessages(response.data);
      };
      getMessages();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMessage(false);
    }
  }, [selectedConversation.userId,selectedConversation.mock]);

  return (
    <>
      <Flex
        flex="70"
        bg={useColorModeValue("gray.200", "gray.dark")}
        borderRadius={"md"}
        p={2}
        flexDirection={"column"}
      >
        MessageContainer
        {/* Message header */}
        <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
          <Avatar src={selectedConversation?.userProfilePic} size={"sm"} />
          <Text display={"flex"} alignItems={"center"}>
            {selectedConversation?.username}
           
          </Text>
        </Flex>
        <Divider />
        <Flex
          flexDir={"column"}
          gap={4}
          my={4}
          p={2}
          height={"400px"}
          overflowY={"auto"}
        >
          {loadingMessage &&
            [...Array(20)].map((_, i) => (
              <Flex
                key={i}
                gap={2}
                alignItems={"center"}
                p={1}
                borderRadius={"md"}
                alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
              >
                {i % 2 === 0 && <SkeletonCircle size={7} />}
                <Flex flexDir={"column"} gap={2}>
                  <Skeleton h="8px" w="250px" />
                  <Skeleton h="8px" w="250px" />
                  <Skeleton h="8px" w="250px" />
                </Flex>
                {i % 2 !== 0 && <SkeletonCircle size={7} />}
              </Flex>
            ))}
          {!loadingMessage &&
            messages.map((message) => (
              <Flex
                key={message._id}
                direction={"column"}
                ref={
                  messages.length - 1 === messages.indexOf(message)
                    ? messageEndRef
                    : null
                }
              >
                <Message
                  key={message._id}
                  message={message}
                  ownMessage={currentUser._id == message.sender}
                />
              </Flex>
            ))}
        </Flex>
        <MessageInput setMessages={setMessages} />
      </Flex>
    </>
  );
};

export default MessageContainer;
