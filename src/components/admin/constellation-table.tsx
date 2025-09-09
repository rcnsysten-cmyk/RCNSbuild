"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const constellationData = [
    // Page 1
    { level: 25, left: "DEF +3%", right: "Redução de Espera 2%" },
    { level: 29, left: "Dano Crít. (+) +10%", right: "Aumento de DANO de Veneno 10%" },
    { level: 33, left: "ATQ +3%", right: "Redução de Espera 2%" },
    { level: 37, left: "DANO E. (+) +10%", right: "Aumento de DANO de Veneno 10%" },
    { level: 41, left: "DEF +3%", right: "Redução de Espera 2%" },
    { level: 45, left: "Velocidade de ATQ +7", right: "Aumento de DANO de Veneno 10%" },
    { level: 49, left: "Taxa de RES Crítica +5%", right: "Redução de Espera 2%" },
    { level: 53, left: "Dano Crít. (+) +10%", right: "Aumento de DANO de Veneno 10%" },
    { level: 57, left: "Taxa de RES E. +5%", right: "Redução de Espera 2%" },
    { level: 61, left: "DANO E. (+) +10%", right: "Aumento de DANO de Veneno 10%" },
    { level: 65, left: "Dano Crít. (-) +10%", right: "Redução de Espera 2%" },
    { level: 69, left: "Velocidade de ATQ +7", right: "Aumento de DANO de Veneno 10%" },
    { level: 73, left: "Dano Elemental (-) +10%", right: "Redução de Espera 2%" },
    { level: 77, left: "DEF Ignorada +5%", right: "Aumento de DANO de Veneno 10%" },
    { level: 81, left: "Taxa de RES Crítica +5%", right: "Redução de Espera 2%" },
    { level: 85, left: "Dano Crít. (+) +10%", right: "Aumento de DANO de Veneno 10%" },
    { level: 89, left: "Taxa de RES E. +5%", right: "Redução de Espera 2%" },
    // Page 2
    { level: 93, left: "Velocidade de ATQ +7", right: "Aumento de DANO de Veneno 10%" },
    { level: 97, left: "DANO E. (+) +10%", right: "Redução de Espera 2%" },
    { level: 101, left: "DEF Ignorada +5%", right: "Aumento de DANO de Veneno 10%" },
    { level: 105, left: "Dano Crít. (-) +10%", right: "Redução de Espera 2%" },
    { level: 109, left: "Dano Crít. (+) +10%", right: "Aumento de DANO de Veneno 10%" },
    { level: 113, left: "Velocidade de ATQ +7", right: "Redução de Espera 2%" },
    { level: 117, left: "Taxa de RES E. +5%", right: "Aumento de DANO de Veneno 10%" },
    { level: 121, left: "DANO E. (+) +10%", right: "Redução de Espera 2%" },
    { level: 125, left: "Taxa de RES Crítica +5%", right: "Aumento de DANO de Veneno 10%" },
    { level: 129, left: "Dano Elemental (-) +10%", right: "Redução de Espera 2%" },
    { level: 133, left: "DEF Ignorada +5%", right: "Aumento de DANO de Veneno 10%" },
    { level: 148, left: "DEF Ignorada +6%", right: "Aumentar DANO de Habilidade +15%" },
    { level: 163, left: "HP máximo +2%", right: "Aumento de DANO de Veneno 10%" },
    { level: 178, left: "ATQ +2%", right: "Redução de Espera 2%" },
    { level: 193, left: "Taxa de RES E. +5%", right: "Aumentar DANO de Habilidade +15%" },
    { level: 208, left: "DEF Ignorada +5%", right: "DANO Crítico (-) +5%" },
    { level: 223, left: "DEF Ignorada +5%", right: "Taxa de RES E. +5%" },
      // Page 3
    { level: 238, left: "ATQ +2%", right: "Redução de Espera 2%" },
    { level: 253, left: "HP máximo +2%", right: "Taxa de RES Crítica +5%" },
    { level: 268, left: "Dano Elemental (-) +5%", right: "DEF Ignorada +5%" },
    { level: 283, left: "Dano Elemental (-) +5%", right: "DEF Ignorada +5%" },
    { level: 298, left: "DEF +2%", right: "Taxa de RES Crítica +5%" },
    { level: 313, left: "DEF +2%", right: "Aumentar DANO de Habilidade +15%" },
];

const ITEMS_PER_PAGE = 17;

interface ConstellationTableProps {
  value: string[]; // Now expects values like "25-1", "29-2"
  onChange: (value: string[]) => void;
}

export function ConstellationTable({ value, onChange }: ConstellationTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(constellationData.length / ITEMS_PER_PAGE);

  const getSelectionForLevel = (level: number): "1" | "2" | null => {
    const found = value.find(v => v.startsWith(`${level}-`));
    if (!found) return null;
    return found.endsWith("-1") ? "1" : "2";
  }

  const handleSelect = (level: number, choice: "1" | "2") => {
    const newValues = value.filter(v => !v.startsWith(`${level}-`));
    const currentSelection = getSelectionForLevel(level);

    if (currentSelection !== choice) {
      newValues.push(`${level}-${choice}`);
    }

    onChange(newValues);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = constellationData.slice(startIndex, endIndex);

  const PaginationControls = () => (
    <div className="flex items-center justify-center gap-2 my-4">
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Anterior</span>
        </Button>
        <span className="text-sm font-medium w-24 text-center">
            Página {currentPage} de {totalPages}
        </span>
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            >
            <span className="hidden sm:inline mr-2">Próximo</span>
            <ChevronRight className="h-4 w-4" />
        </Button>
    </div>
  );

  return (
    <div>
       <PaginationControls />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">NÍVEL</TableHead>
              <TableHead className="text-center">OPÇÃO 1</TableHead>
              <TableHead className="text-center">OPÇÃO 2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row) => {
              const selection = getSelectionForLevel(row.level);
              return (
                <TableRow key={row.level}>
                  <TableCell className="font-medium text-center">{row.level}</TableCell>
                  <TableCell
                    className={cn(
                      "text-center cursor-pointer hover:bg-muted/50",
                      selection === "1" &&
                        "bg-green-800/50 border border-green-500"
                    )}
                    onClick={() => handleSelect(row.level, "1")}
                  >
                    {row.left}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-center cursor-pointer hover:bg-muted/50",
                      selection === "2" &&
                      "bg-green-800/50 border border-green-500"
                    )}
                    onClick={() => handleSelect(row.level, "2")}
                  >
                    {row.right}
                  </TableCell>
                </TableRow>
              )}
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationControls />
    </div>
  );
}
