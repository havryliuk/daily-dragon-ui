import React, {useState} from "react";
import {RemoveWordDialog} from "./RemoveWordDialog.jsx";
import {
    SimpleGrid,
    Box,
    Text,
    Button,
    HStack,
    Flex,
} from "@chakra-ui/react";

const PAGE_SIZE = 10;

export function VocabularyList({items, onDelete}) {
    const [page, setPage] = useState(0);

    const start = page * PAGE_SIZE;
    const pageItems = items.slice(start, start + PAGE_SIZE);
    const pageCount = Math.ceil(items.length / PAGE_SIZE);

    if (items.length === 0) {
        return (
            <Box
                textAlign="center"
                py={12}
                color="gray.400"
                bg="white"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.100"
            >
                <Text fontSize="3xl" mb={2}>💄</Text>
                <Text fontSize="md">No words yet. Add your first word!</Text>
            </Box>
        );
    }

    return (
        <>
            <SimpleGrid columns={{base: 1, md: 2}} gap={3}>
                {pageItems.map((item, index) => (
                    <Flex
                        key={start + index}
                        align="center"
                        justify="space-between"
                        px={4}
                        py={3}
                        bg="white"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="gray.100"
                        _hover={{borderColor: "blue.200", boxShadow: "sm"}}
                        transition="all 0.15s"
                    >
                        <Text fontSize="lg" fontWeight="medium">{item}</Text>
                        <RemoveWordDialog word={item} onDelete={onDelete}/>
                    </Flex>
                ))}
            </SimpleGrid>

            {pageCount > 1 && (
                <HStack mt={4} justify="center" gap={3} align="center">
                    <Button
                        variant="outline"
                        size="sm"
                        colorPalette="blue"
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 0}
                    >
                        ◐
                    </Button>
                    <Text fontSize="sm" color="gray.500">
                        {page + 1} / {pageCount}
                    </Text>
                    <Button
                        variant="outline"
                        size="sm"
                        colorPalette="blue"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === pageCount - 1}
                    >
                        ◒
                    </Button>
                </HStack>
            )}
        </>
    );
}
