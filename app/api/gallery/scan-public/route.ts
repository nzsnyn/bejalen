import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    
    // Function to recursively scan directories
    async function scanDirectory(dirPath: string, relativePath: string = ''): Promise<any[]> {
      const files: any[] = [];
      
      if (!existsSync(dirPath)) {
        return files;
      }

      try {
        const entries = await readdir(dirPath);
        
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry);
          const relativeFullPath = path.join(relativePath, entry).replace(/\\/g, '/');
          
          try {
            const stats = await stat(fullPath);
            
            if (stats.isDirectory()) {
              // Skip node_modules and other system directories
              if (!['node_modules', '.git', '.next'].includes(entry)) {
                const subFiles = await scanDirectory(fullPath, relativeFullPath);
                files.push({
                  type: 'directory',
                  name: entry,
                  path: relativeFullPath,
                  files: subFiles
                });
              }
            } else if (stats.isFile()) {
              const ext = path.extname(entry).toLowerCase();
              if (imageExtensions.includes(ext)) {
                files.push({
                  type: 'file',
                  name: entry,
                  path: relativeFullPath,
                  url: `/${relativeFullPath}`,
                  size: stats.size,
                  extension: ext,
                  modifiedAt: stats.mtime
                });
              }
            }
          } catch (statError) {
            console.error(`Error reading stats for ${fullPath}:`, statError);
          }
        }
      } catch (readdirError) {
        console.error(`Error reading directory ${dirPath}:`, readdirError);
      }
      
      return files;
    }

    const publicFiles = await scanDirectory(publicDir);
    
    // Flatten the structure and extract only image files for easier display
    function flattenFiles(items: any[]): any[] {
      const flattened: any[] = [];
      
      for (const item of items) {
        if (item.type === 'file') {
          flattened.push(item);
        } else if (item.type === 'directory' && item.files) {
          flattened.push(...flattenFiles(item.files));
        }
      }
      
      return flattened;
    }

    const allImages = flattenFiles(publicFiles);
    
    // Group by directory for better organization
    const groupedImages = allImages.reduce((groups: any, file: any) => {
      const dirPath = path.dirname(file.path);
      const dirName = dirPath === '.' ? 'root' : dirPath;
      
      if (!groups[dirName]) {
        groups[dirName] = [];
      }
      
      groups[dirName].push(file);
      return groups;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        structure: publicFiles,
        allImages,
        groupedImages,
        totalImages: allImages.length
      },
      message: 'Public folder images scanned successfully'
    });

  } catch (error) {
    console.error('Scan public folder error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
