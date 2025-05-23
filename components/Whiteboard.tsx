import { useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

type Props = {
  roomId: string;
};

export default function Whiteboard({ roomId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const drawRef = ref(db, `rooms/${roomId}/draw`);

    const ctx = canvasRef.current?.getContext('2d');
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    const start = (e: MouseEvent) => {
      isDrawing.current = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing.current) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      set(drawRef, { x: e.offsetX, y: e.offsetY });
    };

    const stop = () => {
      isDrawing.current = false;
      ctx.closePath();
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseout', stop);

    onValue(drawRef, (snapshot) => {
      const data = snapshot.val();
      if (data && !isDrawing.current) {
        ctx?.lineTo(data.x, data.y);
        ctx?.stroke();
      }
    });

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mouseout', stop);
    };
  }, [roomId]);

  return <canvas ref={canvasRef} width={600} height={400} className="border rounded bg-white" />;
}
