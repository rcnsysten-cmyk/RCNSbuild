"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { PropertyPage } from "@/lib/types";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyTableProps {
    value: PropertyPage[];
    onChange: (pageIndex: number, newPageData: PropertyPage) => void;
    data: PropertyPage[]; // Base data from lib
}

export function PropertyTable({ value, onChange, data }: PropertyTableProps) {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
    if (!data || data.length === 0) {
      return (
        <div className="text-center text-muted-foreground p-8 border rounded-md">
          Nenhuma propriedade disponível para esta classe/subclasse.
        </div>
      );
    }
  
    const currentPageData = value[currentPageIndex] || data[currentPageIndex];
    const totalPages = data.length;
  
    const handleInputChange = (
      columnIndex: "left" | "middle" | "right",
      rowIndex: number,
      newValue: string
    ) => {
      const numericValue = parseInt(newValue, 10);
      // Allow empty string to clear the input, otherwise check for valid number
      if (isNaN(numericValue) && newValue !== "") return;
  
      const newPageData = { ...currentPageData };
      const newColumnArray = [...(newPageData[columnIndex] as (string | number | null)[])];
      newColumnArray[rowIndex] = newValue === "" ? 0 : numericValue;
      (newPageData[columnIndex] as (string | number | null)[]) = newColumnArray;
  
      onChange(currentPageIndex, newPageData);
    };
  
    const maxRows = Math.max(
      (currentPageData.left || []).length,
      (currentPageData.middle || []).length,
      (currentPageData.right || []).length
    );
  
    const rows = Array.from({ length: maxRows }).map((_, rowIndex) => {
        const leftValue = currentPageData.left?.[rowIndex];
        const middleValue = currentPageData.middle?.[rowIndex];
        const rightValue = currentPageData.right?.[rowIndex];
        return { leftValue, middleValue, rightValue };
    });

    const PaginationControls = () => (
        <div className="flex items-center justify-center gap-2 my-4">
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                disabled={currentPageIndex === 0}
                >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Anterior</span>
            </Button>
            <span className="text-sm font-medium w-24 text-center">
                Página {currentPageIndex + 1} de {totalPages}
            </span>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPageIndex === totalPages - 1}
                >
                <span className="hidden sm:inline mr-2">Próximo</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      );
  
    return (
      <div className="space-y-4">
        <PaginationControls />
        <h3 className="text-xl font-bold text-center">{currentPageData.title}</h3>
        <div className="max-w-md mx-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Lado Esquerdo</TableHead>
                  <TableHead className="text-center">Meio</TableHead>
                  <TableHead className="text-center">Lado Direito</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell className="p-1 align-middle">
                      {typeof row.leftValue === "number" ? (
                        <Input
                          type="number"
                          value={row.leftValue}
                          onChange={(e) => handleInputChange("left", rowIndex, e.target.value)}
                          className="w-16 mx-auto text-center h-8"
                        />
                      ) : (
                        <div className="w-16 h-8 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="p-1 align-middle">
                      {typeof row.middleValue === "number" ? (
                        <Input
                          type="number"
                          value={row.middleValue}
                          onChange={(e) => handleInputChange("middle", rowIndex, e.target.value)}
                          className="w-16 mx-auto text-center h-8"
                        />
                      ) : (
                          <div className="w-16 h-8 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="p-1 align-middle">
                      {typeof row.rightValue === "number" ? (
                        <Input
                          type="number"
                          value={row.rightValue}
                          onChange={(e) => handleInputChange("right", rowIndex, e.target.value)}
                          className="w-16 mx-auto text-center h-8"
                        />
                      ) : (
                          <div className="w-16 h-8 mx-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <PaginationControls />
      </div>
    );
  }
  