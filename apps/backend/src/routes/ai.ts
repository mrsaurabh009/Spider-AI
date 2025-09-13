import { Router } from 'express';
import { aiService } from '@/services/aiService';
import { mockAiService } from '@/services/mockAiService';
import { logger } from '@/utils/logger';
import { ProjectFramework, ProjectType } from '@/types/ai';

// Use mock service for testing when Claude API is not available
const activeAiService = process.env.CLAUDE_API_KEY && process.env.NODE_ENV !== 'test' ? aiService : mockAiService;

const router = Router();

// POST /api/ai/generate
router.post('/generate', async (req, res) => {
  try {
    const { prompt, framework = 'REACT', type = 'WEBAPP', includeBackend = false, includeDatabase = false } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: { message: 'Prompt is required' }
      });
    }

    const generationRequest = {
      prompt,
      framework: framework as ProjectFramework,
      type: type as ProjectType,
      includeBackend,
      includeDatabase
    };

    logger.info('Starting AI code generation', { prompt: prompt.slice(0, 100) });

    const result = await activeAiService.generateApplication(generationRequest);

    res.json({
      success: true,
      message: 'Application generated successfully!',
      data: result
    });

  } catch (error) {
    logger.error('AI generation error:', error);
    res.status(500).json({
      success: false,
      error: { 
        message: error instanceof Error ? error.message : 'AI generation failed'
      }
    });
  }
});

// POST /api/ai/refine
router.post('/refine', async (req, res) => {
  try {
    const { existingCode, refinementRequest, context } = req.body;

    if (!existingCode || !refinementRequest) {
      return res.status(400).json({
        success: false,
        error: { message: 'Existing code and refinement request are required' }
      });
    }

    logger.info('Starting code refinement');

    const result = await aiService.refineCode(existingCode, refinementRequest, context);

    res.json({
      success: true,
      message: 'Code refined successfully!',
      data: result
    });

  } catch (error) {
    logger.error('Code refinement error:', error);
    res.status(500).json({
      success: false,
      error: { 
        message: error instanceof Error ? error.message : 'Code refinement failed'
      }
    });
  }
});

// POST /api/ai/component
router.post('/component', async (req, res) => {
  try {
    const { componentRequest, framework = 'REACT', context } = req.body;

    if (!componentRequest) {
      return res.status(400).json({
        success: false,
        error: { message: 'Component request is required' }
      });
    }

    logger.info('Starting component generation');

    const result = await aiService.generateComponent(componentRequest, framework as ProjectFramework, context);

    res.json({
      success: true,
      message: 'Component generated successfully!',
      data: result
    });

  } catch (error) {
    logger.error('Component generation error:', error);
    res.status(500).json({
      success: false,
      error: { 
        message: error instanceof Error ? error.message : 'Component generation failed'
      }
    });
  }
});

// POST /api/ai/explain
router.post('/explain', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: { message: 'Code is required' }
      });
    }

    logger.info('Starting code explanation');

    const result = await aiService.explainCode(code);

    res.json({
      success: true,
      message: 'Code explanation generated successfully!',
      data: result
    });

  } catch (error) {
    logger.error('Code explanation error:', error);
    res.status(500).json({
      success: false,
      error: { 
        message: error instanceof Error ? error.message : 'Code explanation failed'
      }
    });
  }
});

export default router;
