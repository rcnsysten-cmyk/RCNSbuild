"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Info } from "lucide-react";
import { Badge } from "../ui/badge";

interface SetItem {
  name: string;
  imagePath: string;
  className: string;
  tier: number;
}

interface SetsGalleryProps {
  className: string;
  subClassName: string;
}

export function SetsGallery({ className, subClassName }: SetsGalleryProps) {
  const [sets, setSets] = useState<SetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSets() {
      if (!className) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/sets?className=${encodeURIComponent(className)}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar os conjuntos.');
        }
        const data: SetItem[] = await response.json();

        if (data.length === 0) {
            // This is not an error, just means no sets are configured.
            setSets([]);
            return;
        }

        setSets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSets();
  }, [className]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, j) => (
            <div key={j} className="flex flex-col items-center gap-2">
              <Skeleton className="h-32 w-32 rounded-md" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
      </div>
    );
  }

  if (error) {
     return (
        <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>Erro ao Carregar</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
     )
  }

  const isDataAvailable = sets.length > 0;

  if (!isDataAvailable) {
    return (
        <Alert variant="default" className="border-yellow-500/50 text-yellow-500 [&>svg]:text-yellow-500">
            <Info className="h-4 w-4" />
            <AlertTitle>Configuração Pendente</AlertTitle>
            <AlertDescription>
                A galeria de Conjuntos para esta classe ainda não foi configurada. Por favor, adicione as imagens na pasta correta ou aguarde as atualizações.
            </AlertDescription>
        </Alert>
    );
  }

  return (
    <>
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative w-3/4 h-3/4 max-w-4xl max-h-4xl">
            <Image
                src={zoomedImage}
                alt="Zoomed set"
                fill
                className="object-contain"
                unoptimized
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sets.map(set => (
              <div 
                key={set.imagePath} 
                className="flex flex-col items-center justify-center text-center gap-3 p-4 border rounded-lg bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setZoomedImage(set.imagePath)}
              >
                  <div className="relative w-32 h-32">
                    <Image 
                      src={set.imagePath}
                      alt={set.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <h3 className="font-semibold text-lg h-12 flex items-center justify-center">{set.name}</h3>
                  <Badge variant="outline">Tier {set.tier}</Badge>
              </div>
          ))}
      </div>
    </>
  );
}
