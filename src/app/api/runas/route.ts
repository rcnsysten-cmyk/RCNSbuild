import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Rune {
  name: string;
  imagePath: string;
  className: string;
}

// Helper function to format class name from folder name (e.g., 'dark-wizard' -> 'Dark Wizard')
const formatClassName = (folderName: string): string => {
  return folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper to format rune name from file name (e.g., 'runa-de-energia.png' -> 'Runa De Energia')
const formatRuneName = (fileName: string): string => {
    const nameWithoutExt = path.parse(fileName).name;
    return nameWithoutExt
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const classNameParam = searchParams.get('className');
    
    if (!classNameParam) {
        return NextResponse.json({ message: 'className parameter is required' }, { status: 400 });
    }

    const runes: Rune[] = [];
    const publicDir = path.join(process.cwd(), 'public');
    // Correctly use the classNameParam to build the folder path
    const classFolder = classNameParam.toLowerCase().replace(/\s+/g, '-');

    try {
        const runesDir = path.join(publicDir, classFolder, 'runas');
        
        await fs.access(runesDir); // Check if directory exists

        const runeFiles = await fs.readdir(runesDir);
        const className = formatClassName(classFolder);

        for (const file of runeFiles) {
            if (/\.(png|jpg|jpeg|gif|svg)$/.test(file)) {
                const runeName = formatRuneName(file);
                runes.push({
                    name: runeName,
                    imagePath: `/${classFolder}/runas/${file}`,
                    className: className,
                });
            }
        }
        
        runes.sort((a, b) => a.name.localeCompare(b.name));

        return NextResponse.json(runes);
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            // Directory doesn't exist for this class, return empty array which is fine
            return NextResponse.json([]);
        }
        console.error(`Failed to get runes for ${classNameParam}:`, error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
