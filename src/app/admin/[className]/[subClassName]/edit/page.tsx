'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { builds } from '@/lib/data';
import { ChevronRight, Dna, Gem, ListTree, ShieldCheck, Swords, Star } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

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
    const { className, subClassName } = params;

    if (!className || !subClassName) {
        return notFound();
    }

    const decodedClassName = decodeURIComponent(className as string);
    const decodedSubClassName = decodeURIComponent(subClassName as string);

    const buildClass = builds.find(
        (b) => b.class.toLowerCase() === decodedClassName.toLowerCase()
    );
    const subClass = buildClass?.subclasses.find(
        (sc) => sc.name.toLowerCase() === decodedSubClassName.toLowerCase()
    );

    if (!subClass) {
        return notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">
                Editar Build: {decodedClassName} - {decodedSubClassName}
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
