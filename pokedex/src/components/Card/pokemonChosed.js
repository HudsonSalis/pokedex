import React, { useEffect, useState } from "react";
import './style.css';
import axios from "axios";

const PokemonChosed = ( {dados} ) => {

    const [imgPokemon, setImgPokemon] = useState([]);
    const [pokeCharacteristic, setPokeChracteristic] = useState([]);
   
    const [typePokemon, setTypePokemon] = useState([]);
    const [weaknessPokemon, setWeaknessPokemon] = useState([]);
    const [resistancePokemon, setResistancePokemon] = useState([]);

    const [twoTypesContainer, setTwoTypesContainer] = useState(null);
   
    // verificando se o tipo na url se relaciona com o pokemon chamado na tela
    function verifyType(urlType) {
        axios.get(urlType)
        .then(data => {
            // eslint-disable-next-line array-callback-return
            data.data.pokemon.map( verifyPokemon => {
                
                if(verifyPokemon.pokemon.name === dados.name) {
                 
                    setWeaknessPokemon(data.data.damage_relations.no_damage_to);
                    setResistancePokemon(data.data.damage_relations.no_damage_from);
                    setTypePokemon(typePokemon => [...typePokemon, data.data.name]);
                    
                  
                }
            })
        })
    };

    //Buscando as url dos tipos de pokemons - fire/eletric/bug...
    useEffect( () =>{
        axios.get(`https://pokeapi.co/api/v2/type`)
        .then(data => {
            // eslint-disable-next-line array-callback-return
            data.data.results.map( result => {    
                verifyType(result.url)
            })
        })

    },[]);

    //Buscando url das caracteristicas
    useEffect(()=> {
        setImgPokemon(dados.sprites.other.dream_world.front_default)
        axios.get(`https://pokeapi.co/api/v2/characteristic/${dados.id}`)
        .then(data => {
            // eslint-disable-next-line array-callback-return
            data.data.descriptions.map( d => {
                if(d.language.name === "en") {
                    setPokeChracteristic(d.description)
                }
            })
        })

    },[]);

    function mouseOverType() {
       console.log(typeof(typePokemon))
    }
    function mouseLeaveType() {
        console.log('saindo1'   )
    }

    return (
        <div className="cards">
             {/* {backgroundBlack && <div className="backgroundblack"></div>} */}
            <div className="bloco-onepokemon-image">
                <div className="onepokemon-image">
                    <img src={imgPokemon} alt="Imagem do Pokemon"  width="250" height="250"></img>
                </div>
            </div>

            <div className="onepokemon-dados" >
                <div className="onepokemon-name"> {dados.name} </div>
                <div className="onepokemon-desc"> {pokeCharacteristic} </div>
            </div>

            <div className="onepokemon-status">
                <div className="status">
                    Type: 
    
                    <select  className="teste">
                        <option className="teste2">{typePokemon[0]} </option>
                        <option className="teste2">{typePokemon[1]}</option>
                    </select>
                        
                     <i className="fa-sharp fa-solid fa-arrow-down"></i>
                 
                   
                </div>
                <div className="status">
                    Fraqueza: 
                    <div>
                        {weaknessPokemon.map(fraquezas => (
                            <p  key={dados.id}> {fraquezas.name}</p>
                        ))}
                    </div>
                </div>
                 
                <div className="status">
                    Resistencia: 
                    <div>
                        {resistancePokemon.map(resistencia => (
                            <p  key={dados.id}> {resistencia.name}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PokemonChosed;