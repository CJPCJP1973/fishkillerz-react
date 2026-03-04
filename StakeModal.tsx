'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { DollarSign, AlertCircle } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createTransaction } from '@/services/transactions.service';

interface StakeModalProps {
  sessionId: string;
  totalBuyIn: number;
  onStakeSuccess?: () => void;
}

const PAYMENT_METHODS = ['CashApp', 'Venmo', 'Chime'] as const;
type PaymentMethod = (typeof PAYMENT_METHODS)[number];

interface StakeFormData {
  amount: number;
  paymentMethod: PaymentMethod;
  paymentUsername: string;
}

export function StakeModal({ sessionId, totalBuyIn, onStakeSuccess }: StakeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<StakeFormData>({
    defaultValues: {
      amount: 0,
      paymentMethod: 'CashApp',
      paymentUsername: '',
    },
  });

  const maxStakeAmount = totalBuyIn * 0.75;

  const onSubmit = async (data: StakeFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      // Validate amount
      if (data.amount <= 0) {
        setError('Stake amount must be greater than 0');
        return;
      }

      if (data.amount > maxStakeAmount) {
        setError(`Stake cannot exceed 75% of total buy-in ($${maxStakeAmount.toFixed(2)})`);
        return;
      }

      // Validate payment username
      if (!data.paymentUsername.trim()) {
        setError(`Please enter your ${data.paymentMethod} username`);
        return;
      }

      // Get current user ID from auth store
      // TODO: Import and use useAuthStore
      // const { user } = useAuthStore();
      const userId = ''; // TODO: Replace with actual user ID from auth store

      if (!userId) {
        setError('Unable to create stake: user not authenticated');
        return;
      }

      // Call API to create transaction
      const transaction = await createTransaction({
        sessionId,
        userId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentUsername: data.paymentUsername,
      });

      // Show success message
      toast.success(
        `Stake created successfully! Waiting for admin confirmation.`,
        {
          description: `Amount: $${data.amount.toFixed(2)} • Status: Pending Admin Confirmation`,
        }
      );

      // Close and reset
      setIsOpen(false);
      form.reset();
      onStakeSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create stake';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="btn-primary">
          <DollarSign className="w-4 h-4 mr-2" />
          Stake Funds
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Stake Your Funds</DrawerTitle>
          <DrawerDescription>
            Enter the amount you want to stake (up to 75% of your buy-in)
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4 max-w-md mx-auto w-full">
          {/* Buy-in Info */}
          <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#333333]">
            <p className="text-[#b3b3b3] text-sm mb-1">Total Buy-in</p>
            <p className="text-white text-lg font-bold mb-2">
              ${totalBuyIn.toFixed(2)}
            </p>
            <p className="text-[#666666] text-xs">
              Maximum stake: ${maxStakeAmount.toFixed(2)} (75%)
            </p>
            <p className="text-[#666666] text-xs mt-1">
              Locked as shooter's stake: ${(totalBuyIn * 0.25).toFixed(2)} (25%)
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Stake Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Stake Amount</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          min="0"
                          max={maxStakeAmount}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          value={field.value || ''}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-[#666666]">
                      You can stake up to ${maxStakeAmount.toFixed(2)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Payment Method</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full h-9 px-3 rounded-md border border-[#333333] bg-transparent text-white placeholder-[#666666] focus:border-[#00ff88] focus:ring-[#00ff88]/50 focus:ring-[3px] outline-none"
                      >
                        {PAYMENT_METHODS.map((method) => (
                          <option key={method} value={method} className="bg-[#0d0d0d]">
                            {method}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Username */}
              <FormField
                control={form.control}
                name="paymentUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      {form.watch('paymentMethod')} Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter your ${form.watch('paymentMethod')} username`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-[#666666]">
                      We'll use this to verify and transfer your funds
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DrawerFooter className="border-t border-[#333333]">
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Creating Stake...' : 'Confirm Stake'}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="btn-secondary">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
