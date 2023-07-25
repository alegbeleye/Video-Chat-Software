import { ChangeEvent, useState } from "react";
import Style from '../Styles.module.css'
import sendSVG from '../Assets/chatSend.svg'
import { ChatData } from "../Data/chatData";

const ChatInput = ({ setChatData, chatData, sendMessage }:any) => {
    const [message, setMessage] = useState('');

    const handleMessage = (e:ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = (event:React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setChatData((prev:ChatData[]) => [...prev, {
            mychat: true,
            chat: message.trim()
        }]);
        sendMessage({
            mychat: false,
            chat: message.trim()
        });
        setMessage('');
    };

    return (
        <div className={Style.chatInputAndButtonContainer}>
            <textarea onChange={handleMessage} value={message} className={Style.chatInput}/>
            <button onClick={handleSendMessage} className={Style.chatSubmitBtn}>
                <img src={sendSVG} alt="send" />
            </button>
        </div>
    )

}

export default ChatInput