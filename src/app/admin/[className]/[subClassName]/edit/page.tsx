'use client';

import { BuildForm } from '@/components/admin/build-form';
import { builds } from '@/lib/data';
import { notFound } from 'next/navigation';

export default function EditBuildPage({
  params,
}: {
  params: { className: string; subClassName: string };
}) {
  const buildClass = builds.find(
    (b) => b.class.toLowerCase() === decodeURIComponent(params.className).toLowerCase()
  );
  const subClass = buildClass?.subclasses.find(
    (sc) => sc.name.toLowerCase() === decodeURIComponent(params.subClassName).toLowerCase()
  );

  if (!subClass) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Editar Build: {decodeURIComponent(params.className)} - {decodeURIComponent(params.subClassName)}
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
