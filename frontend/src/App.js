// import logo from './logo.svg';
import './App.css';
import { useMetaMask } from "metamask-react";
import { ethers } from 'ethers';
import ABI from './abi.json';
import { useEffect, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from 'react-promise-tracker';
import Loader from 'react-promise-loader';

const ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const MUMBAI_RPC = process.env.REACT_APP_MUMBAI_RPC;

const loanContract = new ethers.Contract(ADDRESS, ABI);

function App() {
  const [loanAmount, setLoanAmount] = useState(0);
  const [logs, setLogs] = useState([]);
  const { status, connect, account, chainId, ethereum, switchChain, addChain } = useMetaMask();

  useEffect(() => {
    // Define Get Logs Function
    async function getLoanLogs() {
      // Get Access To Browser Provider via MetaMask
      const provider = new ethers.providers.JsonRpcProvider(MUMBAI_RPC);
      // Check If User Is On Correct Network
      const network = await provider.getNetwork();
      if (network.chainId === ethers.BigNumber.from(chainId).toNumber()) {
        const logs = await provider.getLogs({ ...loanContract.filters.LoanDisbursed(account), fromBlock: 39061472 });
        // Set Logs
        setLogs(logs);
      } else {
        // Set Logs to Empty
        setLogs([]);
      }
    }

    // Use Get Logs Function & Track Promise
    if (ethereum) {
      trackPromise(getLoanLogs());
    }
  }, [ethereum, account, chainId]);

  async function takeLoan() {
    // Switch Chain If Not Correctly Selected
    if (chainId !== '0x13881') {
      try {
        await switchChain('0x13881');
      } catch (error) {
        // If Failure Atempt Add Chain To Metamask
        await addChain({
          chainId: "0x13881",
          chainName: "Matic Mumbai",
          nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
          rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
        });
      }
    }
    // Get Access To Browser Provider via MetaMask
    const provider = new ethers.providers.Web3Provider(ethereum);
    // Get Access To Signer i.e Selected Metamask Account
    const signer = provider.getSigner();
    // Make Smart Contract Method/Function Call
    await loanContract.connect(signer).takeLoan(ethers.utils.parseEther(loanAmount), {
      value: ethers.utils.parseEther((loanAmount * 1.35).toFixed(18)),
      // value: new BigNumber(String(loanAmount)).multipliedBy(1.35).shiftedBy(18).toString()
    });
  }

  return (
    <div className="App container">
      <Loader promiseTracker={usePromiseTracker} color={'#3d5e61'} background={'rgba(255,255,255,.5)'} />
      <header className="App-header"><br />
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>Welcome To DecentraLoans</p>
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        {status === "initializing" && <div>Synchronisation with MetaMask ongoing...</div>}

        {status === "unavailable" && <div>MetaMask not available :(</div>}

        {status === "notConnected" && <div>
          <br />
          <button className="button is-success" onClick={() => trackPromise(connect())}>Connect to MetaMask</button>
        </div>}

        {status === "connecting" && <div>Connecting...</div>}

        {status === "connected" && <div>
          <hr />
          <div>Connected account {account} on chain ID {chainId} or {ethers.BigNumber.from(chainId).toNumber()}</div>
          <hr />
          <div className="field is-grouped is-grouped-centered">
            <div className="control">
              <input className="input" type="text" placeholder='Loan Amount In MATIC' onChange={event => setLoanAmount(event.target.value)} />
            </div>
            <div className="control">
              <button className="button is-info" onClick={() => trackPromise(takeLoan())}>Take Loan</button>
            </div>
          </div>
          <hr />
          {logs.map(log => <div key={log.transactionHash}><br /><pre className='is-size-7'>{JSON.stringify(log, null, 4)}</pre></div>)}
        </div>
        }<br /><br /><br />
      </header>
    </div>
  );
}

export default App;
