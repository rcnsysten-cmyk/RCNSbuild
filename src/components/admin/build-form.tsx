'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
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
import { AttributeConfig, SubClass } from '@/lib/data';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const attributeConfigSchema = z.object({
  levelRange: z.string(),
  str: z.coerce.number().min(0, "Deve ser um número positivo."),
  agi: z.coerce.number().min(0, "Deve ser um número positivo."),
  vit: z.coerce.number().min(0, "Deve ser um número positivo."),
  ene: z.coerce.number().min(0, "Deve ser um número positivo."),
});

const formSchema = z.object({
  config: z.array(attributeConfigSchema),
  runes: z.array(z.string()),
  skills: z.array(z.string()),
  properties: z.array(z.string()),
  constellation: z.array(z.string()),
  sets: z.array(z.string()),
});

type BuildFormValues = z.infer<typeof formSchema>;

const allFields: { name: keyof BuildFormValues; label: string; description: string, isMultiSelect?: boolean }[] = [
    { name: 'config', label: 'Atributos', description: 'Defina os pontos de atributos para cada faixa de nível.' },
    { name: 'skills', label: 'Habilidades', description: 'Adicione as habilidades. Ex: Evil Spirit', isMultiSelect: true },
    { name: 'constellation', label: 'Constelação', description: 'Adicione os pontos da constelação.', isMultiSelect: true },
    { name: 'properties', label: 'Propriedade', description: 'Adicione as propriedades. Ex: Aumento de Dano Mágico: 20%', isMultiSelect: true },
    { name: 'sets', label: 'Conjuntos', description: 'Adicione os conjuntos (sets). Ex: Grand Soul', isMultiSelect: true },
    { name: 'runes', label: 'Runas', description: 'Adicione as runas. Ex: Runa de Energia Mística', isMultiSelect: true },
];

interface BuildFormProps {
    buildData: SubClass;
    category: keyof Omit<BuildFormValues, 'class' | 'name'>;
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

export function BuildForm({ buildData, category }: BuildFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const defaultValues = {
    ...buildData,
    config: levelRanges.map(range => {
        const existingConfig = buildData.config.find(c => c.levelRange === range);
        return existingConfig || { levelRange: range, str: 0, agi: 0, vit: 0, ene: 0 };
    })
  };

  const form = useForm<BuildFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "config",
  });

  function onSubmit(data: BuildFormValues) {
    console.log('Dados do formulário:', data);

    toast({
      title: `Build Atualizada (Simulação)`,
      description: `A build para ${buildData.name} foi salva com sucesso.`,
    });
    router.back();
  }

  const fieldInfo = allFields.find(f => f.name === category);

  if (!fieldInfo) {
    return <div>Categoria de formulário inválida.</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {category === 'config' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {fields.map((item, index) => (
               <Card key={item.id}>
                 <CardHeader>
                   <CardTitle>{getLevelRangeLabel(item.levelRange)}</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`config.${index}.str`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-4">
                            <FormLabel className="w-8">FOR</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="max-w-[120px] border-border" />
                            </FormControl>
                          </div>
                          <FormMessage className="ml-12" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`config.${index}.agi`}
                      render={({ field }) => (
                        <FormItem>
                           <div className="flex items-center gap-4">
                            <FormLabel className="w-8">AGI</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="max-w-[120px] border-border" />
                            </FormControl>
                          </div>
                          <FormMessage className="ml-12" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`config.${index}.vit`}
                      render={({ field }) => (
                        <FormItem>
                           <div className="flex items-center gap-4">
                            <FormLabel className="w-8">VIT</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="max-w-[120px] border-border" />
                            </FormControl>
                          </div>
                          <FormMessage className="ml-12" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`config.${index}.ene`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-4">
                            <FormLabel className="w-8">ENE</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="max-w-[120px] border-border" />
                            </FormControl>
                          </div>
                          <FormMessage className="ml-12" />
                        </FormItem>
                      )}
                    />
                 </CardContent>
               </Card>
             ))}
           </div>
        ) : (
            <FormField
                control={form.control}
                name={fieldInfo.name as keyof BuildFormValues}
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
        )}
        <Button type="submit">Salvar Alterações</Button>
      </form>
    </Form>
  );
}
