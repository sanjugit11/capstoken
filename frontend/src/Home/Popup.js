import React from 'react';
import '../popup.css';
import logo from './Logoqr/finalqr.png';

function Popup(props){


    return(props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn" onClick={() => props.setTrigger(false)}> X</button>
                <img src={logo} alt="logoqr"></img>
                {props.children}
            </div>
        </div>
    ) :"";
}

export default Popup;