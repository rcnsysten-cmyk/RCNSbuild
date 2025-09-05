import { AdminBuildsTable } from '@/components/admin/admin-builds-table';
import { Button } from '@/components/ui/button';
import { builds } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

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
      <AdminBuildsTable builds={builds} />
    </div>
  );
}
