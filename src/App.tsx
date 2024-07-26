import { useEffect, useState } from "react";

interface Annotation {
  text: string;
  startOffset: number;
  endOffset: number;
}

function App() {
  const [text, setText] = useState<string>(
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non sapiente doloremque, nobis velit sit eum architecto id eaque rem itaque tenetur voluptas consequuntur atque consectetur dicta est enim deserunt voluptates."
  );
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  useEffect(() => {
    console.warn(annotations);

    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        if (selectedText) {
          const startOffset = range.startOffset;
          const endOffset = range.endOffset;
          setAnnotations((prevAnnotations) => [
            ...prevAnnotations,
            { text: selectedText, startOffset, endOffset },
          ]);
        }
      }
    };

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [annotations]);

  return (
    <div>
      <div>Test</div>
      <p>
        {text}
      </p>
      <div>
        <h3>Annotations:</h3>
        <ul>
          {annotations.map((annotation, index) => (
            <li key={index}>
              {annotation.text} (Start: {annotation.startOffset}, End: {annotation.endOffset})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
