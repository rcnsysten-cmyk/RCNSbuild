'use client';

import type { Build, SubClass } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useMemo, useState, useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { translateBuildInfo } from '@/ai/flows/translate-build-info';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Gem, Swords, ShieldCheck, Settings, BrainCircuit } from 'lucide-react';
import { DkIcon, DlIcon, DwIcon, ElfaIcon } from './icons';

type Language = 'Portuguese' | 'English' | 'Spanish';

function OriginalView({ build }: { build: SubClass }) {
  const details = [
    { title: 'Runas', icon: <Gem className="h-5 w-5 text-accent" />, content: build.runes },
    { title: 'Habilidades', icon: <Swords className="h-5 w-5 text-accent" />, content: build.skills },
    { title: 'Propriedades', icon: <ShieldCheck className="h-5 w-5 text-accent" />, content: build.properties },
    { title: 'Configuração', icon: <Settings className="h-5 w-5 text-accent" />, content: build.config },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {details.map((detail) => (
        <Card key={detail.title}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {detail.icon}
              {detail.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              {detail.content.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TranslatedView({ content }: { content: string | null }) {
  if (!content) return null;
  return (
    <Card className="mt-6">
       <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-accent" />
          Tradução da Build
        </CardTitle>
        <CardDescription>Esta tradução foi gerada por IA e pode conter imprecisões.</CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap font-body text-sm text-muted-foreground">{content}</pre>
      </CardContent>
    </Card>
  );
}

const iconMap: { [key: string]: React.ReactNode } = {
  DW: <DwIcon />,
  DK: <DkIcon />,
  Elfa: <ElfaIcon />,
  DL: <DlIcon />,
};

export function BuildDisplay({ builds }: { builds: Build[] }) {
  const [activeClass, setActiveClass] = useState(builds[0].class);
  const [activeSubClass, setActiveSubClass] = useState(
    builds[0].subclasses[0].name
  );
  const [language, setLanguage] = useState<Language>('Portuguese');
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const currentBuildData = useMemo(() => {
    return builds
      .find((b) => b.class === activeClass)
      ?.subclasses.find((sc) => sc.name === activeSubClass);
  }, [builds, activeClass, activeSubClass]);

  const textToTranslate = useMemo(() => {
    if (!currentBuildData) return '';
    return `
### Build para ${currentBuildData.name}

#### Runas
${currentBuildData.runes.map((r) => `- ${r}`).join('\n')}

#### Habilidades
${currentBuildData.skills.map((s) => `- ${s}`).join('\n')}

#### Propriedades
${currentBuildData.properties.map((p) => `- ${p}`).join('\n')}

#### Configuração
${currentBuildData.config.map((c) => `- ${c}`).join('\n')}
      `;
  }, [currentBuildData]);

  useEffect(() => {
    if (language === 'Portuguese' || !textToTranslate) {
      setTranslatedContent(null);
      return;
    }

    startTransition(async () => {
      try {
        const result = await translateBuildInfo({
          text: textToTranslate,
          language: language,
        });
        setTranslatedContent(result.translatedText);
      } catch (error) {
        console.error('Translation failed', error);
        toast({
          variant: 'destructive',
          title: 'Erro de Tradução',
          description: 'Não foi possível traduzir as informações da build.',
        });
        setTranslatedContent('Falha na tradução.');
      }
    });
  }, [language, textToTranslate, toast]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Select
          value={language}
          onValueChange={(value: Language) => setLanguage(value)}
        >
          <SelectTrigger className="w-[180px] bg-card">
            <SelectValue placeholder="Idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Portuguese">Português</SelectItem>
            <SelectItem value="English">Inglês</SelectItem>
            <SelectItem value="Spanish">Espanhol</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs
        defaultValue={builds[0].class}
        onValueChange={(value) => {
          setActiveClass(value);
          const firstSubClass = builds.find(b => b.class === value)?.subclasses[0].name;
          if(firstSubClass) setActiveSubClass(firstSubClass);
        }}
      >
        <TabsList className="grid w-full grid-cols-4">
          {builds.map((build) => (
            <TabsTrigger
              key={build.class}
              value={build.class}
              className="flex gap-2 items-center"
            >
              <div className="h-5 w-5">{iconMap[build.class]}</div>
              {build.class}
            </TabsTrigger>
          ))}
        </TabsList>

        {builds.map((build) => (
          <TabsContent key={build.class} value={build.class}>
            <Tabs
              defaultValue={build.subclasses[0].name}
              value={activeSubClass}
              onValueChange={setActiveSubClass}
              className="mt-4"
            >
              <TabsList>
                {build.subclasses.map((subclass) => (
                  <TabsTrigger key={subclass.name} value={subclass.name}>
                    {subclass.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {build.subclasses.map((subclass) => (
                <TabsContent key={subclass.name} value={subclass.name}>
                  {isPending ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                     </div>
                  ) : language !== 'Portuguese' && translatedContent ? (
                    <TranslatedView content={translatedContent} />
                  ) : (
                    <OriginalView build={subclass} />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
