import React, { useEffect, useState }  from "react";
import axios from 'axios';


const Card = ( {url} ) => {

    const [pokeDados, setPokeDados] = useState([]);
    const [img, setImg] = useState();
    const [ isOk, setIsOk] = useState(false);
    
    
    useEffect(() => {
        
        function verificaArea(urlArea) {
            axios.get(urlArea)
            .then(dados => {
                dados.data.map( a => {
                    if(a.location_area.name.includes('kanto')){
                        return setIsOk(true)
                    }
                    return isOk
                })
            })
        }
            if(typeof(url) === "object") {
                setPokeDados(url);
                console.log(url)
                setImg(url.sprites.other.dream_world.front_default) 
            } else{
                axios.get(url)
                .then(dados => {           
                    verificaArea(dados.data.location_area_encounters)         
                    if(isOk) {                
                        setPokeDados(dados.data);
                        setImg(dados.data.sprites.other.dream_world.front_default)    
                    }
                })
                .catch(e => console.log("lago"))
            }


    }, [isOk, url]);
   
    return(

        <>
            { isOk &&
                <div className="card">
                        <div>
                            <img  src={img} alt="Imagem do Pokemon"  width="150" height="150"></img>
                        </div>

                        <div key={pokeDados.id}>
                            <div> Nome: {pokeDados.name} </div>
                            <div> Id: {pokeDados.id} </div>
                            <div> Height: {pokeDados.height} </div>
                            <div> Weigth: {pokeDados.weight} </div>
                
                        </div>

                </div>
            }
        </>
        
    )
}

export default Card;