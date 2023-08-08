import React, { useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { useState } from "react";
import axios from "axios";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import ScrolableChat from "./ScrolableChat";
import io from 'socket.io-client';
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/chatLogic";
import ProfileModal from "./ProfileModal";
import UpdateGroup from "./UpdateGroup";
import './style.css';
const ENDPOINT = "http://localhost:5000";
var socket, selectedSocketCompare;
function SingleChat(props) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessages, setNewMessages] = useState();
  const { user, selectedChat, setSelectedChat,notifications,setNotifications} = ChatState();
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  
  const sendMessage = async (event) => {
    if (event.key == "Enter" && newMessages) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          };
           setNewMessages("");
          const { data } = await axios.post('/api/message', {
              content: newMessages,
              chatId: selectedChat._id
          }, config);
          // console.log(data);
        socket.emit('new message', data);
        setMessages([...messages, data]);
      } catch (error) {
          toast({
        title: "error occured",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      }
    }
  };
  
  const fetchChats = async () => {
    if (!selectedChat) {
      return;
    }
    try {
         const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
      };
      const { data } = await axios.get(`api/message/${selectedChat._id}`, config);
      // console.log(data);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
           toast({
        title: "error occured",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  }
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connection', () => {
      setsocketConnected(true);
    })

    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, [])
  useEffect(() => {
    fetchChats();
    selectedSocketCompare = selectedChat;
  }, [selectedChat])
  console.log(notifications);
  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      if (!selectedSocketCompare || selectedSocketCompare._id !== newMessage.chat._id) {
           //give notifications
        if (!notifications.includes(newMessage)) {
          setNotifications([newMessage, ...notifications]);
          props.setFetchAgain(!props.fetchAgain);
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    })
  })
  const typingHandler = (e) => {
    setNewMessages(e.target.value);
    if (!socketConnected) {
      return;
    }
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timer = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff > timer && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timer);

  };
  
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat("");
              }}
            />
            {!selectedChat.isGroup ? (
              <>
                {getSender(user, selectedChat)}
                {/* <ProfileModal info={getSenderFull(user,selectedChat)}/> */}
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroup
                  fetchAgain={props.fetchAgain}
                    setFetchAgain={props.setFetchAgain}
                    fetchChats={fetchChats}
                />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            p={3}
            bg="#E8E8E8"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* <div className="messages">
                  Helooojk
                </div> */}
            {loading ? (
              <Spinner
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
                size="lg"
              />
            ) : (
                <div className="messages">
                  <ScrolableChat  messages={ messages} />
                </div>
            )} 
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? <div>
                typing...
              </div>:<></>}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessages}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Select a user
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
