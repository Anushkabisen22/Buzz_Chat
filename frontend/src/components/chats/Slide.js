import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Drawer,
  useDisclosure,
  DrawerHeader,
  DrawerContent,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { getSender } from "../../config/chatLogic";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React from "react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import axios from "axios";
function Slide() {
  const { user, setSelectedChat, chats, setChats,notifications,setNotifications } = ChatState();
  // console.log(user.token);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setloadingChat] = useState("");
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const toast = useToast();
  const handelSearch = async () => {
    if (!search) {
      toast({
        title: "please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
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
      if(searchResult.includes(data)){
        toast({
        title: "Already Selected",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });}
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "fail to find user",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  };
  const accessChat = async (Id) => {
    try {
      setloadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { Id }, config);
      if (chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      // console.log(data);
      setloadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "error fetching the chats",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = React.useState("right");
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100"
        color="black"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search user to Chat" hasArrow placement="bottom-end">
          <Button onClick={onOpen}>
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Buzz-Chat
        </Text>
        <div style={{ display: "flex" }}>
          <Menu>
            <MenuButton mr={2}>
              <BellIcon />
            </MenuButton>
            <MenuList pl={3}>
              {!notifications.length && "No new messages"}
              
              {notifications.map(notif => {
                <MenuItem key={notif._id}>
                  {notif.chat.isGroup ? `Message from ${notif.chat.chatName}` : `Message from ${getSender(user,notif.chat)} }`}
                </MenuItem>
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal info={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>

              <MenuItem onClick={logoutHandler}>LogOut</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerHeader />
        <DrawerContent borderBottomWidth="1px">
          <Text ml="35%" fontSize="3xl">
            Search
          </Text>
          <DrawerBody>
            <Box display="flex" pb="2px">
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                border="1px solid black"
              />
              <Button onClick={handelSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((val) => (
                <ProfileModal
                  key={val._id}
                  info={val}
                  handelFunction={() => accessChat(val._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Slide;
