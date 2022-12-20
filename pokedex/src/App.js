import './App.css';
import React ,{useEffect, useState} from 'react';
import axios from 'axios';
import Card from './components/pages/Card';
import PokemonChosed from './components/Card/pokemonChosed';

function App() {

  const [pokemons, setPokemons] = useState([]);
  const [pokemons2, setPokemons2] = useState([]);
  const [search, setSearch] = useState('');
  const [showOnePokemon, setShowOnePokemon] = useState(null)


  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=50`)
    .then( dados => (setPokemons(dados.data.results) ))

  },[]);

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  function handleClick() {
    if( search.length < 2) {
      return console.log("ntem nada")
    }
    axios.get(`https://pokeapi.co/api/v2/pokemon/${search}`)
    .then( dados => {
      setPokemons2(dados.data);  
      setShowOnePokemon(true)
    })
    .catch(e => console.log("nope"))

    
  }


  return (
    <div className="App">
      <div>
        <h1 className=''>
            ALL POKEMONS FROM KANTO
        </h1>
        <div>
          <input placeholder='digite aqui...'
            id="search"
            //value={search}
            onChange={handleChange}
            ></input>
          <button type='search' onClick={handleClick}>Enviar</button>
        </div>
     
      </div>
     
      <header className="App-header">
        
 
        {pokemons.map( (p , index) => (
          <Card url={ p.url }  key={index}/>
        ))}

        { showOnePokemon && 
          <div className='pokemon-escolhido-open'>
            <button className="botao-pokemon-escolhido" type='button' onClick={() => setShowOnePokemon(false) }>x</button>
            <PokemonChosed  dados={pokemons2} key={pokemons2.id}/> 
          </div>
        }
       
      

    
      </header> 
    </div>
  );
}

export default App;
