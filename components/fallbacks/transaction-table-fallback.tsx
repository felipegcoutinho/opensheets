"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CircleSkeleton, TextSkeleton, ChipSkeleton, ButtonSkeleton } from "@/components/ui/micro-skeletons";

export default function TransactionTableFallback({ rows = 8 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <TextSkeleton className="w-32" />
          <div className="flex items-center gap-2">
            <TextSkeleton className="w-16" />
            <TextSkeleton className="w-16" />
            <TextSkeleton className="w-16" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <Table>
          <TableHeader>
            <TableRow>
              {["sel","data","estab","txn","valor","cond","forma","pagador","cat","conta","acoes"].map((k, i) => (
                <TableHead key={i}>
                  <TextSkeleton className={
                    i === 0 ? "w-4" :
                    i === 1 ? "w-12" :
                    i === 2 ? "w-32" :
                    i === 3 ? "w-16" :
                    i === 4 ? "w-14" :
                    i === 5 ? "w-20" :
                    i === 6 ? "w-28" :
                    i === 7 ? "w-28" :
                    i === 8 ? "w-24" :
                    i === 9 ? "w-28" :
                    "w-16"
                  } />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, r) => (
              <TableRow key={r}>
                {/* seleção */}
                <TableCell>
                  <div className="h-4 w-4 rounded border" aria-hidden />
                </TableCell>
                {/* data */}
                <TableCell>
                  <TextSkeleton className="w-16" />
                </TableCell>
                {/* estabelecimento */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TextSkeleton className="w-40" />
                    <ChipSkeleton className="w-16" />
                  </div>
                </TableCell>
                {/* transação */}
                <TableCell>
                  <ChipSkeleton className="w-16" />
                </TableCell>
                {/* valor */}
                <TableCell>
                  <TextSkeleton style={{ width: "var(--sk-number)" }} />
                </TableCell>
                {/* condição */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-muted-foreground/20" />
                    <TextSkeleton className="w-16" />
                  </div>
                </TableCell>
                {/* forma pagamento */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-muted-foreground/20" />
                    <TextSkeleton className="w-20" />
                  </div>
                </TableCell>
                {/* pagador */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CircleSkeleton size={24} />
                    <ChipSkeleton style={{ width: "var(--sk-chip)" }} />
                  </div>
                </TableCell>
                {/* categoria */}
                <TableCell>
                  <TextSkeleton className="w-24" />
                </TableCell>
                {/* conta/cartão */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-muted-foreground/20" />
                    <div className="h-4 w-4 rounded bg-muted-foreground/20" />
                  </div>
                </TableCell>
                {/* ações */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ButtonSkeleton className="h-7 w-7" />
                    <div className="h-4 w-4 rounded bg-muted-foreground/20" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
