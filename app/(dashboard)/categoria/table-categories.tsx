"use client";
import EmptyCard from "@/components/empty-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UseStyles from "@/hooks/use-styles";
import { RiArrowRightSFill, RiMoreLine } from "@remixicon/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import DeleteCategory from "./modal/delete-category";
import UpdateCategory from "./modal/update-category";

export default function TableCategories({ categorias }) {
  const { getBadgeStyle } = UseStyles();
  const [activeTab, setActiveTab] = useState("receita");

  const filteredCategorias = useMemo(() => {
    if (!categorias) return [];
    return categorias.filter(
      (categoria) => categoria.tipo_categoria.toLowerCase() === activeTab,
    );
  }, [categorias, activeTab]);

  return (
    <>
      <Tabs
        defaultValue="receita"
        onValueChange={setActiveTab}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="receita">Receitas</TabsTrigger>
          <TabsTrigger value="despesa">Despesas</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
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
              {filteredCategorias?.length > 0 ? (
                filteredCategorias.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold capitalize">
                      <Link
                        href={`/categorias/${encodeURIComponent(item.id)}/${encodeURIComponent(
                          item.nome,
                        )}/${encodeURIComponent(item.tipo_categoria)}`}
                        className="ml-2 flex items-center gap-1 text-sm hover:underline"
                      >
                        {item.nome}
                        <RiArrowRightSFill className="h-3 w-3" />
                      </Link>
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
                            <RiMoreLine size={16} />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <UpdateCategory
                              itemId={item.id}
                              itemNome={item.nome}
                              itemTipoCategoria={item.tipo_categoria}
                              itemUsadoParaCalculos={item.usado_para_calculos}
                            />
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
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
                  <TableCell colSpan={3} className="text-center">
                    <EmptyCard
                      message={`Nenhuma categoria de ${activeTab === "receita" ? "receita" : "despesa"} encontrada.`}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
