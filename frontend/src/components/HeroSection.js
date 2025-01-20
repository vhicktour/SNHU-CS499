import React from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Image,
  Button,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionGrid = motion(Grid);

const rescueImages = [
  {
    url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b",
    alt: "German Shepherd Rescue Dog"
  },
  {
    url: "https://images.unsplash.com/photo-1575425186775-b8de9a427e67",
    alt: "Water Rescue Dog"
  },
  {
    url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb",
    alt: "Mountain Rescue Dog"
  },
  {
    url: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6",
    alt: "Search and Rescue Dog"
  }
];

const HeroSection = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      position="relative"
      overflow="hidden"
      width="100%"
    >
      <Box maxW="100%" px={4} py={20}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          spacing={10}
          align="center"
          justify="space-between"
          width="100%"
        >
          <MotionBox
            flex="1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MotionHeading
              as="h1"
              size="2xl"
              lineHeight="1.2"
              mb={6}
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Rescued Animals Dashboard
            </MotionHeading>
            <MotionText
              fontSize="xl"
              color={useColorModeValue('gray.600', 'gray.300')}
              mb={8}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Track and monitor rescued animals in our shelter. Our dashboard provides comprehensive 
              information about rescued animals, their current status, and outcomes.
            </MotionText>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              spacing={4}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              as={motion.div}
            >
              <Button
                size="lg"
                colorScheme="blue"
                px={8}
                fontSize="md"
                fontWeight="bold"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                px={8}
                fontSize="md"
                fontWeight="bold"
                variant="outline"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                Learn More
              </Button>
            </Stack>
          </MotionBox>

          <MotionBox
            flex="1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            display={{ base: 'none', lg: 'block' }}
          >
            <MotionGrid
              templateColumns="repeat(2, 1fr)"
              gap={4}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {rescueImages.map((image, index) => (
                <GridItem key={index}>
                  <Box
                    position="relative"
                    height="200px"
                    overflow="hidden"
                    borderRadius="xl"
                    boxShadow="lg"
                    transition="transform 0.3s ease"
                    _hover={{
                      transform: 'scale(1.05)',
                      boxShadow: 'xl',
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      objectFit="cover"
                      width="100%"
                      height="100%"
                      fallback={
                        <Box
                          width="100%"
                          height="100%"
                          bg="gray.100"
                          _dark={{ bg: 'gray.700' }}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text color="gray.500">Loading...</Text>
                        </Box>
                      }
                    />
                    <Box
                      position="absolute"
                      bottom="0"
                      left="0"
                      right="0"
                      bg="blackAlpha.60"
                      p={2}
                      backdropFilter="blur(4px)"
                    >
                      <Text
                        color="white"
                        fontSize="sm"
                        fontWeight="medium"
                        textAlign="center"
                      >
                        {image.alt}
                      </Text>
                    </Box>
                  </Box>
                </GridItem>
              ))}
            </MotionGrid>
          </MotionBox>
        </Stack>
      </Box>

      {/* Background decorative elements */}
      <Box
        position="absolute"
        top="-10%"
        right="-10%"
        width="500px"
        height="500px"
        bg="blue.50"
        _dark={{ bg: 'blue.900' }}
        rounded="full"
        filter="blur(70px)"
        opacity="0.4"
        zIndex="0"
      />
      <Box
        position="absolute"
        bottom="-20%"
        left="-10%"
        width="600px"
        height="600px"
        bg="purple.50"
        _dark={{ bg: 'purple.900' }}
        rounded="full"
        filter="blur(70px)"
        opacity="0.4"
        zIndex="0"
      />
    </Box>
  );
};

export default HeroSection;
