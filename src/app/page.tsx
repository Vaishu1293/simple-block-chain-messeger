'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x72531Ebd8b9e2348D83A90DFdD80e813ea6dd4F2";

const ABI = [
  "function message() view returns (string)",
  "function updateMessage(string _newMessage) public"
];

export default function Home() {
  const [message, setMessage] = useState('');
  const [input, setInput] = useState('');
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    const loadContract = async () => {
      if (typeof window.ethereum === 'undefined') {
        alert("Please install MetaMask");
        return;
      }

      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        setContract(contract);

        const current = await contract.message();
        setMessage(current);
      } catch (err) {
        console.error("Contract call failed:", err);
      }
    };

    loadContract();
  }, []);

  const update = async () => {
    if (!input || !contract) return;
    try {
      const tx = await contract.updateMessage(input);
      await tx.wait();
      const updated = await contract.message();
      setMessage(updated);
      setInput('');
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">🪄 Soul Contract DApp</h1>
      <p className="mb-2">📝 Current On-chain Message:</p>
      <div className="bg-gray-900 p-4 rounded shadow mb-4 w-96 text-center">{message || "Loading..."}</div>
      <input
        className="border p-2 w-96 rounded mb-2"
        placeholder="Enter new soul message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={update}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Update Message
      </button>
    </div>
  );
}
