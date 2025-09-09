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

const constellationData = [
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
];

interface ConstellationTableProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function ConstellationTable({ value, onChange }: ConstellationTableProps) {
  // State to hold the selection for each level: 'left' or 'right'
  const [selections, setSelections] = useState<Record<number, "left" | "right">>({});

  // When the component mounts, parse the initial `value` array to populate selections
  useEffect(() => {
    const initialSelections: Record<number, "left" | "right"> = {};
    const valueSet = new Set(value);

    constellationData.forEach((row) => {
      if (valueSet.has(row.left)) {
        initialSelections[row.level] = "left";
      } else if (valueSet.has(row.right)) {
        initialSelections[row.level] = "right";
      }
    });
    setSelections(initialSelections);
  }, []); // Run only on mount

  const handleSelect = (level: number, choice: "left" | "right") => {
    const newSelections = { ...selections, [level]: choice };
    setSelections(newSelections);

    // Update the parent form's value
    const newValues = constellationData
      .map((row) => {
        const selection = newSelections[row.level];
        if (selection === "left") return row.left;
        if (selection === "right") return row.right;
        return null;
      })
      .filter((v): v is string => v !== null);

    onChange(newValues);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">NÍVEL</TableHead>
            <TableHead className="text-center">ESQUERDA</TableHead>
            <TableHead className="text-center">DIREITA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {constellationData.map((row) => (
            <TableRow key={row.level}>
              <TableCell className="font-medium text-center">{row.level}</TableCell>
              <TableCell
                className={cn(
                  "text-center cursor-pointer hover:bg-muted/50",
                  selections[row.level] === "left" &&
                    "bg-green-800/50 border border-green-500"
                )}
                onClick={() => handleSelect(row.level, "left")}
              >
                {row.left}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center cursor-pointer hover:bg-muted/50",
                  selections[row.level] === "right" &&
                  "bg-green-800/50 border border-green-500"
                )}
                onClick={() => handleSelect(row.level, "right")}
              >
                {row.right}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
