import logo from './logo.svg';
import './App.css';
import { useMetaMask } from "metamask-react";
import { ethers } from 'ethers';
import ABI from './abi.json';
import { useState } from 'react';

const ADDRESS = "0xa1F904a2d45Edc6D4b81873f98810090267Af7e4";

const loanContract = new ethers.Contract(ADDRESS, ABI);

function App() {
  const [loanAmount, setLoanAmount] = useState(1);
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  async function takeLoan() {
    // Get Access To Browser Provider via MetaMask
    const provider = new ethers.BrowserProvider(ethereum);
    // Get Access To Signer i.e Selected Metamask Account
    const signer = await provider.getSigner();
    // Make Smart Contract Method/Function Call
    loanContract.connect(signer).takeLoan(loanAmount, { value: loanAmount * 1.35 });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {status === "initializing" && <div>Synchronisation with MetaMask ongoing...</div>}

        {status === "unavailable" && <div>MetaMask not available :(</div>}

        {status === "notConnected" && <button onClick={connect}>Connect to MetaMask</button>}

        {status === "connecting" && <div>Connecting...</div>}

        {status === "connected" && <div>
          <div>Connected account {account} on chain ID {chainId}</div>
          <input onChange={event => setLoanAmount(event.target.value)} />
          <button onClick={takeLoan}>Take Loan</button>
        </div>
        }
      </header>
    </div>
  );
}

export default App;
