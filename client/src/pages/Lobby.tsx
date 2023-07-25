import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Style from '../Styles.module.css'
import joinSvg from '../Assets/join.svg'
import newSvg from '../Assets/new.svg'
import Nav from "../components/Nav";

const Lobby = () => {
    const naviagate = useNavigate();
    const location = useLocation();
    const callError = location.state;
    const [isNewMeeting, setIsNewMeeting] = useState(false);
    const [meetingID, setMeetingID] = useState(null);
    const [username, setUsername] = useState(null);
    const [errorMsg, setErrorMsg] = useState(callError);
    const COMPLETE_INPUTS_MESSAGE = 'Please fill in all inputs.';

    const handleUsername = (e: any) => {
        setUsername(e.target.value);
    };
    const handleMeeting = (e: any) => {
        setMeetingID(e.target.value);
    };
    const handleSubmit = (e: any) => {
        if ((isNewMeeting && username) || (!isNewMeeting && username && meetingID)) {
            return naviagate('/chat', {
                state: {
                    isNewMeeting: isNewMeeting,
                    meetingID: meetingID,
                    username: username
                }
            });
        }
        setErrorMsg(COMPLETE_INPUTS_MESSAGE);
    };
    const handleCloseMessage = () => {
        setErrorMsg(null);
    };

    return (
        <div className={Style.lobbyContainer}>
            <Nav />
            {errorMsg &&
                <div className={Style.errMsg}>
                    <p>{errorMsg}</p>
                    <button onClick={handleCloseMessage} className={Style.closeMsg}>
                        <span className="material-symbols-sharp">
                            Close
                        </span>
                    </button>
                </div>
            }
            <div className={Style.btnSection}>
                <div onClick={() => setIsNewMeeting(true)} className={isNewMeeting ? Style.newMeetingBtn1 : Style.newMeetingBtn2}>
                    <p>Start</p>
                    <img src={newSvg} alt="icon" />
                    <p>Meeting</p>
                </div>
                <div onClick={() => setIsNewMeeting(false)} className={!isNewMeeting ? Style.joinMeetingBtn1 : Style.joinMeetingBtn2}>
                    <p>Start</p>
                    <img src={joinSvg} alt="icon" />
                    <p>Meeting</p>
                </div>
            </div>
            <div className={Style.inputSection}>
                {!isNewMeeting && <input placeholder="Enter meeting ID" onChange={handleMeeting} className={Style.idInput} />}
                <div className={Style.inputWithGo}>
                    <input placeholder="Enter your name" onChange={handleUsername} className={Style.nameInput} />
                    <button onClick={handleSubmit} className={Style.submitBtn}>Go</button>
                </div>
            </div>
        </div>
    )

}

export default Lobby