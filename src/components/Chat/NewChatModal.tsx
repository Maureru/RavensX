{
  /* <div className="mx-auto my-auto">
            <div className="w-36 aspect-square mx-auto bg-red-400 rounded-full" />
            <h2 className="text-center mt-6 flex">
              <span className="animate-pulse">Maco is calling</span>
              {Array(3)
                .fill(' ')
                .map((_, i) => (
                  <div
                    style={{
                      animationDelay: `${i}s`,
                    }}
                    key={i}
                    className="animate-pulse ml-2"
                  >
                    .
                  </div>
                ))}
            </h2>
            <div className="text-white flex mt-6 justify-center gap-10">
              <h2 className="p-3 rounded-full bg-green-500">
                <BiSolidPhoneCall />
              </h2>
              <h2 className="p-3 rounded-full bg-red-500">
                <HiPhoneMissedCall />
              </h2>
            </div>
          </div>



<div className="mx-auto my-auto">
          <div className="w-36 aspect-square mx-auto bg-red-400 rounded-full" />
          <h2 className="text-center mt-6 flex">
            <span className="animate-pulse">Calling</span>
            {Array(3)
              .fill(' ')
              .map((_, i) => (
                <div
                  style={{
                    animationDelay: `${i}s`,
                  }}
                  key={i}
                  className="animate-pulse ml-2"
                >
                  .
                </div>
              ))}
          </h2>
          <div className="text-white flex mt-6 justify-center gap-10">
            <h2 className="text-2xl p-3 w-full flex gap-2 items-center justify-center rounded-full bg-red-500">
              <MdCallEnd />
              Cancel
            </h2>
          </div>
        </div>









const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream>();
  const [call, setCall] = useState<Call>({
    isRecievingCall: false,
    fromId: '',
    name: '',
    signal: '',
  });

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>();
  const connectionRef = useRef<Instance>();

  useEffect(() => {
    console.log('uyyyy');

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    socket.on('callUser', ({ fromId, name: callerName, signal }) => {
      setCall({
        isRecievingCall: true,
        fromId: fromId,
        name: callerName,
        signal,
      });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new SimplePeer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.fromId });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    if (call.signal) {
      peer.signal(call.signal);
    }

    connectionRef.current = peer;
  };

  const callUser = (id: string) => {
    const peer = new SimplePeer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        myId: auth._id,
        name: auth.name,
      });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current?.destroy();

    window.location.reload();
  }; */
}
