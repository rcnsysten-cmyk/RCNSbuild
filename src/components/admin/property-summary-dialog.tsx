import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { pageTypeMap } from "@/lib/property-data";
import { PropertyPage, PropertySection } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "../ui/table";

interface PropertySummaryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  allPagesData: PropertyPage[];
}

type SummaryData = {
  [key: string]: {
    title: string;
    rows: (number | null)[][];
    totals: (number | null)[];
  };
};

const calculateSummary = (allPagesData: PropertyPage[]): SummaryData => {
  const summary: SummaryData = {
    Ataque: { title: "Propriedade de Ataque", rows: Array(10).fill(null).map(() => [0, 0, 0]), totals: [0, 0, 0] },
    Defesa: { title: "Propriedade de Defesa", rows: Array(10).fill(null).map(() => [0, 0, 0]), totals: [0, 0, 0] },
    Comum: { title: "Propriedade Comum", rows: Array(10).fill(null).map(() => [0, 0, 0]), totals: [0, 0, 0] },
    Elemental: { title: "Propriedade de Tipo Elemental", rows: Array(10).fill(null).map(() => [0, 0, 0]), totals: [0, 0, 0] },
  };

  allPagesData.forEach(page => {
    const pageType = pageTypeMap[page.page];
    if (pageType && summary[pageType]) {
      page.sections.forEach(section => {
        section.rows.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (typeof cell === 'number') {
              (summary[pageType].rows[rowIndex][colIndex] as number) += cell;
            }
          });
        });
      });
    }
  });

  // Calculate totals for each column
  Object.values(summary).forEach(propertyType => {
    for (let col = 0; col < 3; col++) {
      propertyType.totals[col] = propertyType.rows.reduce((acc, row) => acc + (row[col] || 0), 0);
    }
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
                                {summary[key].rows[rowIndex].map((cellValue, colIndex) => (
                                    <TableCell key={colIndex} className="text-center p-2">
                                        {cellValue}
                                    </TableCell>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableRow>
                   ))}
                </TableBody>
                <TableFooter>
                    <TableRow className="bg-muted/50 font-bold">
                         {propertyOrder.map(key => (
                            <React.Fragment key={`${key}-total`}>
                                {summary[key].totals.map((total, colIndex) => (
                                    <TableCell key={colIndex} className="text-center p-2">
                                        {total}
                                    </TableCell>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableRow>
                    <TableRow>
                         {propertyOrder.map(key => (
                           <TableCell key={`${key}-total-label`} colSpan={3} className={cn("text-center font-extrabold text-lg p-3", propertyColors[key], propertyTextColors[key])}>
                               TOTAL: {summary[key].totals.reduce((a,b) => (a || 0) + (b || 0), 0)}
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
