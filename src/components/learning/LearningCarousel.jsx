import {Box, Button, HStack, Text} from "@chakra-ui/react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft, FiArrowRight} from "react-icons/fi";
import WordCard from "./WordCard.jsx";

export default function LearningCarousel({cards}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const total = cards.length;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === total - 1;

    const goPrev = () => setCurrentIndex(i => i - 1);
    const goNext = () => setCurrentIndex(i => i + 1);

    return (
        <Box>
            {/* Card */}
            <WordCard card={cards[currentIndex]} />

            {/* Navigation bar */}
            <HStack justify="space-between" align="center" mt={6}>
                {/* Back to home - always visible on the left */}
                <Button
                    variant="ghost"
                    size="sm"
                    colorPalette="teal"
                    onClick={() => navigate("/")}
                >
                    <FiArrowLeft/> Back
                </Button>

                {/* Card counter */}
                <HStack gap={2} align="center">
                    {isFirst ? null : (
                        <Button
                            variant="ghost"
                            size="sm"
                            colorPalette="gray"
                            onClick={goPrev}
                            aria-label="Previous card"
                        >
                            <FiArrowLeft/>
                        </Button>
                    )}
                    <Text fontSize="sm" color="gray.600" minW="48px">
                        {currentIndex + 1} / {total}
                    </Text>
                    {isLast ? null : (
                        <Button
                            variant="ghost"
                            size="sm"
                            colorPalette="gray"
                            onClick={goNext}
                            aria-label="Next card"
                        >
                            <FiArrowRight/>
                        </Button>
                    )}
                </HStack>

                {/* Practice button - only on the last card */}
                {isLast ? (
                    <Button
                        colorPalette="teal"
                        size="sm"
                        onClick={() => navigate("/practice")}
                    >
                        Practice these words now
                    </Button>
                ) : (
                    {/* Spacer so layout does not shift on non-last cards */}
                    <Box w="48px" />
                )}
            </HStack>
        </Box>
    );
}
