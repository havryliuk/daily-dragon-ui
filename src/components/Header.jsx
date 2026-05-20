import {Heading, Text, HStack, Box, IconButton, Flex, Separator} from "@chakra-ui/react";
import {FiLogOut} from "react-icons/fi";
import {Link} from "react-router-dom";

export default function Header({user, signOut}) {
    return (
        <Box
            as="header"
            width="100%"
            bg="white"
            boxShadow="sm"
            position="sticky"
            top={0}
            zIndex={10}
        >
            <Flex
                maxW="800px"
                mx="auto"
                px={4}
                py={3}
                align="center"
            >
                <Box flex={1}/>
                <Link to="/" style={{textDecoration: "none"}}>
                    <HStack gap={2} align="center">
                        <Text fontSize="2xl">🐩</Text>
                        <Heading
                            size="xl"
                            color="blue.600"
                            letterSpacing="wider"
                            fontWeight="bold"
                        >
                            毫�_配
                        </Heading>
                    </HStack>
                </Link>
                <Box flex={1}>
                    <HStack justify="flex-end" gap={2} align="center">
                        <Text fontSize="sm" color="gray.600" display={{base: "none", sm: "block"}}>
                            {user.username}
                        </Text>
                        <IconButton
                            aria-label="Sign out"
                            size="sm"
                            onClick={signOut}
                            colorPalette="blue"
                            variant="outline"
                            title="Sign out"
                        >
                            <FiLogOut/>
                        </IconButton>
                    </HStack>
                </Box>
            </Flex>
            <Separator/>
        </Box>
    );
}
