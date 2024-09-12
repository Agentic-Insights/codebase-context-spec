import { useState, useEffect } from 'react';

interface Prompt {
  content: string;
  explanation: string;
}

interface Prompts {
  codebaseContext: Prompt;
  generateContextPrompt: Prompt;
  codingAssistantPrompt: Prompt;
}

const usePrompts = (setSnackbarMessage: (message: string) => void, setSnackbarOpen: (open: boolean) => void) => {
  const [prompts, setPrompts] = useState<Prompts>({
    codebaseContext: { content: '', explanation: '' },
    generateContextPrompt: { content: '', explanation: '' },
    codingAssistantPrompt: { content: '', explanation: '' },
  });

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const [codebaseContext, generateContextPrompt, codingAssistantPrompt] = await Promise.all([
          fetch('https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/CODEBASE-CONTEXT.md').then(res => res.text()),
          fetch('https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/GENERATE-CONTEXT-PROMPT.md').then(res => res.text()),
          fetch('https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/CODING-ASSISTANT-PROMPT.md').then(res => res.text())
        ]);

        setPrompts({
          codebaseContext: {
            content: codebaseContext,
            explanation: 'This is the main specification for the Codebase Context.'
          },
          generateContextPrompt: {
            content: generateContextPrompt,
            explanation: 'Use this prompt when building a new context for a project. It guides you through the process of creating the necessary context files.'
          },
          codingAssistantPrompt: {
            content: codingAssistantPrompt,
            explanation: 'Use this prompt at the beginning of a new context window for a project that already has context files. It helps the AI understand and utilize the existing context.'
          }
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