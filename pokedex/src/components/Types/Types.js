import React, { useState } from "react";  
import "./style.css"



const TypesOfPokemon = (props) => {

    const {typeOfPokemon, isDoubleWeaker} = props;

    const [displayDoubleWaker, setDisplayDoubleWaker ] = useState("infoWeakerClose")

  

    function onMouseOver(){
        setDisplayDoubleWaker("infoWeakerOpen")
    }

    function onMouseLeave(){
        setDisplayDoubleWaker("infoWeakerClose")
    }

    return(

        <>
         <div className="types-container"> 
            {isDoubleWeaker && (
                <div className={displayDoubleWaker}>
                    <p>Recebe 4x de Dano a mais</p>
                </div>
           )}
            <span 
                onMouseLeave={isDoubleWeaker ? onMouseLeave  : null} 
                onMouseOver={isDoubleWeaker ? onMouseOver : null} 
                className={`layout-types ${typeOfPokemon}`}
                > 
                {typeOfPokemon} 
                {isDoubleWeaker && (
                    <p className="hasDoubleWeaker">
                        <i className="fa-regular fa-circle-info"></i>
                    </p>
                )}
            </span>
          
        </div>
        </>
       

    );
}


export default TypesOfPokemon