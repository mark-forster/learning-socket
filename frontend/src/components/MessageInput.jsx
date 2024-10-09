import React,{useState ,useRef      } from 'react'
import {
	Flex,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
} from "@chakra-ui/react";
import { BsFillSendFill } from "react-icons/bs";
import { BiImage } from "react-icons/bi";
import { BsImage } from "react-icons/bs";

import toast from 'react-hot-toast';
import axios from 'axios';
import usePreviewImg from "../hooks/usePreviewImg";
import { selectedConversationAtom,conversationsAtom } from '../atoms/messageAtom'
import { useRecoilState, useSetRecoilState,useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { IoSendSharp } from "react-icons/io5";
const MessageInput = ({setMessages}) => {
const [messageText,setMessageText] = useState("");
const selectedConversation= useRecoilState(selectedConversationAtom);
const setConversations= useSetRecoilState(conversationsAtom);
const user= useRecoilValue(userAtom);
const imageRef = useRef(null);
	const { onClose } = useDisclosure();
	const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
	const [isSending, setIsSending] = useState(false);

const handleSendMessage = async (e)=>{
	e.preventDefault();
	if(isSending) return;
	setIsSending(true);
	// if(!messageText || !imgUrl) {
	// 	console.log(imgUrl);
	// 	toast.error("Message cannot be empty");
    //     return;
	// };
	try{
		const response = await axios.post('/api/v1/messages',{message:messageText,recipientId:selectedConversation[0].userId,img:imgUrl});
		setMessages((messages) => [...messages, response.data.message]);
		setConversations((prevConvs) => {
			const updatedConversations = prevConvs.map((conversation) => {
				if (conversation._id === selectedConversation[0]._id) {
					return {
						...conversation,
						lastMessage: {
							text: messageText,
							sender: response.data.message?.sender,
						},
					};
				}
				return conversation;
			});
			return updatedConversations;
		});
		setMessageText("");
		setImgUrl("");
		onClose(true);
	}
	catch(error){
		console.error(error);
    }
	finally{
		setIsSending(false);
	}
}



  return (
    <>
        <Flex gap={2} alignItems={"center"}>
		<form onSubmit={handleSendMessage } style={{flex:95}}>
            <InputGroup>
            <Input w={"full"}
						placeholder='Type a message'
						onChange={(e) => setMessageText(e.target.value)}
						value={messageText}/>
            <InputRightElement cursor={"pointer"} onClick={handleSendMessage}>
						<BsFillSendFill />
					</InputRightElement>
            </InputGroup>
        </form>  
		<Flex flex={5} cursor={"pointer"}>
				<BsImage size={20} onClick={() => imageRef.current.click()} />
				<Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
			</Flex>
			<Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
					setImgUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? (
								<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>



		</Flex>
    </>
  )
}

export default MessageInput