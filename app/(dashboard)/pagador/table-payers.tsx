"use client";
import EmptyCard from "@/components/empty-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UpdatePayer from "./modal/update-payer";
import DeletePayer from "./modal/delete-payer";
import Link from "next/link";
import { UseDates } from "@/hooks/use-dates";

export default function TablePayers({ pagadores }) {
  const { formatted_current_month } = UseDates();
  const month = formatted_current_month;
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagadores && pagadores.length > 0 ? (
              pagadores.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="capitalize">{item.nome}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Link
                      href={`/pagador/${item.id}?periodo=${month}`}
                      className="inline-flex rounded-md bg-secondary px-3 py-1 text-xs font-medium hover:brightness-95"
                    >
                      Detalhes
                    </Link>
                    <UpdatePayer item={item} />
                    <DeletePayer itemId={item.id} itemNome={item.nome} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
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
