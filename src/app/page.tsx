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
import { getBuilds } from '@/lib/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
  'Dark Wizard': DwIcon,
  'Dark Knight': DkIcon,
  Elfa: ElfaIcon,
  'Dark Lord': DlIcon,
};

// Group builds by class
const groupBuildsByClass = (builds: Build[]): { [key: string]: Build[] } => {
    return builds.reduce((acc, build) => {
        if (!acc[build.class]) {
            acc[build.class] = [];
        }
        acc[build.class].push(build);
        return acc;
    }, {} as { [key: string]: Build[] });
};


export default function Home() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getBuilds((data) => {
      setBuilds(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const groupedBuilds = groupBuildsByClass(builds);
  const uniqueClasses = Object.keys(groupedBuilds);

  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-headline">
              Bem-vindo ao MuBuilds
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Seu guia definitivo para as melhores builds de Mu Online. Navegue pelas classes abaixo para encontrar a build perfeita para seu personagem.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="flex flex-col text-center items-center justify-center p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
                <CardHeader className="items-center">
                    <Skeleton className="h-12 w-12 rounded-full mb-4" />
                    <Skeleton className="h-8 w-32 mb-2" />
                </CardHeader>
                <CardContent className="flex flex-col flex-grow items-center justify-center pt-6">
                    <Skeleton className="h-10 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {uniqueClasses.map((className) => {
              const Icon = iconMap[className];
              const classBuilds = groupedBuilds[className];
              const buildCount = classBuilds.length;

              return (
                <Link key={className} href={`/builds/${encodeURIComponent(className)}`} passHref>
                  <Card className="flex flex-col text-center items-center justify-between p-6 h-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 cursor-pointer">
                    <CardHeader className="items-center">
                      {Icon && <Icon className="h-12 w-12 mb-4 text-primary" />}
                      <CardTitle className="text-2xl font-bold">
                        {className}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-center justify-center">
                      <p className="text-muted-foreground">{buildCount} build{buildCount > 1 ? 's' : ''} disponível{buildCount > 1 ? 's' : ''}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
