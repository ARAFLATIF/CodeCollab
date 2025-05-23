import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const router = useRouter();

  const createRoom = () => {
    const id = uuidv4();
    router.push(`/room/${id}`);
  };

  return (
    <main className="flex h-screen items-center justify-center flex-col">
      <h1 className="text-4xl font-bold mb-4">CodeCollab</h1>
      <button onClick={createRoom} className="bg-blue-600 text-white px-4 py-2 rounded">
        Start a New Session
      </button>
    </main>
  );
}
