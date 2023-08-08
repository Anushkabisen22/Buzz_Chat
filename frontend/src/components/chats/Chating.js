import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';
export default function Chating(props) {
  const {selectedChat}=ChatState();

  return (
    <Box
    display={{base:selectedChat?"flex":"none" ,md:"flex"}}
    alignItems="center"
    flexDir="column"
    p={3}
    bg="white"
    w={{base:"100%",md:"68%"}}
    h="90%"
    ml={1}
    borderRadius="lg"
    borderWidth="1px"
    >
    <SingleChat fetchAgain={props.fetchAgain} setFetchAgain={props.setFetchAgain}/>
    </Box>
  )
}
