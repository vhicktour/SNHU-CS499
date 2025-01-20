import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
  HStack,
  SimpleGrid,
  Image,
} from '@chakra-ui/react';
import { FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import Lottie from 'lottie-react';
import catAnimation from '../assets/lottie/cat.json';
import dogAnimation from '../assets/lottie/dog.json';

const Arrow = createIcon({
  displayName: 'Arrow',
  viewBox: '0 0 72 24',
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z"
      fill="currentColor"
    />
  ),
});

const features = [
  'Advanced search and filtering',
  'Real-time updates',
  'Interactive maps',
  'Detailed statistics',
];

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
  const navigate = useNavigate();
  const buttonBg = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100');
  const buttonColor = useColorModeValue('gray.800', 'white');
  const buttonBorderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const buttonHoverBorderColor = useColorModeValue('gray.300', 'whiteAlpha.400');
  const buttonHoverBg = useColorModeValue('gray.50', 'whiteAlpha.200');
  const buttonActiveBorderColor = useColorModeValue('gray.400', 'whiteAlpha.500');
  const featureTextColor = useColorModeValue('gray.600', 'gray.400');

  const handleGetStarted = () => {
    navigate('/');
  };

  const handleLearnMore = () => {
    navigate('/statistics');
  };

  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      position="relative"
      overflow="hidden"
      minH={{ base: "auto", md: "70vh" }}
    >
      {/* Cat animation - left side */}
      <Box
        position="absolute"
        top="50%"
        left="5%"
        transform="translateY(-60%)"
        width={{ base: "200px", md: "300px", lg: "400px" }}
        height={{ base: "200px", md: "300px", lg: "400px" }}
        opacity="0.85"
        zIndex="1"
        display={{ base: "none", md: "block" }}
        filter="drop-shadow(0 0 10px rgba(0,0,0,0.1))"
        _dark={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.1))" }}
      >
        <Lottie
          animationData={catAnimation}
          loop={true}
          style={{ width: '100%', height: '100%' }}
        />
      </Box>

      {/* Dog animation - right side */}
      <Box
        position="absolute"
        bottom="0"
        right="5%"
        width={{ base: "200px", md: "300px", lg: "400px" }}
        height={{ base: "200px", md: "300px", lg: "400px" }}
        opacity="0.85"
        zIndex="1"
        display={{ base: "none", md: "block" }}
        filter="drop-shadow(0 0 10px rgba(0,0,0,0.1))"
        _dark={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.1))" }}
      >
        <Lottie
          animationData={dogAnimation}
          loop={true}
          style={{ width: '100%', height: '100%' }}
        />
      </Box>

      <Container maxW="8xl" px={{ base: 4, md: 8 }} py={{ base: 4, md: 6 }}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          spacing={{ base: 4, lg: 8 }}
          align="center"
          justify="space-between"
        >
          {/* Left side - Content */}
          <Stack
            spacing={4}
            maxW={{ base: "100%", lg: "50%" }}
            textAlign={{ base: "center", lg: "left" }}
          >
            <Heading
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
              lineHeight="shorter"
            >
              Find Your Perfect <br />
              <Text as="span" color="blue.400">
                Rescue Companion
              </Text>
            </Heading>
            
            <Text 
              color={useColorModeValue('gray.600', 'gray.300')} 
              fontSize={{ base: 'lg', lg: 'xl' }}
              maxW={{ base: "100%", lg: "90%" }}
            >
              Join us in making a difference. Our platform connects loving homes with animals in need,
              featuring real-time updates, advanced search capabilities, and comprehensive animal profiles.
            </Text>

            {/* Features list */}
            <Box display={{ base: 'none', md: 'block' }}>
              <SimpleGrid columns={{ base: 2 }} spacing={4}>
                {features.map((feature, index) => (
                  <HStack key={index} spacing={2}>
                    <Icon as={Arrow} w={4} h={4} color="blue.400" />
                    <Text color={featureTextColor} fontSize="md">
                      {feature}
                    </Text>
                  </HStack>
                ))}
              </SimpleGrid>
            </Box>

            {/* Buttons */}
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              spacing={4}
              width={{ base: "100%", sm: "auto" }}
            >
              <Button
                as="a"
                colorScheme="blue"
                rounded="full"
                size="lg"
                px={8}
                onClick={handleGetStarted}
                rightIcon={<Icon as={FaArrowRight} transition="transform 0.3s ease" />}
                cursor="pointer"
                position="relative"
                overflow="hidden"
                w={{ base: "100%", sm: "auto" }}
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bg: 'whiteAlpha.300',
                  transform: 'translateX(-100%)',
                  transition: 'transform 0.3s ease',
                }}
                _hover={{
                  transform: 'translateY(-2px)',
                  '& > svg': {
                    transform: 'translateX(4px)',
                  },
                  _before: {
                    transform: 'translateX(100%)',
                  },
                }}
                _active={{
                  transform: 'scale(0.95)',
                  bg: 'blue.600',
                }}
              >
                Get Started
              </Button>

              <Button
                as="a"
                rounded="full"
                size="lg"
                fontWeight="normal"
                px={8}
                onClick={handleLearnMore}
                leftIcon={<Icon as={FaInfoCircle} transition="transform 0.3s ease" />}
                bg={buttonBg}
                color={buttonColor}
                borderWidth={2}
                borderColor={buttonBorderColor}
                w={{ base: "100%", sm: "auto" }}
                _hover={{
                  borderColor: buttonHoverBorderColor,
                  transform: 'translateY(-2px)',
                  bg: buttonHoverBg,
                  '& > svg': {
                    transform: 'rotate(15deg)',
                  },
                }}
                _active={{
                  transform: 'scale(0.95)',
                  borderColor: buttonActiveBorderColor,
                }}
              >
                Learn More
              </Button>
            </Stack>
          </Stack>

          {/* Right side - Images */}
          <Box 
            flex={1} 
            w={{ base: "100%", lg: "50%" }}
            display={{ base: "none", md: "block" }}
          >
            <SimpleGrid
              columns={{ base: 1, sm: 2 }}
              spacing={4}
            >
              {rescueImages.map((image, index) => (
                <Box
                  key={index}
                  position="relative"
                  height={{ base: "200px", lg: "300px" }}
                  rounded="xl"
                  overflow="hidden"
                  shadow="xl"
                  transform={index % 2 === 0 ? "translateY(20px)" : "translateY(-20px)"}
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "scale(1.05)",
                    shadow: "2xl",
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    bg="blackAlpha.600"
                    p={3}
                    backdropFilter="blur(8px)"
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
              ))}
            </SimpleGrid>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;