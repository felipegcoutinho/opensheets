"use client";

import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { RiMoreLine } from "@remixicon/react";
import { categoryIconsMap } from "@/hooks/use-category-icons";

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
                  <TableCell className="capitalize">
                    <span className="flex items-center gap-2">
                      {(() => {
                        const Icon = categoryIconsMap[item.categorias?.icone];
                        return Icon ? <Icon className="h-4 w-4" /> : null;
                      })()}
                      {item.categorias?.nome}
                    </span>
                  </TableCell>
                  <TableCell>
                    <MoneyValues value={item.valor_orcado} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
                        >
                          <RiMoreLine size={16} />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <UpdateBudget item={item} categorias={categorias} />
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <DeleteBudget itemId={item.id} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
