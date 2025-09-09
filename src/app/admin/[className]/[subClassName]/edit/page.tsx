'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBuildById } from '@/lib/firestore';
import { Build } from '@/lib/types';
import { ChevronRight, Dna, Gem, ListTree, ShieldCheck, Swords, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const categoryMap = [
    { id: 'config', name: 'Atributos', icon: Dna },
    { id: 'skills', name: 'Habilidades', icon: Swords },
    { id: 'constellation', name: 'Constelação', icon: Star },
    { id: 'properties', name: 'Propriedade', icon: ListTree },
    { id: 'sets', name: 'Conjuntos', icon: ShieldCheck },
    { id: 'runes', name: 'Runas', icon: Gem },
];

export default function EditBuildCategorySelectionPage() {
    const params = useParams();
    const router = useRouter();
    const { className, subClassName } = params; // className is now buildId

    const [build, setBuild] = useState<Build | null>(null);
    const [loading, setLoading] = useState(true);

    if (!className || !subClassName) {
        return notFound();
    }

    const buildId = decodeURIComponent(className as string);
    const decodedSubClassName = decodeURIComponent(subClassName as string);

    useEffect(() => {
        const fetchBuild = async () => {
            const buildData = await getBuildById(buildId);
            if (buildData) {
                setBuild(buildData);
            } else {
                notFound();
            }
            setLoading(false);
        };
        fetchBuild();
    }, [buildId]);
    
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-10 w-1/2 mb-2" />
                <Skeleton className="h-6 w-1/3 mb-6" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/4" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const subClass = build?.subclasses.find(
        (sc) => sc.name.toLowerCase() === decodedSubClassName.toLowerCase()
    );

    if (!subClass || !build) {
        return notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Button>
            <h1 className="text-3xl font-bold mb-2">
                Editar Build: {build.class} - {decodedSubClassName}
            </h1>
            <p className="text-muted-foreground mb-6">Selecione uma categoria para editar.</p>
            <Card>
                <CardHeader>
                    <CardTitle>Categorias</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryMap.map((category) => {
                            const Icon = category.icon;
                            return (
                                <Button
                                    key={category.id}
                                    variant="outline"
                                    className="w-full justify-between p-6 text-lg"
                                    asChild
                                >
                                    <Link href={`/admin/${className}/${subClassName}/edit/${category.id}`}>
                                        <div className="flex items-center gap-4">
                                            <Icon className="h-6 w-6" />
                                            <span>{category.name}</span>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    </Link>
                                </Button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
