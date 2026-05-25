import React, {useState} from "react";
import {RemoveWordDialog} from "./RemoveWordDialog.jsx";
import {SimpleGrid, Box, Text, Button, HStack} from "@chakra-ui/react";

const PAGE_SIZE = 12;

export function VocabularyList({items, onDelete}) {
    const [page, setPage] = useState(0);

    const start = page * PAGE_SIZE;
    const pageItems = items.slice(start, start + PAGE_SIZE);
    const pageCount = Math.ceil(items.length / PAGE_SIZE);

    return (
        <>
            <SimpleGrid columns={{base: 2, md: 4}} gap={4}>
                {pageItems.map((item, index) => (
                    <Box
                        key={start + index}
                        p={4}
                        bg="white"
                        borderWidth="1px"
                        borderColor="gray.200"
                        borderRadius="lg"
                        boxShadow="sm"
                        _hover={{boxShadow: "md"}}
                        transition="all 0.15s"
                        textAlign="center"
                        position="relative"
                    >
                        <Text fontSize="2xl" fontWeight="bold" color="teal.700">{item}</Text>
                        <Box position="absolute" top={2} right={2}>
                            <RemoveWordDialog word={item} onDelete={onDelete}/>
                        </Box>
                    </Box>
                ))}
            </SimpleGrid>

            {pageCount > 1 && (
                <HStack mt={6} justify="center">
                    <Button
                        variant="ghost"
                        colorPalette="teal"
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 0}
                    >
                        ◀
                    </Button>
                    <Text fontSize="sm" color="gray.500" minW="80px" textAlign="center">
                        {page + 1} / {pageCount}
                    </Text>
                    <Button
                        variant="ghost"
                        colorPalette="teal"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === pageCount - 1}
                    >
                        ▶
                    </Button>
                </HStack>
            )}
        </>
    );
}
