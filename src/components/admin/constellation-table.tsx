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
import { ConstellationData } from "@/lib/constellation-data";

const ITEMS_PER_PAGE = 17;

interface ConstellationTableProps {
  value: string[]; // Expects values like "25-1", "29-2"
  onChange: (value: string[]) => void;
  data: ConstellationData[];
}

export function ConstellationTable({ value, onChange, data }: ConstellationTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  // Reset to page 1 if the data changes (e.g. switching classes)
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);
  
  if (data.length === 0) {
    return (
        <div className="text-center text-muted-foreground p-8 border rounded-md">
            Nenhuma constelação disponível para esta classe/subclasse.
        </div>
    )
  }

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
  const currentData = data.slice(startIndex, endIndex);

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
