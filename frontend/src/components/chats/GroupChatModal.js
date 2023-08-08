import React from "react";
import { Button, FormControl, useToast, Input } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();
  const searchHandel = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "error",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  const handelSubmit =async () => {
    if(!groupChatName || !selectedUsers){
      toast({
        title: "please fill the field",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return ;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data}=await axios.post('/api/chat/group',{
        name:groupChatName,
        users:JSON.stringify(selectedUsers.map((u)=>u._id))
      },config);
      setChats([data,...chats]);
      onClose();
      toast({
        title: "new group chat created",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    } catch (error) {
      toast({
        title: "failed to create chat",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  const handelGroup=(userToAdd)=>{
      if(selectedUsers.includes(userToAdd)){
        toast({
        title: "Already Selected",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
      }
      setSelectedUsers([...selectedUsers,userToAdd]);

  };
  const handelDelete=(userToDelete)=>{
     setSelectedUsers(selectedUsers.filter(sel=>sel._id !=userToDelete._id))
  }
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work Sans"
            display="flex"
            justifyContent="center"
          >
            Create Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
          ></ModalBody>
          <FormControl>
            <Input
              placeholder="Chat Name"
              mb={3}
              w="90%"
              ml={2}
              onChange={(e) => {
                setGroupChatName(e.target.value);
              }}
            />
          </FormControl>
          <FormControl>
            <Input
              placeholder="Select users eg:John, Sophie..."
              w="90%"
              mb={3}
              ml={2}
              onChange={(e) => {
                searchHandel(e.target.value);
              }}
            />
          </FormControl>
          <Box w="100%" display="flex" flexWrap="wrap">
          {selectedUsers.map(function(user){
            return (
              <UserBadgeItem key={user._id} data={user} handelFunction={()=>handelDelete(user)} />
            )
          })}
          </Box>
          {loading ? (
            <div>loading</div>
          ) : searchResult ? (
            searchResult.slice(0,3).map(function (user) {
              return (
                <UserListItem key={user._id} data={user} handelFunction={()=>{handelGroup(user)}}/>
              );
            })
          ) : (
            <ChatLoading />
          )}
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handelSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal;
