'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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

const formSchema = z.object({
  class: z.string().min(1, 'A classe é obrigatória.'),
  name: z.string().min(1, 'O nome da sub-classe é obrigatório.'),
  runes: z.array(z.string()).min(1, 'As runas são obrigatórias.'),
  skills: z.array(z.string()).min(1, 'As habilidades são obrigatórias.'),
  properties: z.array(z.string()).min(1, 'As propriedades são obrigatórias.'),
  config: z.array(z.string()).min(1, 'Os atributos são obrigatórios.'),
  constellation: z.array(z.string()).min(1, 'A constelação é obrigatória.'),
  sets: z.array(z.string()).min(1, 'Os conjuntos são obrigatórios.'),
});

type BuildFormValues = z.infer<typeof formSchema>;

const allFields: { name: keyof BuildFormValues; label: string; description: string, isMultiSelect?: boolean }[] = [
    { name: 'config', label: 'Atributos', description: 'Adicione os pontos de atributos. Ex: Força: 1000', isMultiSelect: true },
    { name: 'skills', label: 'Habilidades', description: 'Adicione as habilidades. Ex: Evil Spirit', isMultiSelect: true },
    { name: 'constellation', label: 'Constelação', description: 'Adicione os pontos da constelação.', isMultiSelect: true },
    { name: 'properties', label: 'Propriedades', description: 'Adicione as propriedades. Ex: Aumento de Dano Mágico: 20%', isMultiSelect: true },
    { name: 'sets', label: 'Conjuntos', description: 'Adicione os conjuntos (sets). Ex: Grand Soul', isMultiSelect: true },
    { name: 'runes', label: 'Runas', description: 'Adicione as runas. Ex: Runa de Energia Mística', isMultiSelect: true },
];

interface BuildFormProps {
    buildData?: {
        class: string;
        name: string;
        runes: string[];
        skills: string[];
        properties: string[];
        config: string[];
        constellation: string[];
        sets: string[];
    };
    category: keyof Omit<BuildFormValues, 'class' | 'name'>;
}

export function BuildForm({ buildData, category }: BuildFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditing = !!buildData;

  const defaultValues = buildData ? buildData : {
    class: '',
    name: '',
    runes: [],
    skills: [],
    properties: [],
    config: [],
    constellation: [],
    sets: [],
  };

  const form = useForm<BuildFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(data: BuildFormValues) {
    console.log('Dados do formulário:', data);

    toast({
      title: `Build ${isEditing ? 'Atualizada' : 'Criada'} (Simulação)`,
      description: `A build para ${data.class} - ${data.name} foi salva com sucesso.`,
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
        <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Criar Build'}</Button>
      </form>
    </Form>
  );
}
