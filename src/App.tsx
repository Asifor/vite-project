import { ReactNode, useEffect, useState } from "react";

interface Annotation {
  text: string;
  startOffset: number;
  endOffset: number;
}

function App() {
  const [text,] = useState<ReactNode>(
    
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non sapiente doloremque, nobis velit sit eum architecto id eaque rem itaque tenetur voluptas consequuntur atque consectetur dicta est enim deserunt voluptates."
  );
  const [virtualText, setVirtualText] = useState<ReactNode>(text);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  
  useEffect(() => {
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
  }, [annotations, text]);


  useEffect(()=>{
    const parseText = () => {
      const parsedText = [];
      let startIndex = 0
      const endIndex = text?.length - 1;
      annotations.sort((a, b)=>{
        return a.startOffset - b.startOffset
      }).forEach((annotation) => {

        parsedText.push(text.slice(startIndex, annotation.startOffset));

        parsedText.push(<span style={{ "background-color": 'yellow' }}>{annotation.text}</span>)
        startIndex = annotation.endOffset
      })
      parsedText.push(text?.slice(startIndex, endIndex))
      console.error(parsedText);
      return parsedText
    }
    setVirtualText(parseText())
  }, [annotations, text])

  return (
    <div>
      <div>Test</div>
      <p>
        {virtualText}
      </p>
      <div>
        <h3>Length:</h3>
        <p>
          {text.length}
        </p>
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
