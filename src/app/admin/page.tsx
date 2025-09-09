'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Build } from '@/lib/types';
import Link from 'next/link';
import { DkIcon, DlIcon, DwIcon, ElfaIcon } from '@/components/icons';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { getBuilds } from '@/lib/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap: { [key: string]: React.ElementType } = {
  'Dark Wizard': DwIcon,
  'Dark Knight': DkIcon,
  Elfa: ElfaIcon,
  'Dark Lord': DlIcon,
};

export default function AdminPage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getBuilds((data) => {
      setBuilds(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Painel do Administrador</h1>
        <Button asChild>
          <Link href="/admin/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Build
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
             <Card key={i} className="flex flex-col text-center">
               <CardHeader className="items-center">
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
               </CardHeader>
               <CardContent className="flex flex-col flex-grow items-center justify-center pt-6">
                  <Skeleton className="h-10 w-3/4" />
               </CardContent>
             </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {builds.map((build) => {
            const Icon = iconMap[build.class];
            const subClassNames = build.subclasses.map(sc => sc.name).join(', ');

            return (
              <Card key={build.id} className="flex flex-col text-center">
                <CardHeader className="items-center">
                  <CardTitle className="flex items-center gap-2">
                    {Icon && <Icon className="h-6 w-6" />}
                    {build.id}
                  </CardTitle>
                  <CardDescription>
                    {build.class} - {subClassNames}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow items-center justify-center pt-6">
                    <Button
                        className="w-full max-w-xs"
                        asChild
                    >
                        <Link
                        href={`/admin/${encodeURIComponent(
                            build.id
                        )}/${encodeURIComponent(build.subclasses[0].name)}/edit`}
                        >
                        Editar
                        </Link>
                    </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
