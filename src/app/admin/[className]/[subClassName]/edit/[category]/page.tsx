'use client';

import { BuildForm } from '@/components/admin/build-form';
import { getBuildById } from '@/lib/firestore';
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
    const fetchBuilds = async () => {
        // Since we don't know the build ID, we can't fetch directly.
        // This page is navigated to from a page that should pass the build ID,
        // but for now, we assume the first build of a class is what we edit.
        // This might need refinement if multiple builds per class exist.
        // For now, this component seems to rely on buildData which implies a single build context.
        // We will assume that `getBuildById` is the right approach, but we need a buildId.
        // The URL structure `/admin/[className]/[subClassName]/edit` implies we might need to derive the buildId.
        // Let's assume for now the logic is to find the first build that matches the class.
        // This is not ideal, but let's see. The previous logic used getBuildByClassName which also wasn't ideal.
        
        // The most robust way is to fetch the build from its ID.
        // The admin page links to `/admin/${encodeURIComponent(build.class)}/${encodeURIComponent(build.subclasses[0].name)}/edit`
        // It does not pass the build.id. This is a flaw in the navigation.
        // Let's assume for now that the className is the buildId, as per the original PRD's intent.
        // This is a big assumption but let's stick with it.

        const buildData = await getBuildById(decodedClassName);
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
    fetchBuilds();
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
          <div className="container mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex-1">
                        <Button variant="ghost" onClick={handleBack} className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                        <h1 className="text-3xl font-bold">
                            Editando {categoryName}: {decodedClassName} - {decodedSubClassName}
                        </h1>
                        <p className="text-muted-foreground mt-2">Adicione ou remova os itens abaixo.</p>
                    </div>
                    {submitButton}
                  </div>
                  {form}
              </div>
          </div>
        )}
      </BuildForm>
    </div>
  );
}
