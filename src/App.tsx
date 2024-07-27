import { useEffect, useState, useCallback } from 'react';

interface Annotation {
  text: string;
  startOffset: number;
  endOffset: number;
}

function App() {
  const [text] = useState<string>('one two thr fou');
  const [virtualText, setVirtualText] = useState<string>(text);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        if (selectedText) {
          const startOffset = text.indexOf(selectedText);
          const endOffset = startOffset + selectedText.length;
          setAnnotations((prevAnnotations) => {
            const newAnnotation = { text: selectedText, startOffset, endOffset };
            const updatedAnnotations = [...prevAnnotations, newAnnotation].sort(
              (a, b) => a.startOffset - b.startOffset
            );
            return updatedAnnotations;
          });
        }
      }
    };
    const p = document.getElementById('p');
    p?.addEventListener('mouseup', handleMouseUp);

    return () => {
      p?.removeEventListener('mouseup', handleMouseUp);
    };
  }, [text]);

  const parseText = useCallback(() => {
    let virtualText = text;
    let offsetAdjustment = 0;

    annotations.forEach((annotation) => {
      const { startOffset, endOffset } = annotation;
      const adjustedStart = startOffset + offsetAdjustment;
      const adjustedEnd = endOffset + offsetAdjustment;

      virtualText = virtualText.slice(0, adjustedStart) +
        `<mark>${annotation.text}</mark>` +
        virtualText.slice(adjustedEnd);

      offsetAdjustment += `<mark>${annotation.text}</mark>`.length - (endOffset - startOffset);
    });

    setVirtualText(virtualText);
  }, [annotations, text]);

  useEffect(() => {
    parseText();
  }, [parseText]);

  return (
    <div>
      <p dangerouslySetInnerHTML={{ __html: virtualText }} id="p" />
    </div>
  );
}

export default App;