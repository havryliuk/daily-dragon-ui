import {Button, VStack, Heading, Text, HStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft, FiZap} from "react-icons/fi";

export default function WelcomePage({onStart}) {
    const navigate = useNavigate();
    return (
        <VStack gap={5} align="stretch">
            <HStack justify="space-between" align="center">
                <Button variant="ghost" size="sm" onClick={() => navigate("/")} colorPalette="blue">
                    <FiArrowLeft/> Home
                </Button>
                <HStack gap={2} align="center">
                    <FiZap/>
                    <Heading size="lg">Practice</Heading>
                </HStack>
                <!-- spacer so heading is centred -->
                <Box as="span" w="68px" />
            </HStack>

            <VStack
                align="center"
                py={12}
                bg="white"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.100"
                gap={4}
            >
                <Text fontSize="4xl">🐩</Text>
                <Heading size="md" color="gray.700">
                    Ready to practice?
                </Heading>
                <Text color="gray.500" fontSize="sm" textAlign="center" maxW="320px">
                    Translate Chinese sentences using your vocabulary words.
                    You’ll get AI-powered feedback after each session.
                </Text>
                <Button colorPalette="blue" size="lg" onClick={onStart} px={8}>
                    Start Practice
                </Button>
            </VStack>
        </VStack>
    );
}
