import { isUuid } from 'uuidv4';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Erro {
  error: string;
}

interface TransactionCreate {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions
      .filter(todos => {
        return todos.type === 'income';
      })
      .reduce((total, atual) => {
        return total + atual.value;
      }, 0);

    const outcome = this.transactions
      .filter(todos => {
        return todos.type === 'outcome';
      })
      .reduce((total, atual) => {
        return total + atual.value;
      }, 0);

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

  public create({ title, value, type }: TransactionCreate): Transaction {
    const transaction = new Transaction({ title, value, type });
    const income = this.transactions
      .filter(todos => {
        return todos.type === 'income';
      })
      .reduce((total, atual) => {
        return total + atual.value;
      }, 0);
    const outcome = this.transactions
      .filter(todos => {
        return todos.type === 'outcome';
      })
      .reduce((total, atual) => {
        return total + atual.value;
      }, 0);
    if (type === 'outcome' && income - outcome < value) {
      throw Error('You dont have money!');
    } else if (isUuid(transaction.id)) {
      this.transactions.push(transaction);
    }

    return transaction;
  }
}

export default TransactionsRepository;
