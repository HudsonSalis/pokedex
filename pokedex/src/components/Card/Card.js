import React, { useEffect, useState }  from "react";
import axios from 'axios';
import './style.css';


const Card = ( {url} ) => {

    const [pokeDados, setPokeDados] = useState([]);
    const [img, setImg] = useState();
    const [typePokemon, setTypePokemon] = useState([]);

    function fetchData() {
        axios.get(url)
        .then( data => {
            setPokeDados(data.data)
            if(data.data.sprites.other.dream_world.front_default === null){
                setImg(data.data.sprites.other.home.front_default)
            }else{
                setImg(data.data.sprites.other.dream_world.front_default)
            }
            data.data.types.map( testt => (
                setTypePokemon(typePokemon => [...typePokemon, testt.type.name])
                
            ))    
        })
    }
   
    useEffect(() => {
        fetchData()
      

    },[])
   
    return(
        <>
            <div className="card">
                    <div className="card-image">
                        <img  src={img} alt="Imagem do Pokemon"  width="150" height="150"></img>
                    </div>
                    <div className="pokemonDados">
                        <div className="card-pokemon-name">{pokeDados.name} </div>
                        <div className="card-pokemon-id"> Nº {pokeDados.id} </div>
                    </div>
                    <div className="pokemonType">
                         <div className={ `${typePokemon[0]} typeCard` }> {typePokemon[0]} </div>
                         { typePokemon.length > 2 ? 
                            <div className={ `${typePokemon[1]} typeCard testw` }> {typePokemon[1]}</div> 
                        : null}
                    </div>
                    <div className="ball"></div>
            </div>
        </>        
    )
}
export default Card;