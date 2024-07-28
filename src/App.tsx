import { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Annotation {
  text: string;
  startOffset: number;
  endOffset: number;
  id: string;
}

function App() {
  const [text] = useState<string>('Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti voluptates, saepe et rerum sequi, animi ad reiciendis dolor nostrum doloremque amet in voluptatum esse possimus recusandae deserunt nobis illum aliquid.');
  const [virtualText, setVirtualText] = useState<string>(text);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);

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
            const newAnnotation = { text: selectedText, startOffset, endOffset, id: uuidv4() };
            const updatedAnnotations = [...prevAnnotations, newAnnotation].sort(
              (a, b) => a.startOffset - b.startOffset
            );
            return updatedAnnotations;
          });
        }
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      if (target.tagName === 'MARK') {
        const annotationId = target.getAttribute('data-id');
        const annotation = annotations.find((a) => a.id === annotationId);
        if (annotation) {
          setAnnotations((prevAnnotations) => prevAnnotations.filter((a) => a !== annotation));
        }
      }
    };

    const p = document.getElementById('p');
    p?.addEventListener('mouseup', handleMouseUp);
    p?.addEventListener('contextmenu', handleContextMenu);

    return () => {
      p?.removeEventListener('mouseup', handleMouseUp);
      p?.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [text, annotations]);

  const parseText = useCallback(() => {
    let virtualText = text;
    let offsetAdjustment = 0;

    annotations.forEach((annotation) => {
      const { startOffset, endOffset, id } = annotation;
      const adjustedStart = startOffset + offsetAdjustment;
      const adjustedEnd = endOffset + offsetAdjustment;

      const markTag = selectedAnnotation === annotation
        ? `<mark key={${ uuidv4() }} data-id="${id}" style="border: 3px dashed black;">${annotation.text}</mark>`
        : `<mark key={${uuidv4() }} data-id="${id}">${annotation.text}</mark>`;
      virtualText = virtualText.slice(0, adjustedStart) + markTag + virtualText.slice(adjustedEnd);

      offsetAdjustment += markTag.length - (endOffset - startOffset);
    });

    setVirtualText(virtualText);
  }, [annotations, text, selectedAnnotation]);

  useEffect(() => {
    parseText();
  }, [parseText]);

  return (
    <div>
      <p
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.tagName === 'MARK') {
            const annotationId = target.getAttribute('data-id');
            const annotation = annotations.find((a) => a.id === annotationId);
            if (annotation) {
              setSelectedAnnotation(annotation);
            }
          } else {
            setSelectedAnnotation(null);
          }
        }}
        dangerouslySetInnerHTML={{ __html: virtualText }}
        id="p"
      />
      <div>
        <h3>Annotations</h3>
        <ul>
          {annotations.map((annotation, index) => (
            <>
              <li key={index}>{JSON.stringify(annotation, null, 2)}</li>
              <hr />
            </>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
