import React, { useEffect, useState }  from "react";
import axios from 'axios';
import './style.css';


const Card = ( {url} ) => {

    const [pokeDados, setPokeDados] = useState([]);
    const [img, setImg] = useState();
   

    useEffect(() => {

        axios.get(url)
        .then( data => {
            setPokeDados(data.data)
            setImg(data.data.sprites.other.dream_world.front_default)    

        })

    },[])
    
   
    return(

        <>
            <div className="card">
                    <div>
                        <img  src={img} alt="Imagem do Pokemon"  width="150" height="150"></img>
                    </div>

                    <div className="pokemonDados">
                        <div className="card-pokemon">{pokeDados.name} </div>
                        <div>Nº {pokeDados.id} </div>
                        
                    </div>

                    <div className="ball"></div>

            </div>
        </>
        
    )
}

export default Card;