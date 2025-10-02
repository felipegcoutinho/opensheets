import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { BudgetRuleBucket } from "@/app/(dashboard)/orcamento/rule/budget-rule";

const fetchJSON = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao carregar dados");
  return res.json();
};

export type PayerOption = {
  nome: string;
  role?: string | null;
  foto?: string | null;
};

type UseCreateTransactionLookupsParams = {
  month: string;
  enabled: boolean;
  tipoTransacao: string;
};

const normalize = (value: string) =>
  value
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

export function useCreateTransactionLookups({
  month,
  enabled,
  tipoTransacao,
}: UseCreateTransactionLookupsParams) {
  const {
    data: descData,
    error: descError,
    isLoading: isLoadingDesc,
  } = useQuery({
    queryKey: ["descriptions", month],
    queryFn: () => fetchJSON(`/api/descriptions?month=${month}`),
    staleTime: 1000 * 60,
    enabled,
  });

  const {
    data: payersData,
    error: payersError,
    isLoading: isLoadingPayers,
  } = useQuery({
    queryKey: ["payers"],
    queryFn: () => fetchJSON(`/api/pagadores`),
    staleTime: 1000 * 60,
    enabled,
  });

  const descricaoOptions: string[] = descData?.data || [];
  const pagadoresOptions: PayerOption[] = payersData?.data || [];

  const [selectedPayer, setSelectedPayer] = useState<string | undefined>();
  const [categoriaId, setCategoriaId] = useState<string | undefined>();
  const [ruleBucket, setRuleBucket] = useState<BudgetRuleBucket | undefined>();

  useEffect(() => {
    if (!selectedPayer && pagadoresOptions.length > 0) {
      const principal = pagadoresOptions.find((payer) =>
        normalize(payer.role || "").includes("principal"),
      );
      setSelectedPayer(principal?.nome || pagadoresOptions[0]?.nome);
    }
  }, [pagadoresOptions, selectedPayer]);

  const selectedPayerInfo = useMemo(
    () => pagadoresOptions.find((payer) => payer.nome === selectedPayer),
    [pagadoresOptions, selectedPayer],
  );

  const isSelectedPayerPrincipal = useMemo(
    () => normalize(selectedPayerInfo?.role || "").includes("principal"),
    [selectedPayerInfo],
  );

  useEffect(() => {
    if (tipoTransacao !== "despesa" && ruleBucket) {
      setRuleBucket(undefined);
    }
  }, [ruleBucket, tipoTransacao]);

  useEffect(() => {
    if (!isSelectedPayerPrincipal && ruleBucket) {
      setRuleBucket(undefined);
    }
  }, [isSelectedPayerPrincipal, ruleBucket]);

  const secondPayers = useMemo(
    () =>
      pagadoresOptions.filter((payer) =>
        normalize(payer.role || "").includes("secundario"),
      ),
    [pagadoresOptions],
  );

  const resetSelections = useCallback(() => {
    setCategoriaId(undefined);
    setSelectedPayer(undefined);
    setRuleBucket(undefined);
  }, []);

  return {
    descricaoOptions,
    pagadoresOptions,
    secondPayers,
    selectedPayer,
    setSelectedPayer,
    categoriaId,
    setCategoriaId,
    ruleBucket,
    setRuleBucket,
    selectedPayerInfo,
    isSelectedPayerPrincipal,
    isLoadingDesc,
    isLoadingPayers,
    descError,
    payersError,
    resetSelections,
  } as const;
}
