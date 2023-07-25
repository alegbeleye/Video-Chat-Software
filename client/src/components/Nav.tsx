import React, { useState } from "react";
import Style from '../Styles.module.css'
import logo from '../Assets/logo.svg'

const Nav = ({ audio, stream }:any) => {

    const [isPlay, setIsPlay] = useState(true);
    const [isAudio, setIsAudio] = useState(false);

    const turnOffVideo = () => {
        setIsPlay(false);
        stream.getTracks().forEach(function (track: any) {
            if (track.readyState === "live" && track.kind === "video") {
                track.enabled = false;
            }
        });
    };
    const turnOnVideo = () => {
        setIsPlay(true);
        stream.getTracks().forEach(function (track: any) {
            if (track.readyState === "live" && track.kind === "video") {
                track.enabled = true;
            }
        });
    };
    const handleVideoPlay = () => {
        isPlay ? turnOffVideo() : turnOnVideo();
    };
    const handleAudioPlay = () => {
        isAudio ? audio.muted = true : audio.muted = false;
        setIsAudio(!isAudio);
    };

    return (
        <div className={Style.nav}>
            <div className={Style.logoSection}>
                <img src={logo} alt="logo" />
            </div>
            {stream && <div className={Style.callSection}>
                <button className={Style.endCall}>
                    <span className="material-symbols-sharp">
                        Call
                    </span>
                </button>
                <button className={Style.endVideo} onClick={handleVideoPlay}>
                    <span className="material-symbols-sharp">
                        {isPlay ? 'videocam_off' : 'videocam'}
                    </span>
                </button>
                <button className={Style.endAudio} onClick={handleAudioPlay}>
                    <span className="material-symbols-sharp">
                        {isAudio ? 'volume_up' : 'volume_off'}
                    </span>
                </button>
            </div>
            }
        </div>
    )
}

export default Nav