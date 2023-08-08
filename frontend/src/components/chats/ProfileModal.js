import React from 'react'
import { Text ,Box} from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'

function ProfileModal(props) {
  // console.log(props.info);
  const name = props.info?.name;
  const pic= props.info?.pic;
  const email = props.info?.email;


  return (
    <Box
      onClick={props.handelFunction}
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
        name={name}
        src={pic}
      />
      <Box>
        <Text>
        {name}
        </Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {email}
        </Text>
      </Box>
    </Box>
  )
}

export default ProfileModal