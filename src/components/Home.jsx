import {Button, VStack, Heading, Text, Box, HStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {FiBook, FiZap} from "react-icons/fi";

export default function Home() {
    const navigate = useNavigate();

    return (
        <VStack gap={8} align="center" mt={8}>
            <VStack gap={2} textAlign="center">
                <Text fontSize="5xl">🐩</Text>
                <Heading size="2xl" color="blue.600">Daily Dragon</Heading>
                <Text color="gray.500" fontSize="md">
                    Your daily Chinese practice companion
                </Text>
            </VStack>

            <HStack gap={4} flexWrap="wrap" justify="center">
                <Box
                    as="button"
                    onClick={() => navigate("/vocabulary")}
                    cursor="pointer"
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    p={6}
                    w={"160px"}
                    _hover={{bg: "blue.50", borderColor: "blue.300", transform: "translateY(-2px)"}}
                    transition="all 0.2s"
                >
                    <VStack gap={2} align="center">
                        <Text fontSize="3xl"><FiBook/></Text>
                        <Text fontWeight="semibold" fontSize="md">
                            Vocabulary
                        </Text>
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                            Manage your word list
                        </Text>
                    </VStack>
                </Box>

                <Box
                    as="button"
                    onClick={() => navigate("/practice")}
                    cursor="pointer"
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    p={6}
                    w={"160px"}
                    _hover={{bg: "blue.50", borderColor: "blue.300", transform: "translateY(-2px)"}}
                    transition="all 0.2s"
                >
                    <VStack gap={2} align="center">
                        <Text fontSize="3xl"><FiZap/></Text>
                        <Text fontWeight="semibold" fontSize="md">
                            Practice
                        </Text>
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                            Translate sentences
                        </Text>
                    </VStack>
                </Box>
            </HStack>
        </VStack>
    )
}
