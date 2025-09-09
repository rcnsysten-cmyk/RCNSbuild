"use client";

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
import { cn } from "@/lib/utils";

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
      sectionIndex: number,
      rowIndex: number,
      columnIndex: "left" | "middle" | "right",
      newValue: string
    ) => {
      const numericValue = parseInt(newValue, 10);
      if (isNaN(numericValue) && newValue !== "") return;
  
      const newPageData = JSON.parse(JSON.stringify(currentPageData)) as PropertyPage;
      const newSections = newPageData.sections;
      const newRows = newSections[sectionIndex].rows;
      
      const newRow = [...newRows[rowIndex]];
      const colMap = { left: 0, middle: 1, right: 2 };
      newRow[colMap[columnIndex]] = newValue === "" ? 0 : numericValue;

      newRows[rowIndex] = newRow as [number | null, number | null, number | null];
      
      onChange(currentPageIndex, newPageData);
    };
  
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
                  <TableHead className="text-center w-[33%]">Lado Esquerdo</TableHead>
                  <TableHead className="text-center w-[33%]">Meio</TableHead>
                  <TableHead className="text-center w-[33%]">Lado Direito</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPageData.sections.map((section, sectionIndex) => (
                    <React.Fragment key={section.title}>
                        <TableRow>
                            <TableCell colSpan={3} className="p-2 bg-muted/30">
                                <h4 className="font-bold text-center text-sm">{section.title}</h4>
                            </TableCell>
                        </TableRow>
                        {section.rows.map((row, rowIndex) => (
                             <TableRow key={rowIndex}>
                                <TableCell className="p-1 align-middle">
                                    {typeof row[0] === "number" ? (
                                    <Input
                                        type="number"
                                        value={row[0]}
                                        onChange={(e) => handleInputChange(sectionIndex, rowIndex, "left", e.target.value)}
                                        className="w-16 mx-auto text-center h-8"
                                    />
                                    ) : (
                                    <div className="w-16 h-8 mx-auto" />
                                    )}
                                </TableCell>
                                <TableCell className="p-1 align-middle">
                                    {typeof row[1] === "number" ? (
                                    <Input
                                        type="number"
                                        value={row[1]}
                                        onChange={(e) => handleInputChange(sectionIndex, rowIndex, "middle", e.target.value)}
                                        className="w-16 mx-auto text-center h-8"
                                    />
                                    ) : (
                                        <div className="w-16 h-8 mx-auto" />
                                    )}
                                </TableCell>
                                <TableCell className="p-1 align-middle">
                                    {typeof row[2] === "number" ? (
                                    <Input
                                        type="number"
                                        value={row[2]}
                                        onChange={(e) => handleInputChange(sectionIndex, rowIndex, "right", e.target.value)}
                                        className="w-16 mx-auto text-center h-8"
                                    />
                                    ) : (
                                        <div className="w-16 h-8 mx-auto" />
                                    )}
                                </TableCell>
                             </TableRow>
                        ))}
                    </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <PaginationControls />
      </div>
    );
  }
  