import React from 'react'
import {Box, Container,Text,Tabs,Tab,TabList,TabPanel,TabPanels,} from '@chakra-ui/react';
import Login from '../components/Auth/Login';
import SignUp from '../components/Auth/SignUp';
import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
export default function LoginPage() {
  const navigate=useNavigate();
  useEffect(() => {
    const user=JSON.parse(localStorage.getItem('userInfo'));
    if(user){
      navigate('/chats');
    }
  }, [navigate])
  
  return (
  <Container maxW='xl'  centerContent>
          <Box 
          mt={'-3px'}
          d="flex"
          justifyContent='center'
          p={4}
          bg={"#176B87"}
          w='100%'
          m='13px 0px 10px 0px'
          borderRadius='lg'
          borderWidth='1px'
          > <Text fontSize='3xl' textAlign='center' fontFamily='Work sans' >Buzz Chat</Text>  </Box>
          <Box
          mt={'-3px'}
          d="flex"
          justifyContent='center'
          p={3}
          bg={"#176B87"}
          w='100%'
          m='40px 0px 15px 0px'
          borderRadius='lg'
          borderWidth='0.5px'>
          <Tabs isFitted variant='enclosed'>
  <TabList mb='1em' color={'white'}>
    <Tab>LoginIn</Tab>
    <Tab>SignUp</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <SignUp/>
    </TabPanel>
  </TabPanels>
</Tabs>
</Box>

</Container>
  )
}
