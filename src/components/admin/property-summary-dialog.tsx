import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { pageTypeMap } from "@/lib/property-data";
import { PropertyPage, PropertyRow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "../ui/table";

interface PropertySummaryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  allPagesData: PropertyPage[];
}

type SummaryRow = {
    left: number;
    middle: number;
    right: number;
}

type SummaryData = {
  [key: string]: {
    title: string;
    rows: SummaryRow[];
    totals: SummaryRow;
  };
};

const calculateSummary = (allPagesData: PropertyPage[]): SummaryData => {
  const summary: SummaryData = {
    Ataque: { title: "Propriedade de Ataque", rows: Array(10).fill(null).map(() => ({left: 0, middle: 0, right: 0})), totals: {left: 0, middle: 0, right: 0} },
    Defesa: { title: "Propriedade de Defesa", rows: Array(10).fill(null).map(() => ({left: 0, middle: 0, right: 0})), totals: {left: 0, middle: 0, right: 0} },
    Comum: { title: "Propriedade Comum", rows: Array(10).fill(null).map(() => ({left: 0, middle: 0, right: 0})), totals: {left: 0, middle: 0, right: 0} },
    Elemental: { title: "Propriedade de Tipo Elemental", rows: Array(10).fill(null).map(() => ({left: 0, middle: 0, right: 0})), totals: {left: 0, middle: 0, right: 0} },
  };

  // Iterate through all 16 pages and accumulate the points
  allPagesData.forEach(page => {
    const pageType = pageTypeMap[page.page];
    if (pageType && summary[pageType] && page.sections.length > 0) {
      // Assuming one section per page for simplicity, as per the current structure
      const section = page.sections[0];
      section.rows.forEach((row, rowIndex) => {
        if (summary[pageType].rows[rowIndex]) {
            const summaryRow = summary[pageType].rows[rowIndex];
            if (typeof row.left === 'number') summaryRow.left += row.left;
            if (typeof row.middle === 'number') summaryRow.middle += row.middle;
            if (typeof row.right === 'number') summaryRow.right += row.right;
        }
      });
    }
  });

  // Calculate totals for each column for each property type
  Object.values(summary).forEach(propertyType => {
    propertyType.totals.left = propertyType.rows.reduce((acc, row) => acc + (row.left || 0), 0);
    propertyType.totals.middle = propertyType.rows.reduce((acc, row) => acc + (row.middle || 0), 0);
    propertyType.totals.right = propertyType.rows.reduce((acc, row) => acc + (row.right || 0), 0);
  });

  return summary;
};

const propertyOrder: (keyof SummaryData)[] = ["Ataque", "Defesa", "Comum", "Elemental"];
const propertyColors = {
    Ataque: "bg-orange-900/30",
    Defesa: "bg-blue-900/30",
    Comum: "bg-green-900/30",
    Elemental: "bg-purple-900/30",
};
const propertyTextColors = {
    Ataque: "text-orange-300",
    Defesa: "text-blue-300",
    Comum: "text-green-300",
    Elemental: "text-purple-300",
};


export function PropertySummaryDialog({ isOpen, onOpenChange, allPagesData }: PropertySummaryDialogProps) {
  if (!allPagesData || allPagesData.length === 0) {
    return null;
  }

  const summary = calculateSummary(allPagesData);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Resultado Final - Propriedades (Nível 1100)</DialogTitle>
        </DialogHeader>
        <div className="rounded-md border mt-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        {propertyOrder.map(key => (
                           <TableHead key={key} colSpan={3} className={cn("text-center font-bold text-lg p-3", propertyColors[key], propertyTextColors[key])}>
                               {summary[key].title}
                           </TableHead> 
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                   {Array.from({length: 10}).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {propertyOrder.map(key => (
                            <React.Fragment key={`${key}-${rowIndex}`}>
                                <TableCell className="text-center p-2">{summary[key].rows[rowIndex].left}</TableCell>
                                <TableCell className="text-center p-2">{summary[key].rows[rowIndex].middle}</TableCell>
                                <TableCell className="text-center p-2">{summary[key].rows[rowIndex].right}</TableCell>
                            </React.Fragment>
                        ))}
                    </TableRow>
                   ))}
                </TableBody>
                <TableFooter>
                    <TableRow className="bg-muted/50 font-bold">
                         {propertyOrder.map(key => (
                            <React.Fragment key={`${key}-total`}>
                                <TableCell className="text-center p-2">{summary[key].totals.left}</TableCell>
                                <TableCell className="text-center p-2">{summary[key].totals.middle}</TableCell>
                                <TableCell className="text-center p-2">{summary[key].totals.right}</TableCell>
                            </React.Fragment>
                        ))}
                    </TableRow>
                    <TableRow>
                         {propertyOrder.map(key => (
                           <TableCell key={`${key}-total-label`} colSpan={3} className={cn("text-center font-extrabold text-lg p-3", propertyColors[key], propertyTextColors[key])}>
                               TOTAL: {summary[key].totals.left + summary[key].totals.middle + summary[key].totals.right}
                           </TableCell> 
                        ))}
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
