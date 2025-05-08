'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
} from '@chakra-ui/react';
import { useExpenses } from '../context/ExpenseContext';
import { Transaction } from '../types';

interface ExpenseFormProps {
  initialTransaction?: Transaction;
  onSubmit: (transaction: Transaction) => void;
  type?: 'expense' | 'income';
}

export default function ExpenseForm({ initialTransaction, onSubmit, type = 'expense' }: ExpenseFormProps) {
  const { categories } = useExpenses();
  
  // Filter categories based on transaction type
  const filteredCategories = categories.filter(
    cat => cat.type === type || cat.type === 'both'
  );
  
  const [transaction, setTransaction] = useState<Omit<Transaction, 'id'> & { id?: string }>({
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: type
  });
  
  const [errors, setErrors] = useState({
    description: '',
    amount: '',
    category: ''
  });

  useEffect(() => {
    if (initialTransaction) {
      setTransaction(initialTransaction);
    }
  }, [initialTransaction]);

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
      id: transaction.id || crypto.randomUUID(),
      description: transaction.description,
      amount: Number(transaction.amount),
      category: transaction.category,
      date: transaction.date,
      type: type
    };
    
    onSubmit(newTransaction);
    
    // Reset form if not editing
    if (!initialTransaction) {
      setTransaction({
        description: '',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        type: type
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (valueAsString: string) => {
    setTransaction(prev => ({ ...prev, amount: parseFloat(valueAsString) || 0 }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isInvalid={!!errors.description}>
          <FormLabel color="gray.300">Description</FormLabel>
          <Input
            name="description"
            value={transaction.description}
            onChange={handleChange}
            placeholder={`${type === 'expense' ? 'Expense' : 'Income'} description`}
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
            {filteredCategories.map(category => (
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
          {initialTransaction 
            ? `Update ${type === 'expense' ? 'Expense' : 'Income'}` 
            : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
        </Button>
      </Stack>
    </form>
  );
}
