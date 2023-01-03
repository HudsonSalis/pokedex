import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
  } from "react-router-dom";
import App from "../App";
import PokemonChosed from "../components/Pokemon/OnePokemonData";

import OnePokemonPage from "./OnePokemon/OnePokemonPage";



const Root = () => {

    return(

        <Router>
            <Routes>
                <Route exact path="/"  element={ <App /> } />
                <Route exact path="/pokemon/:name"  element={ <PokemonChosed /> } />
                
            </Routes>
        </Router>
    );
};

export default Root;