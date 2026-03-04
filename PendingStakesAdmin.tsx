'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Eye,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';

interface PendingStake {
  id: string;
  sessionId: string;
  userName: string;
  userAvatar?: string;
  amount: number;
  totalBuyIn: number;
  paymentMethod: string;
  paymentUsername: string;
  createdAt: string;
  status: 'Pending Admin Confirmation';
}

interface PendingStakesAdminProps {
  stakes?: PendingStake[];
  onConfirm?: (stakeId: string) => Promise<void>;
  onReject?: (stakeId: string, reason: string) => Promise<void>;
}

// Mock data for demonstration
const mockPendingStakes: PendingStake[] = [
  {
    id: 'tx-001',
    sessionId: 'session-1',
    userName: 'PlayerOne',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    amount: 750,
    totalBuyIn: 1000,
    paymentMethod: 'CashApp',
    paymentUsername: 'PlayerOne123',
    createdAt: '2024-01-20T10:30:00Z',
    status: 'Pending Admin Confirmation',
  },
  {
    id: 'tx-002',
    sessionId: 'session-2',
    userName: 'HighRoller',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    amount: 1500,
    totalBuyIn: 2000,
    paymentMethod: 'Venmo',
    paymentUsername: 'HighRoller99',
    createdAt: '2024-01-20T09:15:00Z',
    status: 'Pending Admin Confirmation',
  },
  {
    id: 'tx-003',
    sessionId: 'session-3',
    userName: 'CasualPlayer',
    userAvatar: 'https://images.unsplash.com/photo-1517849645569-bc2bc6ca0681?w=100&h=100&fit=crop',
    amount: 300,
    totalBuyIn: 500,
    paymentMethod: 'Chime',
    paymentUsername: 'CasualPlayer88',
    createdAt: '2024-01-20T08:00:00Z',
    status: 'Pending Admin Confirmation',
  },
];

function StakeDetailsDrawer({ stake }: { stake: PendingStake }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      // TODO: Call API to confirm transaction
      // await confirmTransaction(stake.id);
      console.log('Confirming stake:', stake.id);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setIsRejecting(true);
    try {
      // TODO: Call API to reject transaction
      // await rejectTransaction(stake.id, rejectionReason);
      console.log('Rejecting stake:', stake.id, 'Reason:', rejectionReason);
    } finally {
      setIsRejecting(false);
    }
  };

  const maxStake = stake.totalBuyIn * 0.75;
  const lockedStake = stake.totalBuyIn * 0.25;
  const percentageOfMax = (stake.amount / maxStake) * 100;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="sm" variant="ghost" className="text-[#00ff88] hover:bg-[#00ff88]/10">
          <Eye className="w-4 h-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Stake Details</DrawerTitle>
          <DrawerDescription>
            Review and confirm or reject this pending stake
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4 max-w-md mx-auto w-full space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg">
            {stake.userAvatar && (
              <img
                src={stake.userAvatar}
                alt={stake.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-white font-medium">{stake.userName}</p>
              <p className="text-[#b3b3b3] text-sm">Session ID: {stake.sessionId}</p>
            </div>
          </div>

          {/* Stake Details */}
          <div className="space-y-3">
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <p className="text-[#b3b3b3] text-sm mb-1">Stake Amount</p>
              <p className="text-white text-2xl font-bold">
                ${stake.amount.toFixed(2)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <p className="text-[#b3b3b3] text-sm mb-1">Total Buy-in</p>
                <p className="text-white font-bold">${stake.totalBuyIn.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <p className="text-[#b3b3b3] text-sm mb-1">Max Allowed</p>
                <p className="text-white font-bold">${maxStake.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <p className="text-[#b3b3b3] text-sm mb-2">Stake Percentage</p>
              <div className="w-full bg-[#0d0d0d] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#00ff88] h-full transition-all"
                  style={{ width: `${Math.min(percentageOfMax, 100)}%` }}
                />
              </div>
              <p className="text-[#b3b3b3] text-xs mt-2">
                {percentageOfMax.toFixed(1)}% of max stake
              </p>
            </div>

            <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333333]">
              <p className="text-[#b3b3b3] text-sm mb-1">Locked (Shooter's Personal Stake)</p>
              <p className="text-white font-bold">${lockedStake.toFixed(2)}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-2 p-4 bg-[#1a1a1a] rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-[#b3b3b3] text-sm">Payment Method</p>
              <Badge className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/50">
                {stake.paymentMethod}
              </Badge>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#333333]">
              <p className="text-[#b3b3b3] text-sm">Username</p>
              <p className="text-white text-sm font-medium">{stake.paymentUsername}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#333333]">
              <p className="text-[#b3b3b3] text-sm">Created</p>
              <p className="text-white text-sm">
                {new Date(stake.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Rejection Reason */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Rejection Reason (if rejecting)
            </label>
            <Input
              placeholder="Explain why this stake is being rejected..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Warning */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-400 text-sm">
              Confirming this stake will mark the transaction as "Active" and the funds will be credited to the session.
            </p>
          </div>
        </div>

        <DrawerFooter className="border-t border-[#333333]">
          <Button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="btn-primary"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {isConfirming ? 'Confirming...' : 'Confirm Stake'}
          </Button>
          <Button
            onClick={handleReject}
            disabled={isRejecting || !rejectionReason.trim()}
            variant="destructive"
            className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
          >
            <XCircle className="w-4 h-4 mr-2" />
            {isRejecting ? 'Rejecting...' : 'Reject Stake'}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="btn-secondary">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function PendingStakesAdmin({
  stakes = mockPendingStakes,
  onConfirm,
  onReject,
}: PendingStakesAdminProps) {
  if (stakes.length === 0) {
    return (
      <div className="card-dark p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
          <DollarSign className="w-10 h-10 text-[#333333]" />
        </div>
        <h3 className="text-xl font-bold text-white font-['Montserrat'] mb-2">
          No pending stakes
        </h3>
        <p className="text-[#b3b3b3]">
          All pending stakes have been reviewed. Check back later for new stakes to confirm.
        </p>
      </div>
    );
  }

  return (
    <div className="card-dark overflow-hidden">
      <div className="p-6 border-b border-[#333333]">
        <h3 className="text-xl font-bold text-white font-['Montserrat'] flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          Pending Stakes ({stakes.length})
        </h3>
        <p className="text-[#b3b3b3] text-sm mt-1">
          Review and confirm or reject pending stake transactions
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-[#333333] hover:bg-transparent">
            <TableHead className="text-[#b3b3b3]">Player</TableHead>
            <TableHead className="text-[#b3b3b3]">Stake Amount</TableHead>
            <TableHead className="text-[#b3b3b3]">Buy-in</TableHead>
            <TableHead className="text-[#b3b3b3]">Payment Method</TableHead>
            <TableHead className="text-[#b3b3b3]">Created</TableHead>
            <TableHead className="text-[#b3b3b3]">Status</TableHead>
            <TableHead className="text-[#b3b3b3] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stakes.map((stake) => (
            <TableRow key={stake.id} className="border-[#333333] hover:bg-[#1a1a1a]">
              <TableCell>
                <div className="flex items-center gap-3">
                  {stake.userAvatar && (
                    <img
                      src={stake.userAvatar}
                      alt={stake.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-white font-medium">{stake.userName}</p>
                    <p className="text-[#b3b3b3] text-xs">{stake.sessionId}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-white font-bold">
                ${stake.amount.toFixed(2)}
              </TableCell>
              <TableCell className="text-[#b3b3b3]">
                ${stake.totalBuyIn.toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/50">
                  {stake.paymentMethod}
                </Badge>
              </TableCell>
              <TableCell className="text-[#b3b3b3] text-sm">
                {new Date(stake.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                  {stake.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <StakeDetailsDrawer stake={stake} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
