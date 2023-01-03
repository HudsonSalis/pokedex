import React, { useState } from "react";  
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './style.css';



const Search = () => {

    const [search, setSearch] = useState('');
    const [onePokemon, setOnePokemon] = useState([]);
    const [verifySearch, setVerifySearch] = useState(null);
    const navigate = useNavigate();
   

    const handleChange = (event) => {
        setSearch(event.target.value);
      };

 
    function handleClick() {
      if( search.length < 2) {
        return console.log("ntem nada")
      }
      axios.get(`https://pokeapi.co/api/v2/pokemon/${search}`)
      .then( dados => {
        
          //Enviando dados do pokemon para a rota com o nome dele
          navigate(`/pokemon/${search}`, {state: dados.data})
      
      })
      .catch(e => console.log("Nome Errado meu caro"))
    }

    return (
        <div className="container-search">
          <input placeholder='digite aqui...'
            id="search"
            //value={search}
            onChange={handleChange}
          ></input>
          
           <button type="button" onClick={handleClick}> ENVIAR</button>
   

   
      </div>
    );
};




export default Search;