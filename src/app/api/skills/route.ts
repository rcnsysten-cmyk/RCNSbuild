import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Skill {
  name: string;
  imagePath: string;
  className: string;
}

// Helper to format class name from folder name (e.g., 'dark-wizard' -> 'Dark Wizard')
const formatClassName = (folderName: string): string => {
  return folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper to format skill name from file name (e.g., 'evil-spirit.png' -> 'Evil Spirit')
const formatSkillName = (fileName: string): string => {
    const nameWithoutExt = path.parse(fileName).name;
    return nameWithoutExt
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  

export async function GET() {
  const skills: Skill[] = [];
  const publicDir = path.join(process.cwd(), 'public');

  try {
    const classFolders = (await fs.readdir(publicDir, { withFileTypes: true }))
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const classFolder of classFolders) {
      const skillsDir = path.join(publicDir, classFolder, 'skill', 'imagens');
      try {
        const skillFiles = await fs.readdir(skillsDir);
        const className = formatClassName(classFolder);

        for (const file of skillFiles) {
          if (/\.(png|jpg|jpeg|gif|svg)$/.test(file)) {
            const skillName = formatSkillName(file);
            skills.push({
              name: skillName,
              imagePath: `/${classFolder}/skill/imagens/${file}`,
              className: className,
            });
          }
        }
      } catch (error) {
        // If a class folder doesn't have the skill/imagens structure, skip it.
        // This is normal and expected.
        if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
            console.warn(`Could not read skills for ${classFolder}:`, error);
        }
      }
    }

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Failed to get skills:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
