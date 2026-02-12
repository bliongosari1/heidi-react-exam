#!/usr/bin/env ts-node
/**
 * Schema validation and development script
 * 
 * Usage: pnpm run schema dev
 */

import * as fs from 'fs';
import * as path from 'path';

const SCHEMA_TYPES_PATH = path.join(__dirname, '../types/schema.ts');

// Check for deprecated imports
function checkDeprecatedImports(): { file: string; line: number; issue: string }[] {
  const issues: { file: string; line: number; issue: string }[] = [];
  
  const srcDir = path.join(__dirname, '../src');
  
  if (!fs.existsSync(srcDir)) {
    console.log('No src directory found, skipping import checks');
    return issues;
  }
  
  function scanDirectory(dir: string) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Check for deprecated EvidenceSubscriptionTier import
          if (line.includes('EvidenceSubscriptionTier') && 
              !line.includes('Utils__enums__EvidenceSubscriptionTier')) {
            issues.push({
              file: filePath,
              line: index + 1,
              issue: `"@types/schema" has no exported member named 'EvidenceSubscriptionTier'. Use 'Utils__enums__EvidenceSubscriptionTier' instead.`
            });
          }
        });
      }
    }
  }
  
  scanDirectory(srcDir);
  return issues;
}

function runDevMode() {
  console.log('🔍 Running schema validation in dev mode...\n');
  
  // Check if schema types file exists
  if (!fs.existsSync(SCHEMA_TYPES_PATH)) {
    console.error('❌ Schema types file not found at:', SCHEMA_TYPES_PATH);
    process.exit(1);
  }
  
  console.log('✅ Schema types file found\n');
  
  // Check for deprecated imports
  const issues = checkDeprecatedImports();
  
  if (issues.length > 0) {
    console.error('❌ Found deprecated imports:\n');
    issues.forEach(issue => {
      console.error(`  ${issue.file}:${issue.line}`);
      console.error(`    ${issue.issue}\n`);
    });
    process.exit(1);
  }
  
  console.log('✅ No deprecated imports found');
  console.log('✅ Schema validation complete\n');
}

// Main
const command = process.argv[2];

switch (command) {
  case 'dev':
    runDevMode();
    break;
  default:
    console.log('Usage: pnpm run schema <command>');
    console.log('Commands:');
    console.log('  dev    Run schema validation in development mode');
    process.exit(1);
}
