'use client';

import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  VStack,
} from '@chakra-ui/react';
import Header from '../../components/Header';
import { useExpenses } from '../../context/ExpenseContext';
import { useState } from 'react';
import { Transaction } from '../../types';

export default function AddIncomePage() {
  const router = useRouter();
  const { categories, addTransaction } = useExpenses();
  
  // Filter only income categories
  const incomeCategories = categories.filter(cat => cat.type === 'income' || cat.type === 'both');
  
  const [transaction, setTransaction] = useState<Omit<Transaction, 'id'>>({
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'income'
  });
  
  const [errors, setErrors] = useState({
    description: '',
    amount: '',
    category: ''
  });

  const validate = (): boolean => {
    let valid = true;
    const newErrors = {
      description: '',
      amount: '',
      category: ''
    };

    if (!transaction.description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    }

    if (!transaction.amount || transaction.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
      valid = false;
    }

    if (!transaction.category) {
      newErrors.category = 'Category is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description: transaction.description,
      amount: Number(transaction.amount),
      category: transaction.category,
      date: transaction.date,
      type: 'income'
    };
    
    addTransaction(newTransaction);
    router.push('/');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (valueAsString: string) => {
    setTransaction(prev => ({ ...prev, amount: parseFloat(valueAsString) || 0 }));
  };

  return (
    <Box minH="100vh" bg="gray.900">
      <Header />
      <Container maxW="container.md" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" color="white">
            Add New Income
          </Heading>
          
          <Card bg="gray.800" borderRadius="lg" boxShadow="lg">
            <CardHeader pb={0}>
              <Heading size="md" color="white">Income Details</Heading>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl isInvalid={!!errors.description}>
                    <FormLabel color="gray.300">Description</FormLabel>
                    <Input
                      name="description"
                      value={transaction.description}
                      onChange={handleChange}
                      placeholder="Income description"
                      bg="gray.700"
                      border="none"
                      color="white"
                    />
                    {errors.description && (
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                    )}
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.amount}>
                    <FormLabel color="gray.300">Amount</FormLabel>
                    <NumberInput
                      min={0}
                      value={transaction.amount}
                      onChange={handleAmountChange}
                      precision={2}
                    >
                      <NumberInputField
                        name="amount"
                        placeholder="0.00"
                        bg="gray.700"
                        border="none"
                        color="white"
                      />
                    </NumberInput>
                    {errors.amount && (
                      <FormErrorMessage>{errors.amount}</FormErrorMessage>
                    )}
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.category}>
                    <FormLabel color="gray.300">Category</FormLabel>
                    <Select
                      name="category"
                      value={transaction.category}
                      onChange={handleChange}
                      placeholder="Select category"
                      bg="gray.700"
                      border="none"
                      color="white"
                    >
                      {incomeCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                    {errors.category && (
                      <FormErrorMessage>{errors.category}</FormErrorMessage>
                    )}
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="gray.300">Date</FormLabel>
                    <Input
                      type="date"
                      name="date"
                      value={transaction.date}
                      onChange={handleChange}
                      bg="gray.700"
                      border="none"
                      color="white"
                    />
                  </FormControl>
                  
                  <Button
                    type="submit"
                    colorScheme="windsurf"
                    size="lg"
                    mt={6}
                    w="full"
                  >
                    Add Income
                  </Button>
                </Stack>
              </form>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
