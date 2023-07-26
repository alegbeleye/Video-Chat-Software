// src/App.tsx
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import { useLocation, useNavigate } from 'react-router-dom';
import Style from '../Styles.module.css'
import ChatBox from '../components/Chat';
import ChatInput from '../components/ChatInput';
import { ChatData } from '../Data/chatData'
import Nav from '../components/Nav';

const serverUrl = 'http://localhost:8000';

function VideoChat(): JSX.Element {

  const location = useLocation();
  const navigate = useNavigate();
  const isNewMeeting = location.state.isNewMeeting; // Set this accordingly
  const data = location.state;

  const [yourID, setYourID] = useState<string>('');
  const [stream, setStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState<boolean>(false);
  const [caller, setCaller] = useState<string>('');
  const [partnerUsername, setPartnerUsername] = useState<string>('');
  const [callerSignal, setCallerSignal] = useState<any>();
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [chatData, setChatData] = useState<ChatData[]>([])
  const [callEnded, setCallEnded] = useState<boolean>(false);

  const userVideoRef = useRef<HTMLVideoElement>(null);
  const partnerVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>();
  const buttonRef = useRef<any>();

  const getVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mystream: MediaStream) => {
        setStream(mystream);
        if (userVideoRef.current) userVideoRef.current.srcObject = mystream;
      })
      .catch((error) => console.log('Error accessing user media:', error));
  }

  useEffect(() => {
    socketRef.current = io(serverUrl);

    getVideo();

    socketRef.current.on('yourID', (id: string) => {
      setYourID(id);
    });

    socketRef.current.on('allUsers', (users: { [key: string]: string }) => {
      if (!isNewMeeting && !users[data.meetingID]) handleUser404();
    });

    socketRef.current.on('recievedChat', (chat: any) => {
      setChatData((prev: ChatData[]) => [...prev, chat.data])
    })

    socketRef.current.on('hey', (data: any) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
      setPartnerUsername(data.username)
    });

    socketRef.current.on('user404', (msg: string) => {
    })

    socketRef.current.on("userLeft", ()=>{
      setCallEnded(true);
    })

    return () => {
      socketRef.current.disconnect();
    };
  }, []);


  const handleUser404 = () => {
    navigate("/", { state: 'User does not exist' });
  }

  const endCall = () => {
    try{
    socketRef.current.disconnect();
    navigate("/", { state: 'Call Ended' });
    }catch(err){
      console.log(err)
    }
  }

  const callPeer = (id: string) => {
    try {
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on('signal', (peerData: any) => {
        socketRef.current.emit('callUser', { userToCall: id, signalData: peerData, from: yourID, username: data.username });
      });

      peer.on('stream', (stream: MediaStream) => {
        if (partnerVideoRef.current) partnerVideoRef.current.srcObject = stream;
      });

      socketRef.current.on('callAccepted', (data: any) => {
        setCallAccepted(true);
        setPartnerUsername(data.username)
        peer.signal(data.signal);
      });
    } catch (err) {
      console.log(err)
    }
  };

  const acceptCall = () => {
    try {
      setCallAccepted(true);
      const peer = new SimplePeer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      peer.on('signal', (peerData: any) => {
        socketRef.current.emit('acceptCall', { signal: peerData, to: caller, username: data.username });
      });

      peer.on('stream', (stream: MediaStream) => {
        if (partnerVideoRef.current) partnerVideoRef.current.srcObject = stream;
      });

      peer.signal(callerSignal);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = (msg: ChatData) => {
    socketRef.current.emit('sentChat', { to: !isNewMeeting ? data.meetingID : caller, data: msg })
  }

  return (
    <div className={Style.videoPage}>
      <Nav audio={userVideoRef.current} stream={stream} endCall={endCall} />

      <section className={Style.videoAndChatSection}>

        <div className={Style.videoContainer}>

          {partnerUsername && <p className={Style.partnerUsername}>{partnerUsername}</p>}
          <video className={Style.userVideo} playsInline muted ref={userVideoRef} autoPlay />
          {callAccepted && !callEnded && <video className={Style.partnerVideo} playsInline muted ref={partnerVideoRef} autoPlay />}
          {!receivingCall && isNewMeeting && <p className={Style.waitingMsg}>Waiting for someone to join...</p>}
          {callEnded && <p className={Style.waitingMsg}>{"Call Ended. Have a good day :)"}</p>}

          {receivingCall && !callAccepted && (
            <div className={Style.requestMsg}>
              <p>{caller} wants to join</p>
              <button className={Style.requestBtn} onClick={acceptCall}>Allow</button>
            </div>
          )}

          {!isNewMeeting && !callAccepted && <button ref={buttonRef} className={Style.requestBtn} onClick={() => callPeer(data.meetingID)}>Request to join</button>}
        </div>

        <ChatInput setChatData={setChatData} chatData={chatData} sendMessage={sendMessage} />
        <ChatBox meetingID={isNewMeeting ? yourID : null} chatData={chatData} />

      </section>

    </div>
  );
}

export default VideoChat;