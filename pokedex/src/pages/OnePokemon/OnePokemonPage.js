import React from "react";  
import PokemonChosed from "../../components/Pokemon/OnePokemonData";
import { useLocation } from "react-router-dom";





const OnePokemonPage = () => {

    const {state} = useLocation();

    return (
        <h1>
            {state.name}

            {state.abilities.map( (dd) => (<p> {dd.ability.name}</p>) )}
        </h1>
    );  

}

export default OnePokemonPage;