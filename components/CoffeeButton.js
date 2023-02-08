import abi from '../utils/BuyMeACoffee.json';
import React from 'react';
import { ethers } from 'ethers'
import toast from 'react-hot-toast';


// Contract Address & ABI
const contractAddress = "0x3FD8878D672C0eD2b225E1abaDA254004e5C6fd1";
const contractABI = abi.abi;

// CoffeeButton: Component that displays a button for 
// buying a coffee with Ethereum
function CoffeeButton(props) {

  const buyCoffee = async () => {
    // Check if the price is invalid
    if (!props.price) {
      return toast.error('Invalid price');
    }


    try {
      // Check if metamask is installed
      const { ethereum } = window;
      if (ethereum) {
        // Create a new Web3 provider and signer
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        // Create a new instance of the smart contract
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        // Check the size of coffee being purchased and log the action
        if (props.price === "0.001" || props.price === 0.001) {
          toast.success("Buying coffee..");
          console.log("buying coffee..");
        } else {
          toast.success("buying Large coffee");
          console.log("buying Large coffee..");
        }
        // Call the buyCoffee function of the smart contract
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          // Pass the name and message as arguments
          props.name ? props.name : "anon",
          props.message ? props.message : "Enjoy your coffee!",
          // Include the price as value
          { value: ethers.utils.parseEther(props.price) }
        );

        // Wait for the transaction to be mined
        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);
        toast.success("mined ", coffeeTxn.hash);

        // Log the result of the purchase
        if (props.price === "0.001" || props.price === 0.001) {
          toast.success("Coffee purchased!");
          console.log("Coffee purchased!");
        } else {
          toast.success("Large coffee purchased!");
          console.log("Large Coffee purchased!");
        }



      }
    } catch (error) {
      // Check if the error was due to the user rejecting the transaction
      if (error.includes("user rejected transaction")) {
        toast.error("User rejected transaction");
      } else {
        toast.error(error.message);
      }
    }
  };
  return (
    <>
      <button
        type="button"
        onClick={buyCoffee}
        className="bg-amber-900 px-4 py-2 rounded-full cursor-pointer text-white m-5 hover:bg-amber-700 transition"
      >
        {`Send Coffee for ${props.price} ETH`}
      </button>
    </>
  )
}


export default CoffeeButton;