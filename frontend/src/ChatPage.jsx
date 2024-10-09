import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Input,
  Button,Skeleton, SkeletonCircle,
} from "@chakra-ui/react";
import React,{useState,useEffect} from "react";
import { IoSearch } from "react-icons/io5";
import Conversation from './components/Conversation';
import toast from 'react-hot-toast';
import MessageContainer from "./components/MessageContainer";
import axios from 'axios'
import { useRecoilState, useRecoilValue } from "recoil";
import {conversationsAtom, selectedConversationAtom} from './atoms/messageAtom'
import userAtom from "./atoms/userAtom";
import { useSocket } from "./context/SocketContext";

const ChatPage = () => {
  const [loadingConversation,setLoadingConversation]= useState(true);
  const [searchingUser, setSearchingUser] = useState(false);
  const [conversations,setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = useRecoilValue(userAtom);
  const {socket, onlineUsers} = useSocket();
  // fetching conversations
  useEffect(() => {
    const getConversations= async() => {
      try{
        const response= await axios.get('/api/v1/messages/msg/conversations');
        setConversations(response.data.conversations);
    }
    catch(err){
      toast.error('Failed to fetch conversations')
    }
    finally{
   setLoadingConversation(false);
    }
    };
    getConversations();

  },[setConversations])

  const handleConversationSearch= async(e) =>{
      e.preventDefault();
      setSearchingUser(true);
      try{
          const response= await axios.get(`/api/v1/users/profile/${searchTerm}`)
          if(response.data.errorMessage){
            toast.error(response.data.errorMessage);
            return;
          }
          const searchedUser = response.data.user;
          console.log(response);
          // handling messing self
          const messagingYourself = searchedUser._id === currentUser._id;
			if (messagingYourself) {
				toast.error("You cannot message yourself");
				return;
			}
      // if User is already in a conversation with search User
      const conversationAlreadyExists = conversations.find(
				(conversation) => conversation.participants[0]._id === searchedUser._id
			);
      if (conversationAlreadyExists) {
				setSelectedConversation({
					_id: conversationAlreadyExists._id,
					userId: searchedUser._id,
					username: searchedUser.username,
					userProfilePic: searchedUser.profilePic,
				});
				return;
			}

      const mockConversation = {
				mock: true,
				lastMessage: {
					text: "",
					sender: "",
				},
				_id: Date.now(),
				participants: [
					{
						_id: searchedUser._id,
						username: searchedUser.username,
						profilePic: searchedUser.profilePic,
					},
				],
			};
			setConversations((prevConvs) => [...prevConvs, mockConversation]);
      }
      catch(err){
        console.error(err)
      }finally{
        setSearchingUser(false);
      }
  }

  return (
    <>
      <Box
        position={"absolute"}
        left={"50%"}
        transform={"translateX(-50%)"}
        w={{ base: "100%", md: "80%", lg: "750px" }}
        p={4}
        border={"1px solid red"}
      >
        <Flex
          gap={4}
          flexDirection={{ base: "column", md: "row" }}
          maxW={{
            sm: "400px",
            md: "full",
          }}
          mx={"auto"}
        >
         <Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
         <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
						Your Conversations
					</Text>
					<form onSubmit={handleConversationSearch}>
						<Flex alignItems={"center"} gap={2}>
							<Input placeholder='Search for a user' onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm}/>
							<Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
								<IoSearch />
							</Button>
						</Flex>
					</form>
          {loadingConversation &&
						[0, 1, 2, 3, 4].map((_, i) => (
							<Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
								<Box>
									<SkeletonCircle size={"10"} />
								</Box>
								<Flex w={"full"} flexDirection={"column"} gap={3}>
									<Skeleton h={"10px"} w={"80px"} />
									<Skeleton h={"8px"} w={"90%"} />
								</Flex>
							</Flex>
						))}
            {
             conversations?.map((conversation) =>{ 
               
            return (
              <Conversation key={conversation._id} conversation={conversation} isOnline={onlineUsers.includes(conversation.participants[0]._id)}/>
            )
            })}
          </Flex>
          {!selectedConversation._id && (
					<Flex
						flex={70}
						borderRadius={"md"}
						p={2}
						flexDir={"column"}
						alignItems={"center"}
						justifyContent={"center"}
						height={"400px"}
					>
						{/* <GiConversation size={100} /> */}
						<Text fontSize={20}>Select a conversation to start messaging</Text>
					</Flex>
				)}

          {selectedConversation?._id && <MessageContainer />}
        </Flex>
      </Box>
    </>
  );    
};

export default ChatPage;
