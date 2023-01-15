import React, { useEffect, useState } from "react";
import './style.css';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../Card/Card";
import ProgressBar from "../ProgressBar/ProgressBar";


const PokemonChosed = () => {

    const {state} = useLocation();

    const navigate = useNavigate();

    const [imgPokemon, setImgPokemon] = useState([]);
    const [pokeFrase, setPokeFrase] = useState([]);
    const [ hasTwoTypes, setHasTwoTypes] = useState(null);


    const [weaknessPokemon, setWeaknessPokemon] = useState([]);
    const [resistancePokemon, setResistancePokemon] = useState([]);

    const [secondTypeWeakness, setSecondTypeWeakness] = useState([]);
    const [secondTypeResistance, setSecondTypeResistance] = useState([]);
    

    const [ isImmune, setIsImmune ] = useState([]);
    const [isImmuneSecondType, setIsImmuneSecondType] = useState([]);

    const [evolutionStage, setEvolutionStage] = useState([]);
    const [hasEvolution, setHasEvolution] = useState(null);

    const [isIneffective, setIsIneffective] = useState([]);
    const [isIneffectiveSecondType, setIsIneffectiveSecondType] = useState([]);


    //Buscando as url dos tipos de pokemons - fire/eletric/bug...
    useEffect( () => {    
        function imgOfPokemon(){
            if(state.sprites.other.dream_world.front_default === null){
                setImgPokemon(state.sprites.other.home.front_default)
            }else{
                setImgPokemon(state.sprites.other.dream_world.front_default)
            }
        }

        function takeType(){
            axios.get(`https://pokeapi.co/api/v2/type/${state.types[0].type.name}`)
            .then(data => {
                setWeaknessPokemon(data.data.damage_relations.double_damage_from);
                setResistancePokemon(data.data.damage_relations.half_damage_from);
    
                if(data.data.damage_relations.no_damage_to !== undefined) {
                    setIsIneffective(data.data.damage_relations.no_damage_to);
                }              
                if(data.data.damage_relations.no_dagame_from !== undefined) {
                    setIsImmune(data.data.damage_relations.no_damage_from)                        
                } 
            })
        }

        function takeSecondType() {
            axios.get(`https://pokeapi.co/api/v2/type/${state.types[1].type.name}`)
            .then(data => {
                setSecondTypeWeakness(data.data.damage_relations.double_damage_from);
                setSecondTypeResistance(data.data.damage_relations.half_damage_from);
                setIsImmuneSecondType(data.data.damage_relations.no_damage_from);
                setIsIneffectiveSecondType(data.data.damage_relations.no_damage_to)
                setHasTwoTypes(true); 
            })
        }

        takeType(); 
        imgOfPokemon();

        if(state.types[1] !== undefined){
            takeSecondType();
        }

    },[]);

    // CADEIA DE EVOLUÇÕES
    useEffect(() => {
        axios.get(`https://pokeapi.co/api/v2/pokemon-species/${state.id}`)
        .then(data => {
            //Pegando frase do Pokemon 
            setPokeFrase(data.data.flavor_text_entries[8].flavor_text);
            axios(data.data.evolution_chain.url)
            .then(data2 => {
                
                if(data2.data.chain.evolves_to[0] !== undefined || data2.data.chain.evolves_to[0].evolves_to[0] !== undefined){
                    setHasEvolution(true) 
                    if(evolutionStage.includes( data2.data.chain.species.name) === false) {
                        setEvolutionStage(evolutionStage => [...evolutionStage, data2.data.chain.species.name])
                    }

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


    function goToPokemonEvolutionStageRoute(pokeName) {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
        .then(data => {
            navigate(`/pokemon/${pokeName}`, {state : data.data});
            window.location.reload(false);
            window.scrollTo(0, 0);
        });
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
                    <div className="onepokemon-desc"> "{pokeFrase}" </div>
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
                        <span className="label-type">Types: </span>
                        <span className={`layout-types first ${state.types[0].type.name}`}>{state.types[0].type.name}</span> 
                        {state.types[1] !== undefined ? (
                            <span className={`layout-types ${state.types[1].type.name}`}>{state.types[1].type.name}</span> 

                        ) : null}
                        
                      
                    </div>

                    <div className="status weak">
                        <span className="label-fraqueza">Fraqueza: </span> 
                            <div >
                                {/* Mostrando e tratando possiveis problemas das fraquezas do 1 tipo*/}
                                {weaknessPokemon.map(fraquezas => {
                                    let hasDoubleWeakness = false;
                                    let hasSameWeakAndResistance = false;
                                    let hasSameWeakAndImmune = false;

                                    secondTypeResistance.map( secondResistencia => {
                                        if(secondResistencia.name === fraquezas.name) {
                                            return hasSameWeakAndResistance = true;
                                        }
                                    });

                                    secondTypeWeakness.map( secondFraqueza => {
                                        if(secondFraqueza.name === fraquezas.name) {
                                            return hasDoubleWeakness = true;
                                        }
                                    });

                                    isImmuneSecondType.map( secondImmune => {
                                        if( secondImmune.name === fraquezas.name){
                                            return hasSameWeakAndImmune = true;
                                        }
                                    })

                                    if(hasSameWeakAndResistance === true || hasSameWeakAndImmune === true){return null}
                                    if(hasDoubleWeakness === true){return <span className={`layout-types doubleWeak ${fraquezas.name}`} key={fraquezas.name}> 4x {fraquezas.name}</span>
                                }
                                    return <span className={`layout-types ${fraquezas.name}`} key={fraquezas.name}> {fraquezas.name}</span>
                                })}
                                
                                 {/* Mostrando e tratando possiveis problemas das fraquezas do 2 tipo*/}
                                {secondTypeWeakness.map(fraquezas2 => {
                                    let ez = false;
                                    let ez2 = false;
                                    weaknessPokemon.map(a => { 
                                        if(a.name===fraquezas2.name){
                                            return ez = true;
                                        }
                                    });

                                    resistancePokemon.map( r => {
                                        if(r.name === fraquezas2.name)
                                        return ez2 = true;
                                    });

                                    if( ez === true || ez2 === true ){return null}
                                    return <span className={`layout-types ${fraquezas2.name}` } key={fraquezas2.name}> {fraquezas2.name}</span> 
                                })}                       
                            </div>
                    </div>
                    
                    <div className="status resis">
                        <span className="label-resistencia">Resistência: </span> 

                        <div>
                            {resistancePokemon.map(resistencia => {
                                let ez = false;
                                secondTypeWeakness.map(b => { 
                                    if(resistencia.name === b.name ){
                                        return ez = true;
                                    }
                                });
                                if(ez === true) {return null}
                            return <span className={`layout-types ${resistencia.name}`} key={resistencia.name}> {resistencia.name}</span> 
                            })}

                            {secondTypeResistance.map(resistance2 => {
                                    let ez = false;
                                    let ez2 = false;

                                    resistancePokemon.map(a => { 
                                        if(a.name===resistance2.name){
                                            return ez = true;
                                        } 
                                    });

                                    weaknessPokemon.map( wp => {
                                        if(resistance2.name === wp.name) {
                                            return ez2 = true;
                                        }
                                    })
                                    
                                    if(ez === true || ez2 === true){return null}
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

                            { isImmuneSecondType.length > 0 ? isImmuneSecondType.map(immune2 => {
                                    return <span className={`layout-types ${immune2.name}` } key={immune2.name}> {immune2.name}</span> 
                             }): null}

                            {isImmune.length < 1 && isImmuneSecondType.length < 1 ? (
                                <p>None</p>
                            ): null}

                        </div>
                    </div>

                    <div className="status immune ineficaz">
                        <span className="label-resistencia">Ineficaz contra: </span> 
                        <div>
                            {isIneffective.length > 0 ? isIneffective.map(ineffective => {
                                return <span className={`layout-types ${ineffective.name}` } key={ineffective.name}> {ineffective.name}</span> 
                            }) : null }

                            {isIneffectiveSecondType.length > 0 ? isIneffectiveSecondType.map(ineffective2 => {
                                return <span className={`layout-types ${ineffective2.name}` } key={ineffective2.name}> {ineffective2.name}</span> 
                            }) : null }

                            {isIneffective.length < 1 && isIneffectiveSecondType.length < 1 ? (
                                <p>None</p>
                            ): null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="stats-container">
                <h1> Status </h1>
                <div className="pokeStats">
                 {state.stats.map( stats => (
                    <div key={stats.stat.name}>
                        <div> 
                            <ProgressBar bgColor="#B8405E" completed={stats.base_stat} />
                        </div>
                        <div className="stats-name">  {stats.stat.name}  </div>
                    </div>                   
                  ))}            
                </div>
            </div>

            <div className="evolution-container">
                <h1> Evolution </h1>
                <div className="evolutions-pokemons">
                    {hasEvolution ? evolutionStage.slice(0,evolutionStage.length/2).map( pokemonsEvolutionCardName => (
                        <button 
                            type="button" 
                            key={pokemonsEvolutionCardName}
                            onClick={() => goToPokemonEvolutionStageRoute(pokemonsEvolutionCardName)} 
                            className="button-pokemonEvolution"> 
                            <Card url={`https://pokeapi.co/api/v2/pokemon/${pokemonsEvolutionCardName}`} key={pokemonsEvolutionCardName} />                
                        </button>
                    )) : <div>Esse Pokémon não tem Evolução </div>}
                </div>
            </div>

            <footer className="footer">Footer</footer>
        </div>
    )
}

export default PokemonChosed;