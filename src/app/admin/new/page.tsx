'use client';

import { BuildForm } from '@/components/admin/build-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewBuildPage() {

  return (
    <div className="container mx-auto px-4 py-8">
      <BuildForm>
        {(form, _, handleBack) => (
          <>
            <div className="flex items-center mb-6">
              <Button variant="ghost" onClick={handleBack} className="mr-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
              </Button>
              <h1 className="text-3xl font-bold">Adicionar Nova Build</h1>
            </div>
            {form}
          </>
        )}
      </BuildForm>
    </div>
  );
}
