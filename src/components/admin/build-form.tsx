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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { builds } from '@/lib/data';

const formSchema = z.object({
  class: z.string().min(1, 'A classe é obrigatória.'),
  name: z.string().min(1, 'O nome da sub-classe é obrigatório.'),
  runes: z.string().min(1, 'As runas são obrigatórias.'),
  skills: z.string().min(1, 'As habilidades são obrigatórias.'),
  properties: z.string().min(1, 'As propriedades são obrigatórias.'),
  config: z.string().min(1, 'A configuração é obrigatória.'),
});

type BuildFormValues = z.infer<typeof formSchema>;

interface BuildFormProps {
    buildData?: {
        class: string;
        name: string;
        runes: string;
        skills: string;
        properties: string;
        config: string;
    }
}

export function BuildForm({ buildData }: BuildFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditing = !!buildData;

  const defaultValues = buildData ? buildData : {
    class: '',
    name: '',
    runes: '',
    skills: '',
    properties: '',
    config: '',
  };

  const form = useForm<BuildFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(data: BuildFormValues) {
    // Aqui viria a lógica para salvar os dados no banco de dados.
    // Como ainda não temos um, vamos apenas simular.
    console.log('Dados do formulário:', data);

    toast({
      title: `Build ${isEditing ? 'Atualizada' : 'Criada'} (Simulação)`,
      description: `A build para ${data.class} - ${data.name} foi salva com sucesso.`,
    });
    router.push('/admin');
  }

  const fields: { name: keyof BuildFormValues; label: string; description: string, disabled?: boolean }[] = [
    { name: 'class', label: 'Classe', description: 'Ex: DW, DK, Elfa, DL', disabled: isEditing },
    { name: 'name', label: 'Nome da Sub-classe', description: 'Ex: ENE, AGI, STR', disabled: isEditing },
    { name: 'runes', label: 'Runas', description: 'Separe os itens por vírgula. Ex: Runa 1, Runa 2' },
    { name: 'skills', label: 'Habilidades', description: 'Separe os itens por vírgula. Ex: Skill 1, Skill 2' },
    { name: 'properties', label: 'Propriedades', description: 'Separe os itens por vírgula. Ex: Propriedade 1, Propriedade 2' },
    { name: 'config', label: 'Configuração', description: 'Separe os itens por vírgula. Ex: Pontos em Energia: 2000, Pontos em Agilidade: 400' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fields.map((fieldInfo) => (
                <FormField
                    key={fieldInfo.name}
                    control={form.control}
                    name={fieldInfo.name}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{fieldInfo.label}</FormLabel>
                            <FormControl>
                                <Input placeholder={`Digite as ${fieldInfo.label.toLowerCase()}...`} {...field} disabled={fieldInfo.disabled} />
                            </FormControl>
                            <FormDescription>
                                {fieldInfo.description}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ))}
        </div>
        <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Criar Build'}</Button>
      </form>
    </Form>
  );
}
