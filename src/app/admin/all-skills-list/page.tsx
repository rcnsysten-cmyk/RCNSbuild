'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Skill {
  name: string;
  imagePath: string;
  className: string;
}

interface GroupedSkills {
  [className: string]: string[];
}

export default function AllSkillsListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [groupedSkills, setGroupedSkills] = useState<GroupedSkills>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch('/api/skills');
        if (!response.ok) {
          throw new Error('Failed to fetch skills');
        }
        const data: Skill[] = await response.json();
        const groups: GroupedSkills = {};
        for (const skill of data) {
          if (!groups[skill.className]) {
            groups[skill.className] = [];
          }
          groups[skill.className].push(skill.name);
        }
        // Sort skills alphabetically within each class
        for (const className in groups) {
            groups[className].sort((a, b) => a.localeCompare(b));
        }
        setGroupedSkills(groups);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado!',
      description: 'A lista de habilidades foi copiada para a área de transferência.',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="flex items-center mb-2">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
        </Button>
        <h1 className="text-3xl font-bold">Lista de Nomes de Habilidades</h1>
      </div>
      <p className="text-muted-foreground mb-6 ml-16">
        Use esta página para copiar os nomes exatos das habilidades para usar na ordenação.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({length: 4}).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </CardContent>
                </Card>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedSkills).map(([className, skills]) => (
            <Card key={className}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{className}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(skills, null, 2))}>
                  Copiar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                    {skills.map((skillName) => (
                        <Badge variant="secondary" key={skillName} className="font-mono">
                            {skillName}
                        </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
