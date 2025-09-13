import { CodeValidation } from '@/types/ai';
import { logger } from '@/utils/logger';

export async function validateGeneratedCode(code: any): Promise<CodeValidation> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  try {
    // Basic validation checks
    if (!code.frontend) {
      errors.push('Frontend code is missing');
    }

    if (!code.packageJson) {
      errors.push('Package.json is missing');
    }

    // Check if frontend code has basic structure
    if (code.frontend && typeof code.frontend === 'string') {
      if (!code.frontend.includes('import') && !code.frontend.includes('require')) {
        warnings.push('Frontend code might be missing imports');
      }

      if (!code.frontend.includes('export') && !code.frontend.includes('module.exports')) {
        warnings.push('Frontend code might be missing exports');
      }
    }

    // Package.json validation
    if (code.packageJson) {
      if (!code.packageJson.name) {
        warnings.push('Package.json is missing name field');
      }
      
      if (!code.packageJson.dependencies && !code.packageJson.devDependencies) {
        warnings.push('Package.json has no dependencies');
      }
    }

    // Framework-specific validations
    if (code.framework === 'REACT') {
      if (code.frontend && !code.frontend.includes('React')) {
        warnings.push('React code might be missing React imports');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };

  } catch (error) {
    logger.error('Code validation error:', error);
    return {
      isValid: false,
      errors: ['Code validation failed'],
      warnings,
      suggestions
    };
  }
}

export async function formatGeneratedCode(code: string, type: 'frontend' | 'backend'): Promise<string> {
  try {
    // Basic formatting - in a real implementation, you'd use prettier or similar
    let formattedCode = code;

    // Remove excessive whitespace
    formattedCode = formattedCode.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Ensure proper line endings
    formattedCode = formattedCode.replace(/\r\n/g, '\n');

    return formattedCode;

  } catch (error) {
    logger.error('Code formatting error:', error);
    return code; // Return original if formatting fails
  }
}
