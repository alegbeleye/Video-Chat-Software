import { ChatData } from '../Data/chatData'
import Style from '../Styles.module.css'

const ChatBox = ({meetingID, chatData}:any) => {

    return(
        <div className={Style.chatContainer}>
            {chatData.map((data:ChatData) => {
                return <p className={data.mychat ? Style.userMsg : Style.partnerMsg}>{data.chat}</p>
            })}
            {chatData.length === 0 && <p className={Style.chatPlaceholder}>{meetingID ? `Meeting-ID : ${meetingID}`:'Send a Message*'}</p>}
        </div>
    )
}

export default ChatBox