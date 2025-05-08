'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Heading,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

export default function Header() {
  const pathname = usePathname();
  // Fix: Use useState instead of useDisclosure to avoid type issues
  const [isOpen, setIsOpen] = useState(false);
  
  const onToggle = () => setIsOpen(!isOpen);
  
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Add Income', path: '/add-income' },
    { name: 'Add Expense', path: '/add-expense' },
    { name: 'Transactions', path: '/expenses' },
    { name: 'Categories', path: '/categories' },
  ];

  return (
    <Box as="header" bg="gray.900" boxShadow="md" borderBottomWidth="1px" borderBottomColor="gray.700">
      <Flex
        color="white"
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}
        maxW="container.xl"
        mx="auto"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          >
            {isOpen ? <CloseIcon /> : <HamburgerIcon />}
          </IconButton>
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Heading
            as="h1"
            size="lg"
            fontWeight="bold"
            bgGradient="linear(to-r, windsurf.400, windsurf.600)"
            bgClip="text"
            textAlign={{ base: 'center', md: 'left' }}
          >
            BL
         </Heading>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <Flex gap={4} direction="row">
              {navItems.map((item) => (
                <NextLink key={item.path} href={item.path} passHref>
                  <Button
                    as="a"
                    variant={pathname === item.path ? 'solid' : 'ghost'}
                    colorScheme={pathname === item.path ? 'windsurf' : undefined}
                    size="sm"
                  >
                    {item.name}
                  </Button>
                </NextLink>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {isOpen && (
        <Box
          bg="gray.900"
          p={4}
          display={{ md: 'none' }}
          borderBottomWidth="1px"
          borderBottomColor="gray.700"
        >
          <Flex direction="column" gap={2}>
            {navItems.map((item) => (
              <NextLink key={item.path} href={item.path} passHref>
                <Box
                  as="a"
                  py={2}
                  px={3}
                  borderRadius="md"
                  _hover={{
                    textDecoration: 'none',
                    bg: 'gray.800',
                  }}
                  bg={pathname === item.path ? 'gray.800' : undefined}
                  color={pathname === item.path ? 'windsurf.400' : 'gray.200'}
                >
                  <Text fontWeight={pathname === item.path ? 'semibold' : 'normal'}>
                    {item.name}
                  </Text>
                </Box>
              </NextLink>
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  );
}
