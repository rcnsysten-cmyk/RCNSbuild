'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, List } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface Skill {
  name: string;
  imagePath: string;
  className: string;
}

export default function SkillsGalleryPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch('/api/skills');
        if (!response.ok) {
          throw new Error('Failed to fetch skills');
        }
        const data: Skill[] = await response.json();
        setSkills(data);
        setFilteredSkills(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  useEffect(() => {
    const results = skills.filter((skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.className.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSkills(results);
  }, [searchTerm, skills]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Button>
            <h1 className="text-3xl font-bold">Galeria de Habilidades</h1>
          </div>
          <p className="text-muted-foreground mb-6 ml-16">
            Busque e visualize as habilidades disponíveis.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/all-skills-list">
            <List className="mr-2 h-4 w-4" />
            Ver Lista de Nomes
          </Link>
        </Button>
      </div>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Buscar por nome da skill ou classe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <ScrollArea className="h-[600px] w-full rounded-md border p-4">
        {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <Skeleton className="h-20 w-20 rounded-md" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredSkills.map((skill) => (
                <div
                key={`${skill.className}-${skill.name}`}
                className="flex flex-col items-center justify-center gap-2 p-2 rounded-md hover:bg-muted"
                >
                <Image
                    src={skill.imagePath}
                    alt={skill.name}
                    width={80}
                    height={80}
                    className="rounded-md"
                    unoptimized
                />
                <span className="text-sm text-center font-medium truncate w-full">
                    {skill.name}
                </span>
                <span className="text-xs text-muted-foreground">{skill.className}</span>
                </div>
            ))}
            </div>
        )}
      </ScrollArea>
    </div>
  );
}
