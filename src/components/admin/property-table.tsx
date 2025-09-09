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
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { PropertySummaryDialog } from "./property-summary-dialog";

interface PropertyTableProps {
    value: PropertyPage[];
    onChange: (pageIndex: number, newPageData: PropertyPage) => void;
    data: PropertyPage[]; // Base data from lib
}

export function PropertyTable({ value, onChange, data }: PropertyTableProps) {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  
    if (!data || data.length === 0) {
      return (
        <div className="text-center text-muted-foreground p-8 border rounded-md">
          Nenhuma propriedade disponível para esta classe/subclasse.
        </div>
      );
    }
  
    // Use the value from the form if it exists, otherwise use the base data
    const currentPageData = (value && value[currentPageIndex]) ? value[currentPageIndex] : data[currentPageIndex];
    const totalPages = data.length;
  
    const handleInputChange = (
      sectionIndex: number,
      rowIndex: number,
      columnIndex: number,
      newValue: string
    ) => {
      const numericValue = parseInt(newValue, 10);
      if (isNaN(numericValue) && newValue !== "") return;
  
      const newPageData = JSON.parse(JSON.stringify(currentPageData)) as PropertyPage;
      
      const newRow = [...newPageData.sections[sectionIndex].rows[rowIndex]] as [number | null, number | null, number | null];
      newRow[columnIndex] = newValue === "" ? 0 : numericValue;
      newPageData.sections[sectionIndex].rows[rowIndex] = newRow;
      
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
        <>
        <PropertySummaryDialog 
            isOpen={isSummaryOpen}
            onOpenChange={setIsSummaryOpen}
            allPagesData={value}
        />
        <div className="space-y-6">
            <div className="flex items-center justify-center relative">
                <PaginationControls />
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsSummaryOpen(true)}
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Resultado Final
                </Button>
            </div>
            <h3 className="text-xl font-bold text-center">{currentPageData.title}</h3>
            <div className="max-w-md mx-auto space-y-6">
                {currentPageData.sections.map((section, sectionIndex) => (
                    <div key={section.title}>
                        <h4 className="font-bold text-center text-lg mb-2">{section.title}</h4>
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
                                    {section.rows.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        <TableCell className="p-1 align-middle">
                                        {typeof row[0] === "number" ? (
                                            <Input
                                            type="number"
                                            value={row[0]}
                                            onChange={(e) => handleInputChange(sectionIndex, rowIndex, 0, e.target.value)}
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
                                            onChange={(e) => handleInputChange(sectionIndex, rowIndex, 1, e.target.value)}
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
                                            onChange={(e) => handleInputChange(sectionIndex, rowIndex, 2, e.target.value)}
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
                ))}
            </div>
            <PaginationControls />
        </div>
      </>
    );
  }
