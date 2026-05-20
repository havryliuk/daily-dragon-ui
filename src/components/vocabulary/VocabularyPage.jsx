import {AddWordDialog} from "./AddWordDialog.jsx";
import {Spinner, Button, VStack, Heading, HStack, Text} from "@chakra-ui/react";
import {VocabularyList} from "./VocabularyList.jsx";
import {useEffect, useState} from "react";
import {fetchVocabulary} from "../../services/vocabularyService.js";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft, FiBook} from "react-icons/fi";

export default function VocabularyPage() {

    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loadingVocabulary, setLoadingVocabulary] = useState(true);

    const refresh = () => {
        fetchVocabulary()
            .then(vocabulary => {
                setItems(vocabulary);
                setLoadingVocabulary(false);
            })
            .catch(err => {
                console.error(err);
            });
    }

    useEffect(() => {
        refresh();
    }, []);

    return (
        <VStack gap={5} align="stretch">
            <HStack justify="space-between" align="center">
                <Button variant="ghost" size="sm" onClick={() => navigate("/")} colorPalette="blue">
                    <FiArrowLeft/> Home
                </Button>
                <HStack gap={2} align="center">
                    <FiBook />
                    <Heading size="lg">Vocabulary</Heading>
                    <Text color="gray.400" fontSize="sm">
                        {items.length} words
                    </Text>
                </HStack>
                <AddWordDialog onAdd={refresh}/>
            </HStack>

            {
                loadingVocabulary ? (
                    <VStack align="center" py={10}>
                        <Spinner size="xl" color="blue.500"/>
                    </VStack>
                ) : (
                    <VocabularyList items={items} onDelete={refresh}/>
                )
            }
        </VStack>
    );
}
