import { useState, useEffect } from 'react';

interface Prompt {
  content: string;
  explanation: string;
}

interface CodingAssistantPrompts {
  [key: string]: Prompt;
}

interface Prompts {
  codebaseContext: Prompt;
  generateContextPrompt: Prompt;
  codingAssistantPrompts: CodingAssistantPrompts;
}

const usePrompts = (setSnackbarMessage: (message: string) => void, setSnackbarOpen: (open: boolean) => void) => {
  const [prompts, setPrompts] = useState<Prompts>({
    codebaseContext: { content: '', explanation: '' },
    generateContextPrompt: { content: '', explanation: '' },
    codingAssistantPrompts: {},
  });

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const [codebaseContext, generateContextPrompt, claudeDevPrompt] = await Promise.all([
          fetch('https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/CODEBASE-CONTEXT.md').then(res => res.text()),
          fetch('https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/GENERATE-CONTEXT-PROMPT.md').then(res => res.text()),
          fetch('https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/CODING-ASSISTANT-PROMPT.md').then(res => res.text()),
        ]);

        const codingAssistantPrompts: CodingAssistantPrompts = {
          'claude-dev': {
            content: claudeDevPrompt,
            explanation: 'Use this prompt for the Claude-dev coding assistant tool.'
          },
          'aider': {
            content: 'Aider specific prompt content goes here',
            explanation: 'Use this prompt for the Aider coding assistant tool.'
          },
          'cody': {
            content: 'Cody specific prompt content goes here',
            explanation: 'Use this prompt for the Cody coding assistant tool.'
          },
        };

        setPrompts({
          codebaseContext: {
            content: codebaseContext,
            explanation: 'This is the main specification for the Codebase Context.'
          },
          generateContextPrompt: {
            content: generateContextPrompt,
            explanation: 'Use this prompt when building a new context for a project. It guides you through the process of creating the necessary context files.'
          },
          codingAssistantPrompts,
        });
      } catch (error) {
        console.error('Error fetching prompts:', error);
        setSnackbarMessage('Error fetching prompts');
        setSnackbarOpen(true);
      }
    };

    fetchPrompts();
  }, [setSnackbarMessage, setSnackbarOpen]);

  return prompts;
};

export default usePrompts;