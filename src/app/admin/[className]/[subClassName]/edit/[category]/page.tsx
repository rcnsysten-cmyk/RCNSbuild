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
  const { className, subClassName, category } = params; // className is buildId
  
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
  
  const buildId = decodeURIComponent(className as string);
  const decodedSubClassName = decodeURIComponent(subClassName as string);

  useEffect(() => {
    const fetchBuilds = async () => {
        const buildData = await getBuildById(buildId);
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
  }, [buildId, decodedSubClassName]);

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
                            Editando {categoryName}: {build.class} - {decodedSubClassName}
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
