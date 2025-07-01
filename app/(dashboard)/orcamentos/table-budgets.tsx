"use client";

import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteBudget from "./modal/delete-budget";
import UpdateBudget from "./modal/update-budget";

export default function TableBudgets({ budgets, categorias }) {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoria</TableHead>
              <TableHead>Valor Limite</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets && budgets.length ? (
              budgets.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.categorias?.nome}</TableCell>
                  <TableCell>
                    <MoneyValues value={item.valor_orcado} />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <UpdateBudget item={item} categorias={categorias} />
                    <DeleteBudget itemId={item.id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <EmptyCard />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
