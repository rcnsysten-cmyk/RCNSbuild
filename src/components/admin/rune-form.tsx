"use client";

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Info } from 'lucide-react';
import { RuneConfig } from '@/lib/types';
import Image from 'next/image';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

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

// Hardcoded list of rare runes based on user feedback/images
const rareRuneNames = [
    "Fumaça Infernal", 
    "Tempestade de Partículas de Gelo",
    "Infiltração Ilimitada",
    "Geada Feroz",
    "Fragmento de Habilidade de Veneno",
    "Fragmento do Tempo",
    "Fragmento do Mensageiro",
    "Fragmento de Separação",
    "Fragmento de Prazer Perverso",
    "Fragmento de Gelo",
    "Fragmento de Iluminação",
    "Fragmento de Injeção",
    "Fragmento de Melodia Venenosa",
    "Fragmento de Gelo Estilhaçado",
    "Visão Aprimorada",
    "Mundo de Gelo"
];

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
                
                // Sort runes to show rare ones first
                data.sort((a, b) => {
                    const aIsRare = rareRuneNames.includes(a.name);
                    const bIsRare = rareRuneNames.includes(b.name);
                    if (aIsRare && !bIsRare) return -1;
                    if (!aIsRare && bIsRare) return 1;
                    return a.name.localeCompare(b.name); // Then sort alphabetically
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

    const handleQuantityChange = (runeName: string, tier: number, quantity: string) => {
        const numQuantity = parseInt(quantity, 10);
        const newQuantity = isNaN(numQuantity) ? 0 : numQuantity;

        const newRunes = [...value];
        const existingRuneIndex = newRunes.findIndex(r => r.name === runeName && r.tier === tier);

        if (existingRuneIndex !== -1) {
            // Update existing rune quantity
            newRunes[existingRuneIndex].quantity = newQuantity;
        } else {
            // Add new rune
            newRunes.push({ name: runeName, tier: tier, quantity: newQuantity });
        }

        // Filter out runes with 0 quantity before calling onChange
        onChange(newRunes.filter(r => r.quantity > 0));
    };

    const getQuantityForRune = (runeName: string, tier: number): number => {
        const rune = value.find(r => r.name === runeName && r.tier === tier);
        return rune ? rune.quantity : 0;
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>Erro ao Carregar</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }
    
    if (availableRunes.length === 0) {
        return (
            <Alert variant="default" className="border-yellow-500/50 text-yellow-500 [&>svg]:text-yellow-500">
                <Info className="h-4 w-4" />
                <AlertTitle>Nenhuma Runa Encontrada</AlertTitle>
                <AlertDescription>
                    Nenhuma runa foi encontrada para esta classe. Adicione os arquivos de imagem na pasta `public/{className}/runas` para começar.
                </AlertDescription>
            </Alert>
        );
    }

    const runesForCurrentTier = availableRunes;

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
                </CardHeader>
                <CardContent>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                        {runesForCurrentTier.map(rune => {
                            const isRare = rareRuneNames.includes(rune.name);
                            return (
                                <div key={rune.name} className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                        <Image src={rune.imagePath} alt={rune.name} layout="fill" unoptimized />
                                    </div>
                                    <div className="flex-1">
                                        <Label 
                                            htmlFor={`${rune.name}-${selectedTier}`} 
                                            className={cn(
                                                "text-sm font-medium",
                                                isRare && "text-red-400"
                                            )}
                                        >
                                            {rune.name}
                                        </Label>
                                    </div>
                                    <Input 
                                        id={`${rune.name}-${selectedTier}`}
                                        type="number"
                                        min={0}
                                        value={getQuantityForRune(rune.name, selectedTier)}
                                        onChange={(e) => handleQuantityChange(rune.name, selectedTier, e.targt.value)}
                                        className="w-20"
                                    />
                                </div>
                            )
                        })}
                   </div>
                </CardContent>
            </Card>
        </div>
    );
}
