import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';

type Props = {
  roomId: string;
};

export default function VideoChat({ roomId }: Props) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const peerVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<any>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);
      if (userVideo.current) userVideo.current.srcObject = currentStream;

      const peer = new Peer({
        initiator: location.hash === '#init',
        trickle: false,
        stream: currentStream,
      });

      peer.on('signal', (data) => {
        localStorage.setItem(`${roomId}-signal`, JSON.stringify(data));
      });

      setTimeout(() => {
        const savedSignal = localStorage.getItem(`${roomId}-signal`);
        if (savedSignal) peer.signal(JSON.parse(savedSignal));
      }, 1500);

      peer.on('stream', (remoteStream) => {
        if (peerVideo.current) peerVideo.current.srcObject = remoteStream;
      });

      peerRef.current = peer;
    });
  }, [roomId]);

  return (
    <div className="grid gap-2">
      <video ref={userVideo} autoPlay muted className="rounded border" />
      <video ref={peerVideo} autoPlay className="rounded border" />
    </div>
  );
}
