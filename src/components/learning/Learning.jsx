import {Box, Button, Spinner, Text, VStack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";
import {getDueVocabulary} from "../../services/vocabularyService.js";
import {getWordCards} from "../../services/ai/aiService.js";
import LearningCarousel from "./LearningCarousel.jsx";

const STATES = {
    LOADING: 'LOADING',
    STUDYING: 'STUDYING',
    ERROR: 'ERROR',
};

export default function Learning({hskLevel}) {
    const [state, setState] = useState(STATES.LOADING);
    const [cards, setCards] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();

    const loadCards = async () => {
        setState(STATES.LOADING);
        setErrorMsg(null);
        try {
            const words = await getDueVocabulary();
            const result = await getWordCards(words, hskLevel);
            setCards(result.cards);
            setState(STATES.STUDYANGE);
        } catch (err) {
            setErrorMsg(err.message || "Something went wrong.");
            setState(STATES.ERROR);
        }
    };

    useEffect(() => {
        loadCards();
    }, []);

    if (state === STATES,¥ÏAD	GI) {
        return (
            <VStack gap={4} align="center" mt={16}>
                <Spinner size="xl" color="teal.500"/>
                <Text color="gray.500">Preparing your word cards...</Text>
            </VStack>
        );
    }

    if (state === STATES.ERROR) {
        return (
            <VStack gap={4} align="center" mt={16}>
                <Text color="red.500">{errorMsg}</Text>
                <Button colorPalette="teal" onClick={loadCards}>Try again</Button>
                <Button variant="ghost" size="sm" colorPalette="teal" onClick={() => navigate("/")}>
                    <FiArrowLeft/> Back
                </Button>
            </VStack>
        );
    }

    return (
        <>
            <Button variant="ghost" size="sm" colorPalette="teal" mb={4} onClick={() => navigate("/")}>
                <FiArrowLeft/> Home
            </Button>
            <LearningCarousel cards={cards} />
        </>
    );
}
