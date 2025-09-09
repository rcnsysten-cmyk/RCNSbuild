"use client";

import { cn } from "@/lib/utils";
import React from "react";
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

interface PropertyTableProps {
    value: PropertyPage[];
    onChange: (value: PropertyPage[]) => void;
}

export function PropertyTable({ value, onChange }: PropertyTableProps) {
  if (!value || value.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8 border rounded-md">
        Nenhuma propriedade disponível para esta classe/subclasse.
      </div>
    );
  }

  // For now, we only show the first page. Pagination can be added later.
  const currentPageData = value[0];

  const handleInputChange = (
    columnIndex: "left" | "middle" | "right",
    rowIndex: number,
    newValue: string
  ) => {
    const numericValue = parseInt(newValue, 10);
    if (isNaN(numericValue) && newValue !== "") return; // Allow empty string but not non-numeric

    const newPageData = { ...currentPageData };
    (newPageData[columnIndex] as number[])[rowIndex] = isNaN(numericValue) ? 0 : numericValue;

    // Update the properties array
    const newProperties = [...value];
    newProperties[0] = newPageData;
    onChange(newProperties);
  };
  
  const maxRows = Math.max(
    currentPageData.left.length,
    currentPageData.middle.length,
    currentPageData.right.length
  );

  const rows = Array.from({ length: maxRows }).map((_, rowIndex) => {
    const leftValue = currentPageData.left[rowIndex];
    const middleValue = currentPageData.middle[rowIndex];
    const rightValue = currentPageData.right[rowIndex];
    return { leftValue, middleValue, rightValue };
  });


  return (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-center">{currentPageData.title}</h3>
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
                {/* Left Column */}
                <TableCell className="text-center p-2">
                    {typeof row.leftValue === "string" ? (
                    <span>{row.leftValue}</span>
                    ) : (
                    <Input
                        type="number"
                        value={row.leftValue}
                        onChange={(e) => handleInputChange("left", rowIndex, e.target.value)}
                        className="w-20 mx-auto text-center"
                    />
                    )}
                </TableCell>
                {/* Middle Column */}
                <TableCell className="text-center p-2">
                    {typeof row.middleValue === "string" ? (
                    <span>{row.middleValue}</span>
                    ) : (
                    <Input
                        type="number"
                        value={row.middleValue}
                        onChange={(e) => handleInputChange("middle", rowIndex, e.target.value)}
                        className="w-20 mx-auto text-center"
                    />
                    )}
                </TableCell>
                {/* Right Column */}
                <TableCell className="text-center p-2">
                    {typeof row.rightValue === "string" ? (
                    <span>{row.rightValue}</span>
                    ) : (
                    <Input
                        type="number"
                        value={row.rightValue}
                        onChange={(e) => handleInputChange("right", rowIndex, e.target.value)}
                        className="w-20 mx-auto text-center"
                    />
                    )}
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </div>
    </div>
  );
}
