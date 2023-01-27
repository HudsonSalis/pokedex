import React, { useEffect, useState } from "react";
import './style.css';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../Card/Card";
import ProgressBar from "../ProgressBar/ProgressBar";
import TypesOfPokemon from "../Types/Types";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";


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

    const [ ability, setAbility] = useState([]);
    const [category, setCategory] = useState([])


    //Buscando as url dos tipos de pokemons - fire/eletric/bug...
    useEffect( () => {    
        function imgOfPokemon(){
            if(state.sprites.other['official-artwork'].front_default !== null){
                setImgPokemon(state.sprites.other['official-artwork'].front_default)
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
                
            })
        }

        function takeAbilities(){
            state.abilities.map( ability => {
                axios.get(`${ability.ability.url}`)
                .then( dados => {
                    setAbility(hab => [...hab, dados.data.flavor_text_entries[0].flavor_text])
                })
            })
                
        }

        takeType(); 
        imgOfPokemon();
        takeAbilities();

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
            setCategory(data.data.genera[7].genus);
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
            <Header />
            <div className="main-container">   

                <div className="name-container"> 
                    <div className="name-content">
                        <div className="name"> {state.name} </div>
                        <div> Nº {state.id} </div>
                    </div>                 
                </div>

                <div className="container-onepokemon-desc">

                    <div className="bloco-onepokemon-image">
                        <div className="onepokemon-image">
                            <img src={imgPokemon} alt="Imagem do Pokemon"  width="250" height="250"></img>
                        </div>
                    </div>

                    <div className="onepokemon-state" >
                        <div className="onepokemon-desc"> {pokeFrase} </div>
                        <div className="onepokemon-charc">
                            <div className="typePokemons">
                                <TypesOfPokemon typeOfPokemon={state.types[0].type.name}/>
                            
                                {state.types[1] !== undefined ? (
                                    <TypesOfPokemon typeOfPokemon={state.types[1].type.name}/>
                                ) : null}
                        
                            </div>

                            <div className="pokeDados">
                                <div>  Experiência Base: <span className="exp">{state.base_experience} </span> </div>
                                <div>  Altura: <span className="height">{state.height / 10} m </span> </div>
                                <div>  Peso: <span className="weight"> {state.weight / 10} Kg</span> </div>
                                <div>  Categoria: <span className="weight"> {category}</span> </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="onepokemon-status-container">
                    
                    <div className="stats-container">
                        <div className="ability-bloco">
                            <h1 className="title-status"> Habilidades </h1>

                            <div className="ability-container"> 
                                <div className="ability"> 
                                    {state.abilities[0].ability.name}                                                                       
                                </div>   

                                <div className="ability-phrase">   
                                    {ability[0]}                                                                      
                                </div>     
                            </div>
                        </div>

                        <div className="stats-bloco">
                            <h1 className="title-status"> Status </h1>
                            <div className="pokeStats">
                            {state.stats.map( stats => {
                                let result = stats.stat.name.replace(/[^a-zA-Z ]/g, " ");
                            
                                return <div className="stats-single" key={stats.stat.name}>
                                    <div> 
                                        <ProgressBar bgColor="#B8405E" completed={stats.base_stat} />
                                    </div>
                                    <div className="stats-name"> {result} </div>
                                </div>                   
                            })}            
                            </div>
                        </div>
                    </div>

                    <div className="all-pokemon-types">
                        <h1 className="title-types"> Tipos </h1>
                        <div className="status-container">
                            <div className="status weak">
                                <span className="label-fraqueza">Fraqueza </span> 
                                <div className="fraquezas-container">
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
                                        if(hasDoubleWeakness === true){return <TypesOfPokemon key={fraquezas.name} typeOfPokemon={fraquezas.name} isDoubleWeaker={true}/>
                                    }
                                        return <TypesOfPokemon key={fraquezas.name} typeOfPokemon={fraquezas.name}/>
                                    })}
                                    
                                        {/* Mostrando e tratando possiveis problemas das fraquezas do 2 tipo*/}
                                    {secondTypeWeakness.map(fraquezas2 => {
                                        let sameWeak = false;
                                        let  sameWeakAndResistance = false;
                                        weaknessPokemon.map(a => { 
                                            if(a.name===fraquezas2.name){
                                                return sameWeak = true;
                                            }
                                        });

                                        resistancePokemon.map( resistance => {
                                            if(resistance.name === fraquezas2.name)
                                            return sameWeakAndResistance = true;
                                        });

                                        if( sameWeak === true || sameWeakAndResistance === true ){return null}
                                        return <TypesOfPokemon key={fraquezas2.name} typeOfPokemon={fraquezas2.name}/>
                                    })}                       
                                </div>
                            </div>
                            
                            <div className="status resis">
                                <span className="label-resistencia">Resistência </span> 

                                <div className="container-resistencia">
                                    {resistancePokemon.map(resistencia => {
                                        let sameResistanceAndWeaker = false;
                                        secondTypeWeakness.map(secondWeakness => { 
                                            if(resistencia.name === secondWeakness.name ){
                                                return sameResistanceAndWeaker = true;
                                            }
                                        });
                                        if(sameResistanceAndWeaker === true) {return null}
                                    return <TypesOfPokemon key={resistencia.name} typeOfPokemon={resistencia.name}/>
                                    })}

                                    {secondTypeResistance.map(resistance2 => {
                                            let sameResistance = false;
                                            let sameResistanceAndWeak = false;

                                            resistancePokemon.map(resistance => { 
                                                if(resistance.name===resistance2.name){
                                                    return sameResistance = true;
                                                } 
                                            });

                                            weaknessPokemon.map( weakness => {
                                                if(resistance2.name === weakness.name) {
                                                    return sameResistanceAndWeak = true;
                                                }
                                            })
                                            
                                            if(sameResistance === true || sameResistanceAndWeak === true){return null}
                                            return  <TypesOfPokemon key={resistance2.name} typeOfPokemon={resistance2.name}/> 
                                        })}
                                        {resistancePokemon.length < 1 && secondTypeResistance.length < 1 ? 
                                            <span className="none">None</span> : null

                                        }
                                </div>
                            </div>

                            <div className="status immune">
                                <span className="label-resistencia">Imune </span> 

                                <div className="container-immune">
                                    {isImmune.length > 0 ? isImmune.map(immune => {
                                    return <TypesOfPokemon key={immune.name} typeOfPokemon={immune.name}/> 
                                    }) : null }

                                    { isImmuneSecondType.length > 0 ? isImmuneSecondType.map(immune2 => {
                                            return  <TypesOfPokemon key={immune2.name} typeOfPokemon={immune2.name}/> 
                                    }): null}

                                    {isImmune.length < 1 && isImmuneSecondType.length < 1 ? (
                                        <span className="none">None</span>
                                    ): null}

                                </div>
                            </div>

                            <div className="status immune ineficaz">
                                <span className="label-resistencia">Ineficaz  </span> 
                                <div className="container-ineficaz">
                                    {isIneffective.length > 0 ? isIneffective.map(ineffective => {
                                        return <TypesOfPokemon key={ineffective.name} typeOfPokemon={ineffective.name}/>
                                    }) : null }

                                    {isIneffectiveSecondType.length > 0 ? isIneffectiveSecondType.map(ineffective2 => {
                                        return<TypesOfPokemon key={ineffective2.name} typeOfPokemon={ineffective2.name}/> 
                                    }) : null }

                                    {isIneffective.length < 1 && isIneffectiveSecondType.length < 1 ? (
                                        <span className="none">None</span>
                                    ): null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="evolution-container">
                    <h1 className="title-evolution"> Evoluções </h1>
                    <div className="evolution-bloco">            
                        <div className="evolutions-pokemons">
                            {hasEvolution ? evolutionStage.slice(0,evolutionStage.length/2).map( pokemonsEvolutionCardName => (
                                <button 
                                    type="button" 
                                    key={pokemonsEvolutionCardName}
                                    onClick={() => goToPokemonEvolutionStageRoute(pokemonsEvolutionCardName)} 
                                    className="button-pokemonEvolution"> 
                                    <Card url={`https://pokeapi.co/api/v2/pokemon/${pokemonsEvolutionCardName}`} key={pokemonsEvolutionCardName} />                
                                </button>
                            )) : <span>Esse Pokémon não tem Evolução </span>}
                        </div>
                    </div>
        
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default PokemonChosed;