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
    // Allow empty string to clear the input, but prevent non-numeric values
    if (isNaN(numericValue) && newValue !== "") return; 

    const newPageData = { ...currentPageData };
    // Create a mutable copy of the column array
    const newColumnArray = [...(newPageData[columnIndex] as (string | number | null)[])];
    // Update the value
    newColumnArray[rowIndex] = newValue === "" ? 0 : numericValue;
    // Assign the new array back
    (newPageData[columnIndex] as (string | number | null)[]) = newColumnArray;


    // Update the entire properties array
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
            {rows.map((row, rowIndex) => {
                return (
                    <TableRow key={rowIndex}>
                    {/* Left Column */}
                    <TableCell className="p-1 align-middle">
                        {typeof row.leftValue === "number" ? (
                        <Input
                            type="number"
                            value={row.leftValue}
                            onChange={(e) => handleInputChange("left", rowIndex, e.target.value)}
                            className="w-24 mx-auto text-center h-8"
                        />
                        ) : null}
                    </TableCell>
                    {/* Middle Column */}
                    <TableCell className="p-1 align-middle">
                        {typeof row.middleValue === "number" ? (
                        <Input
                            type="number"
                            value={row.middleValue}
                            onChange={(e) => handleInputChange("middle", rowIndex, e.target.value)}
                            className="w-24 mx-auto text-center h-8"
                        />
                        ) : null}
                    </TableCell>
                    {/* Right Column */}
                    <TableCell className="p-1 align-middle">
                        {typeof row.rightValue === "number" ? (
                        <Input
                            type="number"
                            value={row.rightValue}
                            onChange={(e) => handleInputChange("right", rowIndex, e.target.value)}
                            className="w-24 mx-auto text-center h-8"
                        />
                        ) : null}
                    </TableCell>
                    </TableRow>
                )
            })}
            </TableBody>
        </Table>
        </div>
    </div>
  );
}
