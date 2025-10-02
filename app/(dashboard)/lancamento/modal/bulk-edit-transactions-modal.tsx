"use client";

import type { BudgetRuleConfig } from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UseDates } from "@/hooks/use-dates";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { BulkEditFormContainer } from "./bulk-edit/bulk-edit-form-container";

type CategoryOption = {
  id: number | string;
  nome: string;
  tipo_categoria: string;
  icone?: string | null;
};

type TransactionSummary = {
  id: string | number;
  tipo_transacao?: string | null;
};

type PayerOption = {
  id: string;
  nome: string;
  role?: string | null;
};

interface BulkEditTransactionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTransactions: TransactionSummary[];
  categories: CategoryOption[];
  budgetRule: BudgetRuleConfig;
  onComplete: (action: "update" | "delete") => void;
}

export function BulkEditTransactionsModal({
  open,
  onOpenChange,
  selectedTransactions,
  categories,
  budgetRule,
  onComplete,
}: BulkEditTransactionsModalProps) {
  return (
    <BulkEditFormContainer
      open={open}
      onOpenChange={onOpenChange}
      selectedTransactions={selectedTransactions}
      categories={categories}
      budgetRule={budgetRule}
      onComplete={onComplete}
    />
  );
}