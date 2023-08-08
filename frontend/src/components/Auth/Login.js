import {
  FormControl,
  FormLabel,
  VStack,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("false");
  const toast = useToast();
  const navigate = useNavigate();
  const handelClick = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const {data}  = await axios.post(
        "/api/user/login",
        { email:email, password:password },
        config
      );
      console.log(data);
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="3px">
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type="email" onChange={(e) => setEmail(e.target.value)}/>
        <FormLabel>Password</FormLabel>
        <Input type="password" onChange={(e) => setPassword(e.target.value)}/>
        <Button
          colorScheme="teal"
          width="100%"
          mt={15}
          size="md"
          onClick={handelClick}
          // isLoading={loading}
        >
          LogIn
        </Button>
        <Button
          colorScheme="red"
          width="100%"
          mt={15}
          size="md"
          onClick={() => {
            setEmail("guest123@mail.com");
            setPassword("1234");
          }}
        >
          Guest User
        </Button>
      </FormControl>
    </VStack>
  );
}
