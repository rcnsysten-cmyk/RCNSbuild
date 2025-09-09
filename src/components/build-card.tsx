'use client';

import React from 'react';
import Link from 'next/link';
import { Build } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';

interface BuildCardProps {
  build: Build;
}

export function BuildCard({ build }: BuildCardProps) {
    const subClassNames = build.subclasses.map(sc => sc.name).join(' & ');
    const firstSubClass = build.subclasses[0];

    // We need at least one subclass to link to.
    if (!firstSubClass) return null;

    return (
        <Card className="flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-primary/50">
            <CardHeader>
                <CardTitle className="text-xl">{build.id}</CardTitle>
                <CardDescription>{subClassNames}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">PvM</Badge>
                    <Badge variant="outline">Farm</Badge>
                    <Badge variant="outline">End-game</Badge>
                </div>
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full">
                    <Link href={`/builds/${encodeURIComponent(build.class)}/${encodeURIComponent(build.id)}`}>
                        Ver Build
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
