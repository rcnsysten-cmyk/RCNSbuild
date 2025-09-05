import { BuildForm } from '@/components/admin/build-form';

export default function NewBuildPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Adicionar Nova Build</h1>
      <BuildForm />
    </div>
  );
}
