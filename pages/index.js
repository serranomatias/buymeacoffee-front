import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css';
import abi from '../utils/BuyMeACoffee.json';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import toast, { Toaster } from 'react-hot-toast';
import CoffeeButton from '../components/CoffeeButton';



export default function Home() {


  // Contract Address & ABI
  const contractAddress = "0x3FD8878D672C0eD2b225E1abaDA254004e5C6fd1";
  const contractABI = abi.abi;


  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);
  const [totalTip, setTotalTip] = useState(0);

  const onNameChange = (event) => {
    setName(event.target.value);
  }
  const onTipChange = (event) => {
    if(event.target.value > 0){
      setTotalTip(event.target.value);
    } else {
      setTotalTip(1);
    }
  }
  const coffeePrice = () =>{
    return totalTip * 0.001;
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  }

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Please install Metamask");
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

 


  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );


        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("MetaMask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();
     // Clear the form fields.
     setName("");
     setMessage("");


    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    }
  }, []);
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Buy Matias a Coffee!</title>
          <meta name="description" content="Tipping site" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div><Toaster /></div>
          <h1 className="font-bold text-6xl m-10">
            Buy Matias a Coffee!
          </h1>

          {currentAccount ? (
            <div className="flex w-auto flex-col p-10 rounded-xl">
              <form className='w-full flex flex-col items-center'>
                <div>
                  <label>
                    Name
                  </label>
                  <br />
                  <input
                  className='rounded-md pl-2'
                    id="name"
                    type="text"
                    placeholder="anon"
                    onChange={onNameChange}
                  />
                </div>
                <br />
                <div className="formgroup">
                  <label>
                    Send Matias a message
                  </label>
                  <br />
                  <textarea
                  className='rounded-md pl-2'
                    rows={3}
                    placeholder="Enjoy your coffee!"
                    id="message"
                    onChange={onMessageChange}
                    required
                  >
                  </textarea>
                </div>
                <div className='mt-5'>
                <h2 className='text-center'>
                  How many coffee's do you want to send?</h2>
                  <div className='flex justify-center items-center align-center gap-5 mt-5'>
                
                    <span className='text-5xl'>
                      ☕
                    </span>
                    <span 
                    onClick={() => {
                      setTotalTip(1)}}
                    className='text-3xl bg-amber-600 rounded-full w-12 h-12 flex items-center justify-center text-white cursor-pointer  hover:bg-amber-900 focus:bg-amber-900'>
                      1
                    </span>
                    <span 
                    onClick={() => {
                      setTotalTip(3)}}
                    className='text-3xl bg-amber-600 rounded-full w-12 h-12 flex items-center justify-center text-white cursor-pointer  hover:bg-amber-900'>
                      3
                    </span>
                    <span 
                    onClick={() => {
                      setTotalTip(5)

                    }}
                    className='text-3xl bg-amber-600 rounded-full w-12 h-12 flex items-center justify-center text-white cursor-pointer hover:bg-amber-900'>
                      5
                    </span>
                    <input
                    min="1"
                    max="5000"
                    type="number"
                    placeholder={totalTip}
                    onChange={onTipChange}
                    value={totalTip}
                    className='text-3xl bg-gray-100 resize-none border-2 border-gray-200 w-12 h-12 active:bg-gray-400 pl-2 text-center overflow-hidden'
                    >
                     
                    </input>
                  </div>
                </div>
                <div className='flex flex-col align-center justify-center'>
                 <CoffeeButton quantity={1} coffeeType={"Coffee"} tip={`0,001 ETH`} price={coffeePrice().toString()} name={name} message={message}/>
                </div>
              </form>
            </div>
          ) : (
            <button onClick={connectWallet} className="bg-gray-200 px-4 py-2 rounded-full cursor-pointer font-bold text-white"> Connect your wallet </button>
          )}

        </main>

        {currentAccount && (<h1>Coffee received!</h1>)}

        {currentAccount && (memos.map((memo, idx) => {
          return (
            <div key={idx} className="p-8" style={{ border: "2px solid", "borderRadius": "5px", padding: "5px", margin: "5px", display: "grid", placeItems: "center"}}>
              <p style={{ "fontWeight": "bold" }}>"{memo.message}"</p>
              <p>From: {memo.name}</p>
            </div>
          )
        }))}

        <footer className="m-5 pt-5 w-full flex justify-center border-t">
          <a
            href="https://www.instagram.com/matiseerrano"
            target="_blank"
            rel="noopener noreferrer"
            className='p-5'
          >
            Created by @serranomatias
          </a>
        </footer>
      </div>
    </>
  )
}
