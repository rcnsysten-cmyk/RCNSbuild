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
import { SubClass } from '@/lib/types';
import { Input } from '../ui/input';
import React from 'react';
import { Button } from '../ui/button';
import { createOrUpdateBuild, updateBuild } from '@/lib/firestore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const attributeConfigSchema = z.object({
  levelRange: z.string(),
  str: z.coerce.number().min(0, "Deve ser um número positivo."),
  agi: z.coerce.number().min(0, "Deve ser um número positivo."),
  vit: z.coerce.number().min(0, "Deve ser um número positivo."),
  ene: z.coerce.number().min(0, "Deve ser um número positivo."),
});

const formSchema = z.object({
  buildName: z.string().min(1, "O nome da build é obrigatório."),
  class: z.string().min(1, "Selecione uma classe."),
  name: z.string().min(1, "Selecione uma subclasse."),
  config: z.array(attributeConfigSchema),
  runes: z.array(z.string()),
  skills: z.array(z.string()),
  properties: z.array(z.string()),
  constellation: z.array(z.string()),
  sets: z.array(z.string()),
});


type BuildFormValues = z.infer<typeof formSchema>;

const classSubclassMap: { [key: string]: string[] } = {
    'Dark Wizard': ['ENE', 'AGI'],
    'Dark Knight': ['STR', 'AGI'],
    'Elfa': ['ENE', 'AGI'],
    'Dark Lord': ['CMD', 'STR'],
};
const classNames = Object.keys(classSubclassMap);


const allFields: { name: keyof Omit<BuildFormValues, 'class' | 'name' | 'buildName'>; label: string; description: string, isMultiSelect?: boolean }[] = [
    { name: 'config', label: 'Atributos', description: 'Defina os pontos de atributos para cada faixa de nível.' },
    { name: 'skills', label: 'Habilidades', description: 'Adicione as habilidades. Ex: Evil Spirit', isMultiSelect: true },
    { name: 'constellation', label: 'Constelação', description: 'Adicione os pontos da constelação.', isMultiSelect: true },
    { name: 'properties', label: 'Propriedade', description: 'Adicione as propriedades. Ex: Aumento de Dano Mágico: 20%', isMultiSelect: true },
    { name: 'sets', label: 'Conjuntos', description: 'Adicione os conjuntos (sets). Ex: Grand Soul', isMultiSelect: true },
    { name: 'runes', label: 'Runas', description: 'Adicione as runas. Ex: Runa de Energia Mística', isMultiSelect: true },
];

interface BuildFormProps {
    buildId?: string; // This will now be the className
    buildData?: SubClass;
    category?: keyof Omit<BuildFormValues, 'class' | 'name' | 'buildName'>;
    className?: string;
    children?: (form: React.ReactNode, submitButton: React.ReactNode) => React.ReactNode;
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

export function BuildForm({ buildId, buildData, category, className, children }: BuildFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const defaultValues: BuildFormValues = buildData ? {
    buildName: className || '',
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

  const form = useForm<BuildFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "config",
  });
  
  const selectedClass = form.watch('class');

  async function onSubmit(data: BuildFormValues) {
    try {
        if (buildId && className) { // Editing existing build
            await updateBuild(className, data.name, data);
            toast({
                title: `Build Atualizada!`,
                description: `A build para ${data.class} - ${data.name} foi salva com sucesso.`,
              });
        } else { // Creating new build
            await createOrUpdateBuild(data.buildName, { class: data.class, ...data });
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
                        <Input placeholder="Ex: Dark Wizard de Energia" {...field} />
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
                    {fields.map((item, index) => (
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
                                                <Input type="number" {...field} className="bg-transparent border-0 text-right" />
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
                                                <Input type="number" {...field} className="bg-transparent border-0 text-right" />
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
                                                <Input type="number" {...field} className="bg-transparent border-0 text-right" />
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
                                                <Input type="number" {...field} className="bg-transparent border-0 text-right" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    ))}
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
                                        itemType={fieldInfo.name === 'skills' ? 'skill' : 'text'}
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
  );

  if (children) {
    return children(formContent, submitButton);
  }

  return formContent;
}
