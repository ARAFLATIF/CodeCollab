import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import VideoChat from '../../components/VideoChat';
import Whiteboard from '../../components/Whiteboard';

const Editor = dynamic(() => import('../../components/Editor'), { ssr: false });

export default function Room() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="p-2 bg-gray-100 overflow-auto">
        <Editor roomId={id as string} />
        <Whiteboard roomId={id as string} />
      </div>
      <div className="p-2 bg-white border-l">
        <VideoChat roomId={id as string} />
      </div>
    </div>
  );
}
