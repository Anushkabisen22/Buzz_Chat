import { Box } from '@chakra-ui/react'
import React from 'react'
import { CloseIcon } from '@chakra-ui/icons'
function UserBadgeItem(props) {
  return (
    <Box
    px={2}
    py={1}
    borderRadius="lg"
    m={1}
    mb={2}
    fontSize={12}
    bg="green"
    cursor="pointer"
    color="white"
    onClick={props.handelFunction}
    >
    {props.data.name}
    <CloseIcon pl={1}/>
    </Box>
  )
}

export default UserBadgeItem