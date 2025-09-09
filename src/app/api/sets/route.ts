import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface SetItem {
  name: string;
  imagePath: string;
  className: string;
  tier: number;
}

// Helper function to format class name from folder name (e.g., 'dark-wizard' -> 'Dark Wizard')
const formatClassName = (folderName: string): string => {
  return folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper to format set name from file name (e.g., 't3-hades.png' -> 'Hades')
const formatSetName = (fileName: string): string => {
    const nameWithoutExt = path.parse(fileName).name.toLowerCase();
    const tier = extractTier(fileName);

    // Specific overrides based on tier
    switch (tier) {
        case 3: return 'Conjunto Qiraji Eclipse';
        case 4: return 'Conjunto Scallo Grande Alma';
        case 5: return 'Conjunto Haion Visconde III';
        case 6: return 'Conjunto Chrono Mágico';
        case 7: return 'Conjunto Solar Portador da Morte';
        default:
            // Default behavior for other tiers
            const nameWithoutTier = nameWithoutExt.replace(/^t\d+-?/, '');
            return nameWithoutTier
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
    }
};

// Helper to extract tier from file name (e.g., 't3.png' -> 3, 't4-chrono.png' -> 4)
const extractTier = (fileName: string): number => {
    const match = path.parse(fileName).name.match(/^t(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}
  

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const classNameParam = searchParams.get('className');
    
    if (!classNameParam) {
        return NextResponse.json({ message: 'className parameter is required' }, { status: 400 });
    }

    const sets: SetItem[] = [];
    const publicDir = path.join(process.cwd(), 'public');
    const classFolder = classNameParam.toLowerCase().replace(' ', '-');

    try {
        const setsDir = path.join(publicDir, classFolder, 'sets');
        
        await fs.access(setsDir); // Check if directory exists

        const setFiles = await fs.readdir(setsDir);
        const className = formatClassName(classFolder);

        for (const file of setFiles) {
            if (/\.(png|jpg|jpeg|gif|svg)$/.test(file)) {
                const tier = extractTier(file);
                if (tier > 0) { // Only add sets with a valid tier
                    const setName = formatSetName(file);
                    sets.push({
                        name: setName,
                        imagePath: `/${classFolder}/sets/${file}`,
                        className: className,
                        tier: tier,
                    });
                }
            }
        }
        
        // Sort by tier, then by name
        sets.sort((a, b) => {
            if (a.tier !== b.tier) {
                return a.tier - b.tier;
            }
            return a.name.localeCompare(b.name);
        });

        return NextResponse.json(sets);
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            // Directory doesn't exist for this class, return empty array which is fine
            return NextResponse.json([]);
        }
        console.error(`Failed to get sets for ${classNameParam}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
