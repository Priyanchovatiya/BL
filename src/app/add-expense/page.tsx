'use client';

import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Card,
  CardHeader,
  CardBody,
  VStack,
} from '@chakra-ui/react';
import Header from '../../components/Header';
import ExpenseForm from '../../components/ExpenseForm';
import { useExpenses } from '../../context/ExpenseContext';
import { Transaction } from '../../types';

export default function AddExpensePage() {
  const router = useRouter();
  const { addTransaction } = useExpenses();

  const handleAddTransaction = (transaction: Transaction) => {
    addTransaction(transaction);
    router.push('/expenses');
  };

  return (
    <Box minH="100vh" bg="gray.900">
      <Header />
      <Container maxW="container.md" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" color="white">
            Add New Expense
          </Heading>
          
          <Card bg="gray.800" borderRadius="lg" boxShadow="lg">
            <CardHeader pb={0}>
              <Heading size="md" color="white">Expense Details</Heading>
            </CardHeader>
            <CardBody>
              <ExpenseForm onSubmit={handleAddTransaction} type="expense" />
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
