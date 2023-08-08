import React from "react"
import { ChatState } from "../Context/ChatProvider"
import MyChats from "../components/chats/MyChats";
import Chating from "../components/chats/Chating";
import Slide from "../components/chats/Slide";
import { useState } from "react";
import { Box } from "@chakra-ui/react";
export default function ChatsPage() {
    const {user,setSelectedChat}=ChatState();
    const [fetchAgain, setFetchAgain] = useState(false)
    // console.log(user);


  return (
  <div style={{width:"100%"}}>
        {user && <Slide/>}
         <Box display='flex' justifyContent="space-between" w="100%" h="91.5vh" p="10px" >
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <Chating fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        </Box>
  </div>
  )
}
