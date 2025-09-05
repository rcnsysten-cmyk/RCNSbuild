'use client';

import { BuildForm } from '@/components/admin/build-form';
import { builds } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import React from 'react';

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

  const buildClass = builds.find(
    (b) => b.class.toLowerCase() === decodedClassName.toLowerCase()
  );
  const subClass = buildClass?.subclasses.find(
    (sc) => sc.name.toLowerCase() === decodedSubClassName.toLowerCase()
  );

  if (!subClass) {
    return notFound();
  }
  
  const categoryName = categoryNames[category] || 'Categoria';


  return (
    <div className="container mx-auto px-4 py-8">
      <BuildForm
        buildData={subClass}
        category={category as any}
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
