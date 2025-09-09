'use client';

import { BuildForm } from '@/components/admin/build-form';
import { getBuildByClassName } from '@/lib/firestore';
import { Build, SubClass } from '@/lib/types';
import { notFound, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const validCategories = ['config', 'skills', 'constellation', 'properties', 'sets', 'runes'];

const categoryNames: { [key: string]: string } = {
    config: 'Atributos',
    skills: 'Habilidades',
    constellation: 'Constelação',
    properties: 'Propriedade',
    sets: 'Conjuntos',
    runes: 'Runas',
};

export default function EditCategoryPage() {
  const params = useParams();
  const { className, subClassName, category } = params;

  const [build, setBuild] = useState<Build | null>(null);
  const [subClass, setSubClass] = useState<SubClass | null>(null);
  const [loading, setLoading] = useState(true);

  if (
    !className || 
    !subClassName || 
    !category || 
    typeof category !== 'string' || 
    !validCategories.includes(category)
  ) {
    return notFound();
  }
  
  const decodedClassName = decodeURIComponent(className as string);
  const decodedSubClassName = decodeURIComponent(subClassName as string);

  useEffect(() => {
    const fetchBuild = async () => {
        const buildData = await getBuildByClassName(decodedClassName);
        if (buildData) {
            setBuild(buildData);
            const foundSubClass = buildData.subclasses.find(
              (sc) => sc.name.toLowerCase() === decodedSubClassName.toLowerCase()
            );
            if (foundSubClass) {
              setSubClass(foundSubClass);
            } else {
              notFound();
            }
        } else {
            notFound();
        }
        setLoading(false);
    };
    fetchBuild();
  }, [decodedClassName, decodedSubClassName]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-10 w-96 mb-2" />
            <Skeleton className="h-6 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!subClass || !build) {
    return notFound();
  }
  
  const categoryName = categoryNames[category] || 'Categoria';

  return (
    <div className="relative">
      <BuildForm
        buildData={subClass}
        buildId={build.id}
        category={category as any}
        className={build.class}
      >
        {(form, submitButton, handleBack) => (
          <>
            <div className="sticky top-0 z-10 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-6">
              <div className="container flex h-16 items-center justify-between">
                <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
                {submitButton}
              </div>
            </div>
            
            <div className="container mx-auto px-4 py-8 pt-0">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">
                            Editando {categoryName}: {decodedClassName} - {decodedSubClassName}
                        </h1>
                        <p className="text-muted-foreground mt-2">Adicione ou remova os itens abaixo.</p>
                    </div>
                    {form}
                </div>
            </div>
          </>
        )}
      </BuildForm>
    </div>
  );
}
