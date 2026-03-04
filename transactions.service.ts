/**
 * Transactions Service
 * Handles API calls for creating, confirming, and rejecting transactions
 */

interface CreateTransactionData {
  sessionId: string;
  userId: string;
  amount: number;
  paymentMethod: 'CashApp' | 'Venmo' | 'Chime';
  paymentUsername: string;
}

interface ConfirmTransactionData {
  transactionId: string;
  adminId: string;
}

interface RejectTransactionData {
  transactionId: string;
  adminId: string;
  rejectionReason: string;
}

interface TransactionResponse {
  id: string;
  sessionId: string;
  userId: string;
  amount: number;
  status: 'Pending Admin Confirmation' | 'Active' | 'Rejected' | 'Refunded';
  paymentMethod: string;
  paymentUsername: string;
  confirmedBy?: string;
  confirmationTimestamp?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create a new transaction (when user clicks "Stake")
 */
export async function createTransaction(
  data: CreateTransactionData
): Promise<TransactionResponse> {
  try {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        status: 'Pending Admin Confirmation',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create transaction: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

/**
 * Confirm a pending transaction (admin action)
 * This will:
 * 1. Update transaction status to 'Active'
 * 2. Update session status to 'Active' if applicable
 * 3. Record admin confirmation timestamp
 */
export async function confirmTransaction(
  data: ConfirmTransactionData
): Promise<TransactionResponse> {
  try {
    const response = await fetch(
      `/api/transactions/${data.transactionId}/confirm`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: data.adminId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to confirm transaction: ${response.statusText}`);
    }

    const updatedTransaction: TransactionResponse = await response.json();

    // After confirmation, the session status should be updated to 'Active'
    // This is handled server-side in the API

    return updatedTransaction;
  } catch (error) {
    console.error('Error confirming transaction:', error);
    throw error;
  }
}

/**
 * Reject a pending transaction (admin action)
 * This will:
 * 1. Update transaction status to 'Rejected'
 * 2. Record rejection reason
 * 3. Record admin who rejected it
 */
export async function rejectTransaction(
  data: RejectTransactionData
): Promise<TransactionResponse> {
  try {
    const response = await fetch(
      `/api/transactions/${data.transactionId}/reject`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: data.adminId,
          rejectionReason: data.rejectionReason,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to reject transaction: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error rejecting transaction:', error);
    throw error;
  }
}

/**
 * Get all pending transactions for a session
 */
export async function getPendingTransactions(
  sessionId: string
): Promise<TransactionResponse[]> {
  try {
    const response = await fetch(
      `/api/transactions?sessionId=${sessionId}&status=Pending Admin Confirmation`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pending transactions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    throw error;
  }
}

/**
 * Get all pending transactions for admin dashboard
 */
export async function getAllPendingTransactions(): Promise<
  TransactionResponse[]
> {
  try {
    const response = await fetch('/api/transactions?status=Pending Admin Confirmation');

    if (!response.ok) {
      throw new Error('Failed to fetch pending transactions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    throw error;
  }
}

/**
 * Get transaction details
 */
export async function getTransaction(
  transactionId: string
): Promise<TransactionResponse> {
  try {
    const response = await fetch(`/api/transactions/${transactionId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch transaction');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
}
