import {Heading, Text, HStack, Box, IconButton, Flex, Badge} from "@chakra-ui/react";
import {FiLogOut} from "react-icons/fi";
import {Link} from "react-router-dom";

export default function Header({user, signOut, hskLevel}) {
    return (
        <Box bg="white" borderBottomWidth="1px" borderColor="gray.200" position="sticky" top={0} zIndex={10}>
            <Flex maxW="800px" mx="auto" px={{base: 4, md: 6}} py={3} align="center">
                <Box flex={1}/>
                <Link to="/" style={{textDecoration: "none"}}>
                    <Heading size="xl" colorPalette="teal">每日龙</Heading>
                </Link>
                <Box flex={1}>
                    <HStack justify="flex-end">
                        <Text fontSize="sm" color="gray.500" display={{base: "none", sm: "block"}}>
                            <Box as="span" fontWeight="semibold" color="gray.700">{user.username}</Box>
                        </Text>
                        {hskLevel && (
                            <Badge colorPalette="teal" variant="subtle" size="sm">HSK {hskLevel}</Badge>
                        )}
                        <IconButton size="sm" onClick={signOut} colorPalette="teal" variant="ghost" aria-label="Sign out">
                            <FiLogOut/>
                        </IconButton>
                    </HStack>
                </Box>
            </Flex>
        </Box>
    );
}
