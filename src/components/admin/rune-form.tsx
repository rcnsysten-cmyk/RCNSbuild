"use client";

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Info, PlusCircle, Trash2 } from 'lucide-react';
import { RuneConfig } from '@/lib/types';
import Image from 'next/image';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface AvailableRune {
    name: string;
    imagePath: string;
}

interface RuneFormProps {
    className: string;
    value: RuneConfig[];
    onChange: (value: RuneConfig[]) => void;
}

const TOTAL_TIERS = 10;

type Rarity = "rare" | "magic" | "special" | "common";

const runeRarityMap: { [key: string]: Rarity } = {
    // Red (Rare)
    "Fumaça Infernal": "rare",
    "Tempestade de Partículas de Gelo": "rare",
    "Infiltração Ilimitada": "rare",
    "Geada Feroz": "rare",
    "Fragmento de Habilidade de Veneno": "rare",
    "Fragmento do Tempo": "rare",
    "Fragmento do Mensageiro": "rare",
    "Fragmento de Separação": "rare",
    "Fragmento de Prazer Perverso": "rare",
    "Fragmento de Gelo": "rare",
    "Fragmento de Iluminação": "rare",
    "Fragmento de Injeção": "rare",
    "Fragmento de Melodia Venenosa": "rare",
    "Fragmento de Gelo Estilhaçado": "rare",
    "Visão Aprimorada": "rare",
    "Mundo de Gelo": "rare",
    "Fragmento Divino Celestial": "rare",
    // Purple (Magic)
    "Fumaça": "magic",
    "Tempestade": "magic",
    "Infiltração": "magic",
    "Nevasca": "magic",
    "Percepção": "magic",
    "Habilidade de Veneno": "magic",
    "Habilidade de Gelo": "magic",
    "Prazer": "magic",
    "Tempo": "magic",
    "Separação": "magic",
    "Injeção": "magic",
    "Iluminação": "magic",
    "Melodia": "magic",
    "Divindade": "magic",
    "Visão": "magic",
    "Explosão": "magic",
    "Gelo Estilhaçado": "magic",
    "Celestial": "magic",
    // Green (Special)
    "Fragmento de Fumaça": "special",
    "Fragmento de Tempestade": "special",
    "Fragmento de Infiltração": "special",
    "Fragmento de Nevasca": "special",
    "Fragmento de Percepção": "special",
    "Fragmento de Prazer": "special",
    // Yellow (Common)
    "Fragmento de Runa do Escalão": "common",
};

const rarityOrder: Rarity[] = ["rare", "magic", "special", "common"];
const rarityColors: { [key in Rarity]: string } = {
    rare: "text-red-400",
    magic: "text-purple-400",
    special: "text-green-400",
    common: "text-yellow-400",
};


export function RuneForm({ className, value, onChange }: RuneFormProps) {
    const [availableRunes, setAvailableRunes] = useState<AvailableRune[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTier, setSelectedTier] = useState<number>(1);

    useEffect(() => {
        async function fetchRunes() {
            if (!className) return;
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/runas?className=${encodeURIComponent(className)}`);
                if (!response.ok) {
                    throw new Error('Falha ao buscar as runas.');
                }
                const data: AvailableRune[] = await response.json();
                
                data.sort((a, b) => {
                    const rarityA = runeRarityMap[a.name] || "common";
                    const rarityB = runeRarityMap[b.name] || "common";
                    const indexA = rarityOrder.indexOf(rarityA);
                    const indexB = rarityOrder.indexOf(rarityB);
                    if (indexA !== indexB) {
                        return indexA - indexB;
                    }
                    return a.name.localeCompare(b.name);
                });

                setAvailableRunes(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchRunes();
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

    if (error) {
        return <Alert variant="destructive"><Info className="h-4 w-4" /><AlertTitle>Erro ao Carregar</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
    }
    
    if (availableRunes.length === 0 && !loading) {
        return <Alert variant="default" className="border-yellow-500/50 text-yellow-500 [&>svg]:text-yellow-500"><Info className="h-4 w-4" /><AlertTitle>Nenhuma Runa Encontrada</AlertTitle><AlertDescription>Nenhuma runa foi encontrada para esta classe. Adicione os arquivos de imagem na pasta `public/{className.toLowerCase().replace(' ','-')}/runas` para começar.</AlertDescription></Alert>;
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
                       const currentRarity = runeRarityMap[rune.name] || 'common';
                       const currentRarityColor = rarityColors[currentRarity];
                       const runeImage = availableRunes.find(ar => ar.name === rune.name)?.imagePath;
                       const currentSelectableRunes = [...selectableRunes, { name: rune.name, imagePath: runeImage || '' }].sort((a, b) => {
                            const rarityA = runeRarityMap[a.name] || "common";
                            const rarityB = runeRarityMap[b.name] || "common";
                            if(rarityA !== rarityB) {
                                return rarityOrder.indexOf(rarityA) - rarityOrder.indexOf(rarityB);
                            }
                            return a.name.localeCompare(b.name);
                       });

                       return (
                         <div key={`${rune.name}-${index}`} className="flex items-center gap-4 p-2 rounded-lg bg-muted/30">
                            {runeImage && (
                                <div className="relative w-10 h-10 rounded-md overflow-hidden">
                                    <Image src={runeImage} alt={rune.name} layout="fill" unoptimized />
                                </div>
                            )}
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
                                            const rarity = runeRarityMap[ar.name] || 'common';
                                            const color = rarityColors[rarity];
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
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveRune(rune.name)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                         </div>
                       )
                     })}
                   </div>
                   <Button variant="outline" onClick={handleAddRune} disabled={selectableRunes.length === 0}>
                       <PlusCircle className="mr-2 h-4 w-4" />
                       Adicionar Runa
                   </Button>
                </CardContent>
            </Card>
        </div>
    );
}
