'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { MultiSelect } from '@/components/ui/multi-select';
import { SubClass, SkillConfig } from '@/lib/types';
import { Input } from '../ui/input';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { createOrUpdateBuild, updateBuild } from '@/lib/firestore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';
import Image from 'next/image';

const attributeConfigSchema = z.object({
  levelRange: z.string(),
  str: z.coerce.number().min(0, "Deve ser um número positivo."),
  agi: z.coerce.number().min(0, "Deve ser um número positivo."),
  vit: z.coerce.number().min(0, "Deve ser um número positivo."),
  ene: z.coerce.number().min(0, "Deve ser um número positivo."),
});

const skillConfigSchema = z.object({
    name: z.string(),
    points: z.coerce.number().min(0, "Deve ser um número positivo.").default(0),
});

const formSchema = z.object({
  buildName: z.string().min(1, "O nome da build é obrigatório."),
  class: z.string().min(1, "Selecione uma classe."),
  name: z.string().min(1, "Selecione uma subclasse."),
  config: z.array(attributeConfigSchema),
  runes: z.array(z.string()),
  skills: z.array(skillConfigSchema),
  properties: z.array(z.string()),
  constellation: z.array(z.string()),
  sets: z.array(z.string()),
});


type BuildFormValues = z.infer<typeof formSchema>;

interface AvailableSkill {
    name: string;
    imagePath: string;
    className: string;
}

const classSubclassMap: { [key: string]: string[] } = {
    'Dark Wizard': ['ENE', 'AGI'],
    'Dark Knight': ['STR', 'AGI'],
    'Elfa': ['ENE', 'AGI'],
    'Dark Lord': ['CMD', 'STR'],
};
const classNames = Object.keys(classSubclassMap);


const allFields: { name: keyof Omit<BuildFormValues, 'class' | 'name' | 'buildName'>; label: string; description: string, isMultiSelect?: boolean }[] = [
    { name: 'config', label: 'Atributos', description: 'Defina os pontos de atributos para cada faixa de nível.' },
    { name: 'skills', label: 'Habilidades', description: 'Defina os pontos para cada habilidade.' },
    { name: 'constellation', label: 'Constelação', description: 'Adicione os pontos da constelação.', isMultiSelect: true },
    { name: 'properties', label: 'Propriedade', description: 'Adicione as propriedades. Ex: Aumento de Dano Mágico: 20%', isMultiSelect: true },
    { name: 'sets', label: 'Conjuntos', description: 'Adicione os conjuntos (sets). Ex: Grand Soul', isMultiSelect: true },
    { name: 'runes', label: 'Runas', description: 'Adicione as runas. Ex: Runa de Energia Mística', isMultiSelect: true },
];

interface BuildFormProps {
    buildId?: string; // This will now be the build name/ID
    buildData?: SubClass;
    category?: keyof Omit<BuildFormValues, 'class' | 'name' | 'buildName'>;
    className?: string; // The character class name (e.g. 'Dark Wizard')
    children?: (form: React.ReactNode, submitButton: React.ReactNode, handleBack: () => void) => React.ReactNode;
}

const levelRanges = [
    "1-200",
    "201-300",
    "301-400",
    "401+",
];

const getLevelRangeLabel = (levelRange: string) => {
    if (levelRange === '401+') return 'Lvl 401 em diante';
    const [start, end] = levelRange.split('-');
    return `Lvl ${start} ao ${end}`;
}

const dwEneTestSkillOrder = ["Meteorito", "Pilar De Chamas", "Fogo Infernal", "Espirito Maligno", "Impulso De Mana", "Lampejo Aquatico", "Veneno Mortal", "Barreira Da Alma"];
const dwAgiTestSkillOrder = ["Lanca Venenosa", "Sensacao De Veneno", "Maldicao", "Enxame De Veneno"];
const elfaTestSkillOrder = ["Lanca Venenosa", "Sensacao De Veneno", "Maldicao", "Enxame De Veneno"];

export function BuildForm({ buildId, buildData, category, className, children }: BuildFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<AvailableSkill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  const defaultValues = React.useMemo(() => {
    const baseValues = buildData ? {
        buildName: buildId || '',
        class: className || '',
        name: buildData.name,
        config: levelRanges.map(range => {
            const existingConfig = buildData.config?.find(c => c.levelRange === range);
            return existingConfig || { levelRange: range, str: 0, agi: 0, vit: 0, ene: 0 };
        }),
        runes: buildData.runes || [],
        skills: buildData.skills || [],
        properties: buildData.properties || [],
        constellation: buildData.constellation || [],
        sets: buildData.sets || [],
      } : {
        buildName: '',
        class: '',
        name: '',
        config: levelRanges.map(range => ({ levelRange: range, str: 0, agi: 0, vit: 0, ene: 0 })),
        runes: [],
        skills: [],
        properties: [],
        constellation: [],
        sets: [],
      };
      
    if (category === 'skills' && availableSkills.length > 0) {
        const skillMap = new Map(baseValues.skills.map(s => [s.name, s.points]));
        baseValues.skills = availableSkills.map(skill => ({
            name: skill.name,
            points: skillMap.get(skill.name) || 0
        }));
    }

    return baseValues;
  }, [buildData, buildId, className, availableSkills, category]);

  const form = useForm<BuildFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    resetOptions: {
        keepDirtyValues: true,
    }
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);
  
  const selectedSubClass = form.watch('name');

  useEffect(() => {
    async function fetchSkills() {
        if (category !== 'skills' || !className || !buildData?.name) return;

        setLoadingSkills(true);
        try {
            const response = await fetch('/api/skills');
            if (!response.ok) throw new Error('Failed to fetch skills');
            const allSkills: AvailableSkill[] = await response.json();
            
            let classSkills = allSkills.filter(
                skill => skill.className.toLowerCase() === className.toLowerCase()
            );

            if (className.toLowerCase() === 'dark wizard') {
                 if (buildData.name.toLowerCase() === 'ene') {
                    const testSkillSet = new Set(dwEneTestSkillOrder);
                    classSkills = classSkills.filter(skill => testSkillSet.has(skill.name));
                    classSkills.sort((a, b) => dwEneTestSkillOrder.indexOf(a.name) - dwEneTestSkillOrder.indexOf(b.name));
                 } else if (buildData.name.toLowerCase() === 'agi') {
                    const testSkillSet = new Set(dwAgiTestSkillOrder);
                    classSkills = classSkills.filter(skill => testSkillSet.has(skill.name));
                    classSkills.sort((a, b) => dwAgiTestSkillOrder.indexOf(a.name) - dwAgiTestSkillOrder.indexOf(b.name));
                 }
            } else if (className.toLowerCase() === 'elfa') {
                const testSkillSet = new Set(elfaTestSkillOrder);
                classSkills = classSkills.filter(skill => testSkillSet.has(skill.name));

                classSkills.sort((a, b) => {
                    const indexA = elfaTestSkillOrder.indexOf(a.name);
                    const indexB = elfaTestSkillOrder.indexOf(b.name);
                    return indexA - indexB;
                });
           }

            setAvailableSkills(classSkills);
        } catch (error) {
            console.error("Failed to fetch skills:", error);
            toast({
                title: "Erro ao buscar Habilidades",
                description: "Não foi possível carregar a lista de habilidades.",
                variant: "destructive",
            });
        } finally {
            setLoadingSkills(false);
        }
    }
    fetchSkills();
  }, [category, className, buildData?.name, toast]);

  const { fields: configFields } = useFieldArray({
    control: form.control,
    name: "config",
  });

  const { fields: skillFields } = useFieldArray({
    control: form.control,
    name: "skills",
  });
  
  const { formState: { isDirty } } = form;
  const selectedClass = form.watch('class');

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);


  const handleBack = () => {
    if (isDirty) {
      setIsExitConfirmOpen(true);
    } else {
      router.back();
    }
  };

  const handleConfirmExit = (save: boolean) => {
    if (save) {
        form.handleSubmit(onSubmit)();
    } else {
        router.back();
    }
    setIsExitConfirmOpen(false);
  }

  async function onSubmit(data: BuildFormValues) {
    try {
        const dataToSave: Omit<BuildFormValues, 'skills'> & { skills: SkillConfig[] } = {
            ...data,
            skills: data.skills.filter(skill => skill.points > 0),
        };

        if (buildId) { // Editing existing build
            const updateData: Partial<SubClass> = {};
            if (category) {
              if (category === 'skills') {
                updateData.skills = dataToSave.skills;
              } else {
                (updateData as any)[category] = (dataToSave as any)[category];
              }
            }
            await updateBuild(buildId, data.name, updateData);
            toast({
                title: `Build Atualizada!`,
                description: `A build para ${data.class} - ${data.name} foi salva com sucesso.`,
              });
        } else { // Creating new build
            await createOrUpdateBuild(data.buildName, { class: data.class, name: data.name, skills: dataToSave.skills });
            toast({
                title: `Build Criada!`,
                description: `A build ${data.buildName} foi criada com sucesso.`,
              });
        }
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error("Erro ao salvar a build:", error);
      toast({
        title: "Erro ao Salvar",
        description: "Ocorreu um erro ao salvar a build. Tente novamente.",
        variant: "destructive",
      });
    }
  }

  const fieldInfo = allFields.find(f => f.name === category);
  
  const submitButton = <Button type="submit" form="build-form">Salvar Alterações</Button>;

  const formContent = (
    <>
    <AlertDialog open={isExitConfirmOpen} onOpenChange={setIsExitConfirmOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Você tem alterações não salvas!</AlertDialogTitle>
            <AlertDialogDescription>
                Você gostaria de salvar suas alterações antes de sair?
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleConfirmExit(false)}>Descartar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleConfirmExit(true)}>Salvar e Sair</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="build-form" className="space-y-8">
      {!buildData ? (
          // Form for creating a new build
          <div className="space-y-6">
             <FormField
                control={form.control}
                name="buildName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nome da Build</FormLabel>
                    <FormControl>
                        <Input placeholder="Ex: DW Ene para Farm" {...field} />
                    </FormControl>
                    <FormDescription>
                        Este nome será o identificador único da sua build.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Classe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a classe" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {classNames.map(name => (
                                <SelectItem key={name} value={name}>{name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>
                        Escolha a classe para a qual esta build se aplica.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subclasse</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedClass}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a subclasse" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {selectedClass && classSubclassMap[selectedClass] ? (
                                classSubclassMap[selectedClass].map(name => (
                                    <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))
                            ) : null}
                        </SelectContent>
                    </Select>
                  <FormDescription>
                    Escolha a especialização da build.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="submit" form="build-form">Criar Build</Button>
          </div>
        ) : (
            // Form for editing an existing build category
            <>
            {category === 'config' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {configFields.map((item, index) => (
                        <div key={item.id} className="flex flex-col gap-4 p-4 rounded-lg bg-muted/30 border border-muted/50">
                            <h3 className="text-center font-bold">{getLevelRangeLabel(item.levelRange)}</h3>
                            <div className="flex flex-col gap-2">
                                <FormField
                                    control={form.control}
                                    name={`config.${index}.str`}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between">
                                            <FormLabel>FOR</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="bg-transparent border-0 text-right w-auto max-w-24" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`config.${index}.agi`}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between">
                                            <FormLabel>AGI</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="bg-transparent border-0 text-right w-auto max-w-24" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`config.${index}.vit`}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between">
                                            <FormLabel>VIT</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="bg-transparent border-0 text-right w-auto max-w-24" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`config.${index}.ene`}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between">
                                            <FormLabel>ENE</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="bg-transparent border-0 text-right w-auto max-w-24" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : category === 'skills' ? (
                <div className="space-y-4">
                     <FormDescription>
                        {fieldInfo?.description}
                    </FormDescription>
                    {loadingSkills ? (
                        <div className="grid grid-cols-4 gap-1">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <Skeleton className="h-20 w-20 rounded-md" />
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-8 w-20" />
                                </div>
                             ))}
                        </div>
                    ) : (
                    <ScrollArea className="h-[550px] pr-4">
                      <div className="grid grid-cols-4 gap-1 p-4 border border-input rounded-md">
                            {skillFields.map((item, index) => {
                                const skillInfo = availableSkills.find(s => s.name === item.name);
                                if (!skillInfo) return null;
                                return (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name={`skills.${index}.points`}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-center justify-start p-2 rounded-md bg-card">
                                            <div className="w-20 h-20 rounded-md overflow-hidden relative">
                                                <Image
                                                    src={skillInfo.imagePath}
                                                    alt={item.name}
                                                    width={80}
                                                    height={80}
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                            <FormLabel className="text-center text-xs h-8 leading-tight">
                                                {item.name}
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    {...field} 
                                                    className="w-20 h-8 text-center px-1"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                );
                            })}
                        </div>
                    </ScrollArea>
                    )}
                </div>
            ) : fieldInfo ? (
                <FormField
                    control={form.control}
                    name={fieldInfo.name as any}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{fieldInfo.label}</FormLabel>
                            <FormControl>
                                {fieldInfo.isMultiSelect ? (
                                    <MultiSelect
                                        selected={field.value as string[]}
                                        onChange={field.onChange}
                                        placeholder={`Adicione ${fieldInfo.label.toLowerCase()}...`}
                                        className="min-h-48"
                                        itemType={'text'}
                                        classNameProp={className}
                                    />
                                ) : null}
                            </FormControl>
                            <FormDescription>
                                {fieldInfo.description}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ) : null}
            </>
        )}

      </form>
    </Form>
    </>
  );

  if (children) {
    return children(formContent, submitButton, handleBack);
  }

  return formContent;
}

    