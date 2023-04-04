import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { useEffect } from 'react';
import { useState } from 'react';
function App() {
  
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('20');
  const [message, setMessage] = useState();

useEffect(() => {
  
  const init = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    setManager(manager);
    setPlayers(players);
    setBalance(balance);
    
  }
  init();
}, []);
    if(window.ethereum){
    // Do something 
    console.log("kooone laghe pooya");
    window.ethereum.request({method:'eth_requestAccounts'})
    .then(res=>{
            // Return the address of the wallet
            // console.log(res) 
    })
  }else{
    alert("install metamask extension!!")
  }

  const submitForm = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
    });
    setMessage('You have been entered!');
  };

  const onPickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage('A winner has been picked!');
  };
  //web3.eth.getAccounts().then(console.log);
  return (
    <div>
            
      
              <p>manager is {manager}</p><br>
              </br>
              <p>there are currently {players.length} people in this lottery</p>
      <br/>
      <p>to win {web3.utils.fromWei( web3.utils.toBN(balance),'ether')} </p>
      <hr></hr>
    <form onSubmit={submitForm}>
      <h4>Want to try your luck?</h4>
      <div>
        <label>
          Amount of ether to enter
        </label>
        <input 
        value={value}
        onChange={e => setValue(e.target.value)}
        /><button>Enter</button>
        <p>your input is {value}</p>
      </div>
    </form>     
    <div>
        <h4>Ready to pick a winner?</h4>
        <button onClick={onPickWinner}>Pick a winner!</button>
      </div>
     <h1>{message}</h1>

    </div>
  );
}

export default App;
