'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { getBuildById } from '@/lib/firestore';
import { Build, RuneConfig, SubClass } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dna, Gem, ListTree, ShieldCheck, Swords, Star, Info, Eye } from 'lucide-react';
import { DkIcon, DlIcon, DwIcon, ElfaIcon } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ConstellationTable } from '@/components/admin/constellation-table';
import { getConstellationData } from '@/lib/constellation-data';
import { PropertySummaryDialog } from '@/components/admin/property-summary-dialog';
import { SetsGallery } from '@/components/admin/sets-gallery';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getAvailableRunes, rarityColors } from '@/lib/rune-data';
import { cn } from '@/lib/utils';

const iconMap: { [key: string]: React.ElementType } = {
    'Dark Wizard': DwIcon,
    'Dark Knight': DkIcon,
    Elfa: ElfaIcon,
    'Dark Lord': DlIcon,
  };
  
const getLevelRangeLabel = (levelRange: string) => {
    if (levelRange === '401+') return 'Lvl 401+';
    const [start, end] = levelRange.split('-');
    return `Lvl ${start}-${end}`;
}

const groupRunesByTier = (runes: RuneConfig[]) => {
    return runes.reduce((acc, rune) => {
        const tier = rune.tier;
        if (!acc[tier]) {
            acc[tier] = [];
        }
        acc[tier].push(rune);
        return acc;
    }, {} as Record<number, RuneConfig[]>);
};

export default function BuildDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { className, buildId } = params;
    
    const [build, setBuild] = useState<Build | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPropertySummaryOpen, setIsPropertySummaryOpen] = useState(false);
    const [availableSkills, setAvailableSkills] = useState<{name: string, imagePath: string}[]>([]);

    if (!className || !buildId) {
        return notFound();
    }
    
    const decodedClassName = decodeURIComponent(className as string);
    const decodedBuildId = decodeURIComponent(buildId as string);

    useEffect(() => {
        const fetchBuild = async () => {
            const buildData = await getBuildById(decodedBuildId);
            if (buildData && buildData.class === decodedClassName) {
                setBuild(buildData);
            } else {
                notFound();
            }
            setLoading(false);
        };
        fetchBuild();
    }, [decodedBuildId, decodedClassName]);

    const subClass = build?.subclasses[0];

    useEffect(() => {
        const fetchAllSkills = async () => {
            if (!subClass || !build) return;
            try {
                const response = await fetch('/api/skills');
                const allSkills = await response.json();
                const classSkills = allSkills.filter((s: any) => s.className === build.class);
                const relevantSkills = classSkills.filter((s: any) => subClass.skills.some(ss => ss.name === s.name));
                setAvailableSkills(relevantSkills);
            } catch (error) {
                console.error("Failed to fetch skills for display", error);
            }
        };
        fetchAllSkills();
    }, [subClass, build])
    
    const groupedRunes = useMemo(() => {
        if (!subClass?.runes) return {};
        return groupRunesByTier(subClass.runes);
    }, [subClass?.runes]);

    const availableTiers = useMemo(() => {
        return Object.keys(groupedRunes).map(Number).sort((a, b) => a - b);
    }, [groupedRunes]);
    
    const initialTier = availableTiers.length > 0 ? String(availableTiers[0]) : undefined;

    if (loading) {
        return (
          <div className="container mx-auto px-4 py-8">
             <Skeleton className="h-10 w-24 mb-6" />
             <div className="flex items-center gap-4 mb-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-1/2" />
             </div>
             <Skeleton className="h-6 w-1/3 mb-8" />
             <Skeleton className="h-12 w-full mb-4" />
             <Skeleton className="h-96 w-full" />
          </div>
        );
    }
    
    if (!build || !subClass) {
        return notFound();
    }
      
    const Icon = iconMap[build.class];
    const subClassNames = build.subclasses.map(sc => sc.name).join(' & ');
    const constellationData = getConstellationData(build.class, subClass.name);

    return (
        <div>
            <PropertySummaryDialog 
                isOpen={isPropertySummaryOpen}
                onOpenChange={setIsPropertySummaryOpen}
                allPagesData={subClass.properties}
            />
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
                <div className="flex items-center gap-3 mb-2">
                    {Icon && <Icon className="h-8 w-8 text-primary" />}
                    <h1 className="text-4xl font-bold font-headline">{build.id}</h1>
                </div>
                <p className="text-muted-foreground text-lg mb-8">{build.class} - {subClassNames}</p>

                <Tabs defaultValue="attributes" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto flex-wrap">
                        <TabsTrigger value="attributes"><Dna className="mr-2"/> Atributos</TabsTrigger>
                        <TabsTrigger value="skills"><Swords className="mr-2"/> Habilidades</TabsTrigger>
                        <TabsTrigger value="properties"><ListTree className="mr-2"/> Propriedades</TabsTrigger>
                        <TabsTrigger value="constellation"><Star className="mr-2"/> Constelação</TabsTrigger>
                        <TabsTrigger value="sets"><ShieldCheck className="mr-2"/> Conjuntos</TabsTrigger>
                        <TabsTrigger value="runes"><Gem className="mr-2"/> Runas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="attributes" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribuição de Atributos</CardTitle>
                                <CardDescription>Pontos de Força, Agilidade, Vitalidade e Energia por faixa de nível.</CardDescription>
                            </CardHeader>
                            <CardContent>
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                 {subClass.config.map(attr => (
                                    <Card key={attr.levelRange} className="bg-muted/30">
                                        <CardHeader>
                                            <CardTitle className="text-center text-lg">{getLevelRangeLabel(attr.levelRange)}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 text-center text-lg">
                                                <li><span className="font-bold text-red-400">FOR:</span> {attr.str}</li>
                                                <li><span className="font-bold text-green-400">AGI:</span> {attr.agi}</li>
                                                <li><span className="font-bold text-blue-400">VIT:</span> {attr.vit}</li>
                                                <li><span className="font-bold text-purple-400">ENE:</span> {attr.ene}</li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                 ))}
                               </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="skills" className="mt-6">
                         <Card>
                            <CardHeader>
                                <CardTitle>Pontos de Habilidade</CardTitle>
                                <CardDescription>Distribuição de pontos nas habilidades principais e da especialização.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
                                    {subClass.skills.map(skill => {
                                        const skillInfo = availableSkills.find(s => s.name === skill.name);
                                        return (
                                            <div key={skill.name} className="flex flex-col items-center justify-center text-center gap-2 p-2 border rounded-lg bg-muted/30">
                                                {skillInfo ? (
                                                    <div className="relative w-20 h-20 rounded-md overflow-hidden">
                                                        <Image src={skillInfo.imagePath} alt={skill.name} fill unoptimized/>
                                                    </div>
                                                ) : (
                                                    <Skeleton className="w-20 h-20 rounded-md" />
                                                )}
                                                <span className="text-xs h-8 flex items-center">{skill.name}</span>
                                                <Badge variant="default" className="text-base">{skill.points}</Badge>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="properties" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Propriedades</CardTitle>
                                <CardDescription>Resumo dos pontos de propriedade acumulados. Clique no botão para ver o resultado final.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center h-48">
                                 <Button onClick={() => setIsPropertySummaryOpen(true)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver Resultado Final das Propriedades
                                 </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="constellation" className="mt-6">
                         <Card>
                            <CardHeader>
                                <CardTitle>Constelação</CardTitle>
                                <CardDescription>Pontos selecionados na árvore de constelação para otimizar sua build.</CardDescription>
                            </CardHeader>
                            <CardContent>
                               <ConstellationTable value={subClass.constellation} onChange={() => {}} data={constellationData} readOnly={true} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="sets" className="mt-6">
                         <Card>
                            <CardHeader>
                                <CardTitle>Conjuntos Recomendados</CardTitle>
                                <CardDescription>Estes são os conjuntos (sets) recomendados para esta build.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SetsGallery className={build.class} subClassName={subClass.name} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                     <TabsContent value="runes" className="mt-6">
                         <Card>
                            <CardHeader>
                                <CardTitle>Fragmentos de Runa</CardTitle>
                                <CardDescription>Fragmentos de runa recomendados e suas quantidades. Selecione um tier para ver.</CardDescription>
                            </CardHeader>
                            <CardContent>
                               {availableTiers.length > 0 && initialTier ? (
                                    <Tabs defaultValue={initialTier} className="w-full">
                                        <TabsList className="justify-center flex-wrap h-auto">
                                            {availableTiers.map(tier => (
                                                <TabsTrigger key={tier} value={String(tier)}>Tier {tier}</TabsTrigger>
                                            ))}
                                        </TabsList>
                                        {availableTiers.map(tier => (
                                            <TabsContent key={`content-${tier}`} value={String(tier)} className="mt-6">
                                                <ul className="space-y-3 max-w-lg mx-auto">
                                                    {(groupedRunes[tier] || []).map(rune => {
                                                        const runeData = getAvailableRunes(build.class, tier).find(r => r.name === rune.name);
                                                        const rarity = runeData?.rarity || 'common';
                                                        const colorClass = rarityColors[rarity];
                                                        return (
                                                            <li key={`${rune.tier}-${rune.name}`} className="flex items-center justify-between p-3 rounded-md bg-muted/40">
                                                                <span className={cn("font-semibold", colorClass)}>{rune.name}</span>
                                                                <Badge variant="default" className="text-base font-bold">x{rune.quantity}</Badge>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                               ) : (
                                <Alert variant="default" className="border-yellow-500/50 text-yellow-500 [&>svg]:text-yellow-500">
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Nenhuma Runa</AlertTitle>
                                    <AlertDescription>
                                        Nenhuma runa foi especificada para esta build ainda.
                                    </AlertDescription>
                                </Alert>
                               )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
