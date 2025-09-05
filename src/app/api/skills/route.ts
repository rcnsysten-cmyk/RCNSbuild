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
    // Specific override for a known problematic name
    if (nameWithoutExt === 'lampejo-aquatico') {
        return 'Lampejo Aquatic';
    }
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
      const logoDir = path.join(publicDir, classFolder, 'skill', 'logo');
      const regularDir = path.join(publicDir, classFolder, 'skill', 'imagens');
      let skillsDir = '';
      let imageSubPath = '';

      try {
        await fs.access(logoDir);
        skillsDir = logoDir;
        imageSubPath = `/${classFolder}/skill/logo`;
      } catch (error) {
        try {
          await fs.access(regularDir);
          skillsDir = regularDir;
          imageSubPath = `/${classFolder}/skill/imagens`;
        } catch (e) {
          // If neither directory exists, skip this class folder.
          continue;
        }
      }

      try {
        const skillFiles = await fs.readdir(skillsDir);
        const className = formatClassName(classFolder);

        for (const file of skillFiles) {
          if (/\.(png|jpg|jpeg|gif|svg)$/.test(file)) {
            const skillName = formatSkillName(file);
            skills.push({
              name: skillName,
              imagePath: `${imageSubPath}/${file}`,
              className: className,
            });
          }
        }
      } catch (error) {
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
