'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBuilds } from '@/lib/firestore';
import { Build } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BuildCard } from '@/components/build-card';
import { DkIcon, DlIcon, DwIcon, ElfaIcon } from '@/components/icons';

const iconMap: { [key: string]: React.ElementType } = {
  'Dark Wizard': DwIcon,
  'Dark Knight': DkIcon,
  Elfa: ElfaIcon,
  'Dark Lord': DlIcon,
};

export default function ClassBuildsPage() {
  const params = useParams();
  const router = useRouter();
  const className = decodeURIComponent(params.className as string);
  
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getBuilds((data) => {
      const filteredBuilds = data.filter(build => build.class === className);
      setBuilds(filteredBuilds);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [className]);

  const Icon = iconMap[className];

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-2">
            <Button variant="ghost" onClick={() => router.push('/')} className="mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Button>
            <div className="flex items-center gap-3">
                {Icon && <Icon className="h-8 w-8 text-primary" />}
                <h1 className="text-3xl font-bold">{className}</h1>
            </div>
        </div>
        <p className="text-muted-foreground mb-8 ml-16">
            Explore as builds disponíveis para esta classe.
        </p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
             <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builds.map((build) => (
            <BuildCard key={build.id} build={build} />
          ))}
        </div>
      )}
       {builds.length === 0 && !loading && (
        <div className="text-center py-16 text-muted-foreground">
            <p>Nenhuma build encontrada para esta classe ainda.</p>
        </div>
       )}
    </div>
  );
}