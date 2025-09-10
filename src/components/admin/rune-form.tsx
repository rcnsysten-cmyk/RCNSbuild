"use client";

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Info, PlusCircle, Trash2 } from 'lucide-react';
import { RuneConfig } from '@/lib/types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { AvailableRune, Rarity, getAvailableRunes, rarityColors, rarityOrder } from '@/lib/rune-data';


interface RuneFormProps {
    className: string;
    value: RuneConfig[];
    onChange: (value: RuneConfig[]) => void;
}

const TOTAL_TIERS = 10;


export function RuneForm({ className, value, onChange }: RuneFormProps) {
    const [availableRunes, setAvailableRunes] = useState<AvailableRune[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTier, setSelectedTier] = useState<number>(1);

    useEffect(() => {
        setLoading(true);
        const runes = getAvailableRunes(className);
        runes.sort((a, b) => {
            const indexA = rarityOrder.indexOf(a.rarity);
            const indexB = rarityOrder.indexOf(b.rarity);
            if (indexA !== indexB) {
                return indexA - indexB;
            }
            return a.name.localeCompare(b.name);
        });
        setAvailableRunes(runes);
        setLoading(false);
    }, [className]);
    
    const runesForCurrentTier = value.filter(r => r.tier === selectedTier);
    const usedRuneNames = runesForCurrentTier.map(r => r.name);
    const selectableRunes = availableRunes.filter(ar => !usedRuneNames.includes(ar.name));

    const handleAddRune = () => {
        if (selectableRunes.length > 0) {
            const firstAvailable = selectableRunes[0];
            const newRune: RuneConfig = { name: firstAvailable.name, tier: selectedTier, quantity: 1 };
            onChange([...value, newRune]);
        }
    };

    const handleRemoveRune = (runeName: string) => {
        onChange(value.filter(r => !(r.name === runeName && r.tier === selectedTier)));
    };

    const handleRuneChange = (oldName: string, newName: string) => {
        onChange(value.map(r => 
            (r.name === oldName && r.tier === selectedTier) ? { ...r, name: newName } : r
        ));
    };

    const handleQuantityChange = (runeName: string, quantity: string) => {
        const numQuantity = parseInt(quantity, 10);
        const newQuantity = isNaN(numQuantity) || numQuantity < 1 ? 1 : numQuantity;
        onChange(value.map(r => 
            (r.name === runeName && r.tier === selectedTier) ? { ...r, quantity: newQuantity } : r
        ));
    };


    if (loading) {
        return <Skeleton className="h-64 w-full" />;
    }
    
    if (availableRunes.length === 0) {
        return <Alert variant="default" className="border-yellow-500/50 text-yellow-500 [&>svg]:text-yellow-500"><Info className="h-4 w-4" /><AlertTitle>Nenhuma Runa Encontrada</AlertTitle><AlertDescription>Nenhuma runa foi encontrada para esta classe. Adicione os dados no arquivo `src/lib/rune-data.ts` para começar.</AlertDescription></Alert>;
    }

    return (
        <div className="space-y-6">
             <div className="w-full md:w-1/3">
                <Label>Selecione o Tier da Runa</Label>
                <Select onValueChange={(val) => setSelectedTier(parseInt(val, 10))} value={String(selectedTier)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione um Tier" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: TOTAL_TIERS }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                                Tier {i + 1}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Fragmentos de Runa - Tier {selectedTier}</CardTitle>
                    <CardDescription>Adicione os fragmentos de runa e suas quantidades para este tier.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {runesForCurrentTier.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">Nenhuma runa adicionada para este tier.</div>
                   )}
                   <div className="space-y-4">
                     {runesForCurrentTier.map((rune, index) => {
                       const runeData = availableRunes.find(ar => ar.name === rune.name);
                       const currentRarity = runeData?.rarity || 'common';
                       const currentRarityColor = rarityColors[currentRarity];
                       
                       const currentSelectableRunes = [...availableRunes.filter(ar => !usedRuneNames.includes(ar.name) || ar.name === rune.name)].sort((a, b) => {
                            const indexA = rarityOrder.indexOf(a.rarity);
                            const indexB = rarityOrder.indexOf(b.rarity);
                            if(indexA !== indexB) {
                                return indexA - indexB;
                            }
                            return a.name.localeCompare(b.name);
                       });

                       return (
                         <div key={`${rune.tier}-${index}`} className="flex items-center gap-4 p-2 rounded-lg bg-muted/30">
                           <div className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center text-xs text-muted-foreground">
                                Tier {rune.tier}
                            </div>
                            <div className="flex-1">
                                <Select
                                  value={rune.name}
                                  onValueChange={(newName) => handleRuneChange(rune.name, newName)}
                                >
                                    <SelectTrigger className={cn("font-medium", currentRarityColor)}>
                                        <SelectValue placeholder="Selecione um fragmento..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currentSelectableRunes.map(ar => {
                                            const color = rarityColors[ar.rarity];
                                            return (
                                                <SelectItem key={ar.name} value={ar.name} className={cn("font-medium", color)}>
                                                    {ar.name}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-24">
                               <Label htmlFor={`quantity-${index}`} className="sr-only">Quantidade</Label>
                               <Input
                                   id={`quantity-${index}`}
                                   type="number"
                                   min={1}
                                   placeholder="Qtde."
                                   value={rune.quantity}
                                   onChange={(e) => handleQuantityChange(rune.name, e.target.value)}
                               />
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveRune(rune.name)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                         </div>
                       )
                     })}
                   </div>
                   <Button type="button" variant="outline" onClick={handleAddRune} disabled={selectableRunes.length === 0}>
                       <PlusCircle className="mr-2 h-4 w-4" />
                       Adicionar Runa
                   </Button>
                </CardContent>
            </Card>
        </div>
    );
}
