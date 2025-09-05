'use client';

import { BuildForm } from '@/components/admin/build-form';
import { getBuildByClassName } from '@/lib/firestore';
import { Build, SubClass } from '@/lib/types';
import { notFound, useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
  const router = useRouter();
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
  }, [decodedClassName, decodedSubClassName, router]);

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
    <div className="container mx-auto px-4 py-8">
      <BuildForm
        buildData={subClass}
        buildId={build.id} // buildId is now the className
        category={category as any}
        className={build.class}
      >
        {(form, submitButton) => (
          <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Editando {categoryName}: {decodedClassName} - {decodedSubClassName}
                    </h1>
                    <p className="text-muted-foreground mt-2">Adicione ou remova os itens abaixo.</p>
                </div>
                {submitButton}
            </div>
            {form}
          </>
        )}
      </BuildForm>
    </div>
  );
}
