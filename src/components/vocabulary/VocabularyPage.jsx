import {AddWordDialog} from "./AddWordDialog.jsx";
import {Spinner, Button, Heading, Box, HStack, Text} from "@chakra-ui/react";
import {VocabularyList} from "./VocabularyList.jsx";
import {useEffect, useState} from "react";
import {fetchVocabulary} from "../../services/vocabularyService.js";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";

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
        <>
            <Button variant="ghost" size="sm" colorPalette="teal" mb={4} onClick={() => navigate("/")}>
                <FiArrowLeft/> Home
            </Button>
            <HStack justify="space-between" align="center" mb={4}>
                <HStack gap={2} align="baseline">
                    <Heading size="lg">Vocabulary</Heading>
                    {!loadingVocabulary && <Text fontSize="sm" color="gray.500">{items.length} words</Text>}
                </HStack>
                <AddWordDialog onAdd={refresh}/>
            </HStack>
            {loadingVocabulary
                ? <Box py={8} textAlign="center"><Spinner colorPalette="teal" size="lg"/></Box>
                : <VocabularyList items={items} onDelete={refresh}/>
            }
        </>
    );
}
