import React from 'react'
import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from '../../Context/ChatProvider'
function UserListItem({data,handelFunction}) {
    console.log(data);
    // const {user}=ChatState();
  return (
    <Box
      onClick={handelFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={data.name}
        src={data.pic}
      />
      <Box>
        <Text>{data.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {data.email}
        </Text>
      </Box>
    </Box>
  )
}

export default UserListItem