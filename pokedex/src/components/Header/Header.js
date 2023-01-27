import React from "react";  
import "./style.css"
import Logo from "../../assets/images/pokemonLogo.png" ;

const Header = () => {

    return(

        <div className="header-container">
            <div className="header">
                <div className="div-logo-img">
                    <div className="logo">
                        <img src={Logo} alt="Logo" width="100px" heigth="100px"></img>
                    </div>         
                </div>
                
                <div className="div-lista-items">
                    <ul className="header-ul">
                        <li className="header-li">Home</li>
                        <li className="header-li">Contact</li>
                        <li className="header-li">About</li>
                        <li className="header-li">Public</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}


export default Header;