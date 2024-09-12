export const handleCopyToClipboard = (content: string, setSnackbarMessage: (message: string) => void, setSnackbarOpen: (open: boolean) => void) => {
  navigator.clipboard.writeText(content).then(() => {
    setSnackbarMessage('Copied to clipboard!');
    setSnackbarOpen(true);
  }, (err) => {
    console.error('Could not copy text: ', err);
  });
};

export const handleDownload = (content: string, filename: string, setSnackbarMessage: (message: string) => void, setSnackbarOpen: (open: boolean) => void) => {
  const element = document.createElement('a');
  const file = new Blob([content], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  setSnackbarMessage('File downloaded!');
  setSnackbarOpen(true);
};