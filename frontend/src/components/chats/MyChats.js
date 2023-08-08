import React, { useState, useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Button, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { Stack ,Text} from "@chakra-ui/react";
import { getSender } from "../../config/chatLogic";
import GroupChatModal from "./GroupChatModal";
export default function MyChats(props) {
  const [loggedUser, setLoggedUser] = useState("");
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } =ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "error in rendering chats",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [props.fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      h="90%"
      w={{ base: "100%", md: "35%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
        </GroupChatModal>
      </Box>
    
      {
        chats?(
          chats.map(function(chat){
            return(
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "#001C30"}
                px={3}
                py={2}
                mb={1}
                w="100%" 
                borderRadius="lg"
                key={chat._id} >
                <Text>
                {chat.isGroup?(chat.chatName):(getSender(loggedUser,chat))}
                  
                </Text></Box>
            )
          })
          
        ):(
          <ChatLoading/>
        )
      }
    </Box>
  );
}
