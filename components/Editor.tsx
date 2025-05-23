import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

type Props = {
  roomId: string;
};

export default function CodeEditor({ roomId }: Props) {
  const editorRef = useRef(null);
  const codeRef = ref(db, `rooms/${roomId}/code`);

  const handleChange = (value: string | undefined) => {
    if (value) set(codeRef, value);
  };

  useEffect(() => {
    onValue(codeRef, (snapshot) => {
      const val = snapshot.val();
      if (val && editorRef.current) {
        (editorRef.current as any).setValue(val);
      }
    });
  }, []);

  return (
    <Editor
      height="50vh"
      defaultLanguage="javascript"
      defaultValue="// Start coding"
      onMount={(editor) => (editorRef.current = editor)}
      onChange={handleChange}
      theme="vs-dark"
    />
  );
}
