"use client";
import EmptyCard from "@/components/empty-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Ellipsis } from "lucide-react";
import DeleteCategory from "./modal/delete-category";
import UpdateCategory from "./modal/update-category";
import UseStyles from "@/hooks/use-styles";

export default function TableCategories({ categorias }) {
  const { getBadgeStyle } = UseStyles();

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Categorias</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo da Categoria</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias?.length !== 0 ? (
              categorias?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold capitalize">
                    {item.nome}

                    {/* <Image
                      src={item.icone}
                      alt={item.nome}
                      width={20}
                      height={20}
                      className="ml-2 inline-block"
                    /> */}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeStyle(item.tipo_categoria)}>
                      {item.tipo_categoria}
                    </Badge>
                  </TableCell>

                  <TableCell className="flex gap-2">
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
                          <UpdateCategory
                            itemId={item.id}
                            itemNome={item.nome}
                            itemTipoCategoria={item.tipo_categoria}
                            itemUsadoParaCalculos={item.usado_para_calculos}
                          />
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <DeleteCategory
                            itemId={item.id}
                            itemNome={item.nome}
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
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
