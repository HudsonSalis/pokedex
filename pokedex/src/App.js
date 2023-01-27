import './App.css';
import React ,{useEffect, useState} from 'react';
import axios from 'axios';
import Search from './components/Search/Search';
import PokemonsFromKanto from './components/Kanto/PokemonsFromkanto';

const App = () => { 
  
  const [pokemons, setPokemons] = useState([]);
  
  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=50`)
    .then( dados => (setPokemons(dados.data.results) ))

  },[]);

  return (
    <div className="App">
      <div className='te'>
        <div>
          <h1 className=''>
              ALL POKEMONS FROM KANTO
          </h1>
        </div>

        <Search />
      
        <header className="App-header">
          {pokemons.map( (p , index) => (
            <PokemonsFromKanto url={ p.url }  key={index}/>
          ))}
        </header> 
      </div>
     

    </div>
  );
  
}

export default App;
