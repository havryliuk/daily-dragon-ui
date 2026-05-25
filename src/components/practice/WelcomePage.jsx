import {Box, Button, Heading, Text, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";

export default function WelcomePage({onStart}) {
    const navigate = useNavigate();
    return (
        <>
            <Button variant="ghost" size="sm" colorPalette="teal" mb={4} onClick={() => navigate("/")}>
                <FiArrowLeft/> Home
            </Button>
            <Box
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="xl"
                boxShadow="sm"
                p={8}
                maxW="500px"
                mx="auto"
            >
                <VStack gap={6} align="stretch">
                    <Heading size="lg" textAlign="center">Practice</Heading>
                    <Text color="gray.600" textAlign="center">
                        Translate Chinese sentences using words from your vocabulary list.
                    </Text>
                    <Button colorPalette="teal" size="lg" onClick={onStart}>
                        Start Practice
                    </Button>
                </VStack>
            </Box>
        </>
    );
}
