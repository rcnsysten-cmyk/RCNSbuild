import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { builds } from '@/lib/data';
import Link from 'next/link';
import { DkIcon, DlIcon, DwIcon, ElfaIcon } from '@/components/icons';
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
  DW: DwIcon,
  DK: DkIcon,
  Elfa: ElfaIcon,
  DL: DlIcon,
};

export default function AdminPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {builds.map((build) => {
          const Icon = iconMap[build.class];
          return (
            <Card key={build.class} className="flex flex-col text-center">
              <CardHeader className="items-center">
                <CardTitle className="flex items-center gap-2">
                  {Icon && <Icon className="h-6 w-6" />}
                  {build.class}
                </CardTitle>
                <CardDescription>
                  Selecione uma subclasse para editar.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow items-center">
                <div className="space-y-2 w-full max-w-xs">
                  {build.subclasses.map((subClass) => (
                    <Button
                      key={subClass.name}
                      variant="outline"
                      className="w-full justify-center"
                      asChild
                    >
                      <Link
                        href={`/admin/${encodeURIComponent(
                          build.class
                        )}/${encodeURIComponent(subClass.name)}/edit`}
                      >
                        {subClass.name}
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
