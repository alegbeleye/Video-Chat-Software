import React from 'react';
import Style from './Styles.module.css'
import Lobby from './pages/Lobby';
import VideoChat from './pages/VideoChat';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className={Style.app}>
      <Routes>
        <Route path='/' element={<Lobby/>}/>
        <Route path='/chat' element={<VideoChat/>}/>
      </Routes>
    </div>
  );
}

export default App;
