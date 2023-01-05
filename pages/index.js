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
  var [totalTip, setTotalTip] = useState("");

  const onNameChange = (event) => {
    setName(event.target.value);
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

    const coffeeObj = { quantity: 1, tip: "0,001 ETH"};


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
            <div className="flex flex-col">
              <form>
                <div>
                  <label>
                    Name
                  </label>
                  <br />
                  <input
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
                    rows={3}
                    placeholder="Enjoy your coffee!"
                    id="message"
                    onChange={onMessageChange}
                    required
                  >
                  </textarea>
                </div>
                <div className='flex flex-col align-center justify-center'>
                 <CoffeeButton quantity={1} coffeeType={"Coffee"} tip={`0,001 ETH`} />
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
            <div key={idx} style={{ border: "2px solid", "borderRadius": "5px", padding: "5px", margin: "5px" }}>
              <p style={{ "fontWeight": "bold" }}>"{memo.message}"</p>
              <p>From: {memo.name} at {memo.timestamp.toString()}</p>
            </div>
          )
        }))}

        <footer className="m-5 pt-5 w-full flex justify-center border-t">
          <a
            href="https://alchemy.com/?a=roadtoweb3weektwo"
            target="_blank"
            rel="noopener noreferrer"
            className='p-5'
          >
            Created by @serrano-matias
          </a>
        </footer>
      </div>
    </>
  )
}
