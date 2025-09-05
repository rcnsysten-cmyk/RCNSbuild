import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
            <div className="flex justify-end">
                <Skeleton className="h-10 w-40" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[500px] w-full" />
        </div>
      </main>
    </div>
  );
}