'use client';

import { BuildForm } from '@/components/admin/build-form';
import { builds } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import React from 'react';

export default function EditBuildPage() {
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
      <h1 className="text-3xl font-bold mb-6">
        Editar Build: {decodedClassName} - {decodedSubClassName}
      </h1>
      <BuildForm
        buildData={{
          class: buildClass.class,
          ...subClass,
        }}
      />
    </div>
  );
}
