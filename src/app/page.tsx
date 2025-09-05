import { BuildDisplay } from '@/components/build-display';
import { Header } from '@/components/header';
import { builds } from '@/lib/data';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <BuildDisplay builds={builds} />
      </main>
    </div>
  );
}