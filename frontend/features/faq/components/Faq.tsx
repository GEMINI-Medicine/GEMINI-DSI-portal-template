import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
} from "@chakra-ui/react";

export default function Faq({ document }) {
    if (document) {
        return (
            <Accordion
                defaultIndex={[0]}
                allowMultiple
                width="100%"
                boxShadow="md"
                overflow="auto"
                sx={{ maxHeight: "calc(100vh - 20em)" }}
            >
                {document.props.items.map((item, index) => {
                    if (
                        item.question.trim() !== "" &&
                        item.answer.trim() !== ""
                    ) {
                        return (
                            <AccordionItem key={index}>
                                <h2>
                                    <AccordionButton
                                        _expanded={{
                                            bg: "brand.500",
                                            color: "white",
                                        }}
                                    >
                                        <Box
                                            as="span"
                                            flex="1"
                                            textAlign="left"
                                            fontWeight="bold"
                                        >
                                            {index + 1}. {item.question}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    {item.answer}
                                </AccordionPanel>
                            </AccordionItem>
                        );
                    }
                    return null;
                })}
            </Accordion>
        );
    }
    return null;
}
