import React, { useEffect, useState } from "react";
import './style.css';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../Card/Card";

const PokemonChosed = () => {

    const {state} = useLocation();
    const navigate = useNavigate();

    const [imgPokemon, setImgPokemon] = useState([]);
    const [pokeCharacteristic, setPokeChracteristic] = useState([]);
   
    const [typePokemon, setTypePokemon] = useState([]);
    const [weaknessPokemon, setWeaknessPokemon] = useState([]);
    const [resistancePokemon, setResistancePokemon] = useState([]);

    const [pokeTypeFlyingWeakness, setPokeTypeFlyingWeakness] = useState([]);
    const [pokeTypeFlyingResistance, setPokeTypeFlyingResistance] = useState([]);
    const [ isFlying, setIsFlying] = useState(null);

    const [ isImmune, setIsImmune ] = useState([])
    const [isImmuneFlying, setIsImmuneFlying] = useState([])

    const [evolutionStage, setEvolutionStage] = useState([])
   




    // verificando se o tipo na url se relaciona com o pokemon chamado na tela
    function verifyType(urlType) {
        axios.get(urlType)
        .then(data => {
            // eslint-disable-next-line array-callback-return
            data.data.pokemon.map( verifyPokemon => {
                if(verifyPokemon.pokemon.name === state.name) {
                    setTypePokemon(typePokemon => [...typePokemon, data.data.name]);
                    
                    if(data.data.name === "flying") {
                        setIsFlying(true)
                        setPokeTypeFlyingWeakness(data.data.damage_relations.double_damage_from)
                        setPokeTypeFlyingResistance(data.data.damage_relations.half_damage_from)
                        setIsImmuneFlying(data.data.damage_relations.no_damage_from)                        
                    }else{
                        if(weaknessPokemon.length < 1) {
                            setWeaknessPokemon(data.data.damage_relations.double_damage_from);
                            setResistancePokemon(data.data.damage_relations.half_damage_from);
                            if(data.data.damage_relations.no_dagame_to !== undefined) {
                                setIsImmune(data.data.damage_relations.no_damage_from)                        
                            }
                        }
                    }     
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

    useEffect(() => {

        axios.get(`https://pokeapi.co/api/v2/pokemon-species/${state.id}`)
        .then(data => {
            axios(data.data.evolution_chain.url)
            .then(data2 => {
                
                if(evolutionStage.includes( data2.data.chain.species.name) === false) {
                    setEvolutionStage(evolutionStage => [...evolutionStage, data2.data.chain.species.name])
                }

                if(data2.data.chain.evolves_to[0] !== undefined){
                    if(evolutionStage.includes(data2.data.chain.evolves_to[0].species.name) === false) {
                        setEvolutionStage(evolutionStage => [...evolutionStage, data2.data.chain.evolves_to[0].species.name])
                    }   
                }
                
                if(data2.data.chain.evolves_to[0].evolves_to[0] !== undefined){
                    if(evolutionStage.includes(data2.data.chain.evolves_to[0].evolves_to[0].species.name)  === false) {
                        setEvolutionStage(evolutionStage => [...evolutionStage, data2.data.chain.evolves_to[0].evolves_to[0].species.name])
                    }       
                }

            })
        })
    },[])

    //Buscando url das caracteristicas
    useEffect(()=> {
        setImgPokemon(state.sprites.other.dream_world.front_default)
        axios.get(`https://pokeapi.co/api/v2/characteristic/${state.id}`)
        .then(data => {
            // eslint-disable-next-line array-callback-return
            data.data.descriptions.map( d => {
                if(d.language.name === "en") {
                    setPokeChracteristic(d.description)
                }
            })
        })
    },[]);

    function goToPokemonEvolutionStageRoute(pokeName) {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
        .then(data => {
            console.log("aaaa")
            // navigate(`/pokemon/${pokeName}`, {state : data.data})
        })
    }

    return (
        <div className="cards">
             <div className="container-onepokemon-desc">
                <div className="bloco-onepokemon-image">
                    <div className="onepokemon-image">
                        <img src={imgPokemon} alt="Imagem do Pokemon"  width="250" height="250"></img>
                    </div>
                </div>

                <div className="onepokemon-state" >
                    <div className="onepokemon-name"> 
                        <div className="name"> {state.name} </div>
                        <div> Nº {state.id} </div>
                    </div>
                    <div className="onepokemon-desc"> "{pokeCharacteristic}" </div>
                    <div className="onepokemon-charc">
                        <div>  Experiência Base: <span className="exp">{state.base_experience} </span> </div>
                        <div>  Altura: <span className="height">{state.height / 10} m </span> </div>
                        <div>  Peso: <span className="weight"> {state.weight / 10} Kg</span> </div>
                        <div className="ability-container">  Habilidades: 
                            {state.abilities.map( hab => <div className="ability" key={hab.ability.name}> {hab.ability.name} </div>)}
                        
                        </div>
                    </div>

                </div>
             </div>

            <div className="onepokemon-status-container">
                <h1> Types </h1>
                <div className="status-container">
                    <div className="status">
                        <span className="label-type">Type: </span>
                        <span className={`layout-types first ${typePokemon[0]}`}>{typePokemon[0]}</span> 
                        {typePokemon[1] !== typePokemon[0] ? <span className={`layout-types second ${typePokemon[1]}`}>{typePokemon[1]}</span> : null}
                    </div>

                    <div className="status weak">
                        <span className="label-fraqueza">Fraqueza: </span> 
                            <div >
                                {weaknessPokemon.map(fraquezas => {
                                    if(fraquezas.name === "ground" && isFlying === true) {                                 
                                        return null
                                    }
                                    return <span className={`layout-types ${fraquezas.name}`} key={fraquezas.name}> {fraquezas.name}</span>
                                })}
                                
                                { isFlying && pokeTypeFlyingWeakness.map(fraquezas2 => {
                                    let ez = false;
                                weaknessPokemon.map(a => { 
                                    if(a.name===fraquezas2.name){
                                        return ez = true;
                                    } })
                                    if(ez === true){return null}
                                    return <span className={`layout-types ${fraquezas2.name}` } key={fraquezas2.name}> {fraquezas2.name}</span> 
                                })}                       
                            </div>
                    </div>
                    
                    <div className="status resis">
                        <span className="label-resistencia">Resistência: </span> 

                        <div>
                            {resistancePokemon.map(resistencia => {
                            return <span className={`layout-types ${resistencia.name}`} key={resistencia.name}> {resistencia.name}</span> 
                            })}

                            { isFlying && pokeTypeFlyingResistance.map(resistance2 => {
                                    let ez = false;
                                    resistancePokemon.map(a => { 
                                    if(a.name===resistance2.name){
                                        return ez = true;
                                    } })
                                    if(ez === true){return null}
                                    return <span className={`layout-types ${resistance2.name}` }key={resistance2.name}> {resistance2.name}</span> 
                                })}
                        </div>
                    </div>

                    <div className="status immune">
                        <span className="label-resistencia">Imune: </span> 

                        <div>
                            {isImmune.length > 0 ? isImmune.map(immune => {
                            return <span className={`layout-types ${immune.name}` } key={immune.name}> {immune.name}</span> 
                            }) : null }

                            { isFlying && isImmuneFlying.map(immune2 => {
                                    return <span className={`layout-types ${immune2.name}` } key={immune2.name}> {immune2.name}</span> 
                                })}

                        </div>
                    </div>
                </div>
                
            </div>

            <div className="evolution-container">
                <h1> Evolution </h1>
                <div className="evolutions-pokemons">
                  
                    { evolutionStage.slice(0,evolutionStage.length/2).map( pokemonsEvolutionCardName => {
                        return <Card url={`https://pokeapi.co/api/v2/pokemon/${pokemonsEvolutionCardName}`} key={pokemonsEvolutionCardName}/>

                    }


                        // <button type="button" onClick={goToPokemonEvolutionStageRoute(pokemonsEvolutionCardName)} className="button-pokemonEvolution"> 
                        //     <Card url={`https://pokeapi.co/api/v2/pokemon/${pokemonsEvolutionCardName}`} key={pokemonsEvolutionCardName} />
                        // </button>
                    )}
                </div>


            </div>

            <footer className="footer">

            </footer>
        </div>
    )
}
export default PokemonChosed;