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

export default function ManagerCategoria({ categorias }) {
  return (
    <Card className="border-none">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo da Categoria</TableHead>
              <TableHead>Ícone</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias?.length !== 0 ? (
              categorias?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold">{item.nome}</TableCell>
                  <TableCell>{item.tipo_categoria}</TableCell>
                  <TableCell>{item.icone}</TableCell>
                  {/* <TableCell className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
                        >
                          <Ellipsis size={16} />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <UpdateBills
                            itemId={item.id}
                            itemDescricao={item.descricao}
                            itemPeriodo={item.periodo}
                            itemDtVencimento={item.dt_vencimento}
                            itemStatusPagamento={item.status_pagamento}
                            itemResponsavel={item.responsavel}
                            itemCategoria={item.categoria}
                            itemValor={item.valor}
                            itemDtPagamento={item.dt_pagamento}
                            itemAnotacao={item.anotacao}
                            itemCondicao={item.condicao}
                            itemQtdeRecorrencia={item.qtde_recorrencia}
                    }
                            itemContaId={item.contas?.id}
                          />
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <DeleteBills itemId={item.id} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  <EmptyCard width={100} height={100} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
