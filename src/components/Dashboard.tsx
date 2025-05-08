'use client';

import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Badge,
} from '@chakra-ui/react';
import { useExpenses } from '../context/ExpenseContext';

export default function Dashboard() {
  const { expenses, incomes, transactions, categories, getFinancialStats } = useExpenses();
  const stats = getFinancialStats();

  // Get category name by id
  function getCategoryName(categoryId: string) {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  }
  
  // Get category color by id
  function getCategoryColor(categoryId: string) {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'gray.500';
  }
  
  // Get category type by id
  function getCategoryType(categoryId: string) {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.type : 'expense';
  }
  
  // Format amount
  function formatAmount(amount: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  }
  
  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Format date
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }
  
  // Calculate category data for visualization
  const categoryData = Object.entries(stats.byCategory)
    .filter(([, amount]) => amount !== 0)
    .map(([categoryId, amount]) => ({
      id: categoryId,
      name: getCategoryName(categoryId),
      amount,
      color: getCategoryColor(categoryId),
      type: getCategoryType(categoryId),
    }));
  
  // Separate expense and income categories
  const expenseCategories = categoryData
    .filter(category => category.type === 'expense')
    .map(category => ({
      ...category,
      percentage: (category.amount / stats.totalExpense) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);
  
  const incomeCategories = categoryData
    .filter(category => category.type === 'income')
    .map(category => ({
      ...category,
      percentage: (category.amount / stats.totalIncome) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
      {/* Financial Summary Cards */}
      <GridItem colSpan={{ base: 1, md: 3 }}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
          {/* Balance Card */}
          <Box bg="gray.800" borderRadius="lg" boxShadow="lg" overflow="hidden" borderTop="4px solid" borderTopColor="windsurf.500" p={6}>
            <Box>
              <Text fontSize="md" color="gray.400">Current Balance</Text>
              <Text fontSize="2xl" fontWeight="bold" color={stats.balance >= 0 ? 'green.400' : 'red.400'}>
                {formatAmount(stats.balance)}
              </Text>
              <Text fontSize="sm" color="gray.400" mt={1}>
                {stats.balance >= 0 ? '↑' : '↓'} {Math.abs(stats.balance).toFixed(2)} {stats.balance >= 0 ? 'positive' : 'negative'}
              </Text>
            </Box>
          </Box>

          {/* Income Card */}
          <Box bg="gray.800" borderRadius="lg" boxShadow="lg" overflow="hidden" borderTop="4px solid" borderTopColor="green.500" p={6}>
            <Box>
              <Text fontSize="md" color="gray.400">Total Income</Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.400">
                {formatAmount(stats.totalIncome)}
              </Text>
              <Text fontSize="sm" color="gray.400" mt={1}>
                {incomes.length} income transaction{incomes.length !== 1 ? 's' : ''}
              </Text>
            </Box>
          </Box>

          {/* Expense Card */}
          <Box bg="gray.800" borderRadius="lg" boxShadow="lg" overflow="hidden" borderTop="4px solid" borderTopColor="red.500" p={6}>
            <Box>
              <Text fontSize="md" color="gray.400">Total Expenses</Text>
              <Text fontSize="2xl" fontWeight="bold" color="red.400">
                {formatAmount(stats.totalExpense)}
              </Text>
              <Text fontSize="sm" color="gray.400" mt={1}>
                {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
              </Text>
            </Box>
          </Box>
        </Flex>
      </GridItem>

      {/* Expense Breakdown */}
      <GridItem colSpan={{ base: 1, md: 1, lg: 1 }}>
        <Box bg="gray.800" borderRadius="lg" boxShadow="lg" h="100%" p={6}>
          <Heading size="md" color="white" mb={4}>Expense Breakdown</Heading>
          {expenseCategories.length === 0 ? (
            <Text color="gray.400">No expenses recorded yet</Text>
          ) : (
            <Flex direction="column" gap={3}>
              {expenseCategories.map(category => (
                <Box key={category.id}>
                  <Flex justify="space-between" align="center" mb={1}>
                    <Flex align="center">
                      <Box w="3" h="3" borderRadius="full" bg={category.color} mr={2} />
                      <Text fontSize="sm" fontWeight="medium" color="gray.300">
                        {category.name}
                      </Text>
                    </Flex>
                    <Text fontSize="sm" color="gray.400">
                      {formatAmount(category.amount)} ({category.percentage.toFixed(1)}%)
                    </Text>
                  </Flex>
                  <Box 
                    w="full" 
                    h="2px" 
                    bg="gray.700" 
                    borderRadius="full" 
                    position="relative"
                    mt={1}
                  >
                    <Box 
                      position="absolute"
                      left={0}
                      top={0}
                      h="100%"
                      bg="red.500"
                      borderRadius="full"
                      width={`${category.percentage}%`}
                    />
                  </Box>
                </Box>
              ))}
            </Flex>
          )}
        </Box>
      </GridItem>

      {/* Income Breakdown */}
      <GridItem colSpan={{ base: 1, md: 1, lg: 1 }}>
        <Box bg="gray.800" borderRadius="lg" boxShadow="lg" h="100%" p={6}>
          <Heading size="md" color="white" mb={4}>Income Breakdown</Heading>
          {incomeCategories.length === 0 ? (
            <Text color="gray.400">No income recorded yet</Text>
          ) : (
            <Flex direction="column" gap={3}>
              {incomeCategories.map(category => (
                <Box key={category.id}>
                  <Flex justify="space-between" align="center" mb={1}>
                    <Flex align="center">
                      <Box w="3" h="3" borderRadius="full" bg={category.color} mr={2} />
                      <Text fontSize="sm" fontWeight="medium" color="gray.300">
                        {category.name}
                      </Text>
                    </Flex>
                    <Text fontSize="sm" color="gray.400">
                      {formatAmount(category.amount)} ({category.percentage.toFixed(1)}%)
                    </Text>
                  </Flex>
                  <Box 
                    w="full" 
                    h="2px" 
                    bg="gray.700" 
                    borderRadius="full" 
                    position="relative"
                    mt={1}
                  >
                    <Box 
                      position="absolute"
                      left={0}
                      top={0}
                      h="100%"
                      bg="green.500"
                      borderRadius="full"
                      width={`${category.percentage}%`}
                    />
                  </Box>
                </Box>
              ))}
            </Flex>
          )}
        </Box>
      </GridItem>

      {/* Recent Transactions */}
      <GridItem colSpan={{ base: 1, md: 2, lg: 1 }}>
        <Box bg="gray.800" borderRadius="lg" boxShadow="lg" h="100%" p={6}>
          <Heading size="md" color="white" mb={4}>Recent Transactions</Heading>
          {recentTransactions.length === 0 ? (
            <Text color="gray.400">No transactions recorded yet</Text>
          ) : (
            <Flex direction="column" gap={3}>
              {recentTransactions.map(transaction => (
                <Box key={transaction.id} p={3} bg="gray.700" borderRadius="md">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="medium" color="white">{transaction.description}</Text>
                      <Flex align="center" mt={1}>
                        <Badge 
                          colorScheme={transaction.type === 'expense' ? 'red' : 'green'}
                          mr={2}
                        >
                          {getCategoryName(transaction.category)}
                        </Badge>
                        <Text fontSize="xs" color="gray.400">
                          {formatDate(transaction.date)}
                        </Text>
                      </Flex>
                    </Box>
                    <Text 
                      fontWeight="semibold" 
                      color={transaction.type === 'expense' ? 'red.300' : 'green.300'}
                    >
                      {transaction.type === 'expense' ? '-' : '+'}{formatAmount(transaction.amount)}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </Flex>
          )}
        </Box>
      </GridItem>
    </Grid>
  );
}
