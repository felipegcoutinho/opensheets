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

export default function TablePayers({ pagadores }) {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagadores && pagadores.length > 0 ? (
              pagadores.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="capitalize">{item.nome}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell className="flex gap-2">
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
