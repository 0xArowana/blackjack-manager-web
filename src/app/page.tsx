"use client";

import {
  useAccount,
  useWriteContract,
  useReadContract,
  useReadContracts,
  useWatchContractEvent,
} from "wagmi";
import { pitAbi, tableAbi } from "../abi";
import { useEffect, useState } from "react";
import { ContractFunctionParameters } from "viem";
import Modal from "./ui/Modal";

function App() {
  const account = useAccount();
  const isConnected = account.status === "connected";
  const { writeContract } = useWriteContract();
  const address = "0xff844a27C2C80649Cb76d56f9A36c3Cd274Dfb49";
  const [tableReads, setTableReads] = useState<ContractFunctionParameters[]>();
  const [showCreateTable, setShowCreateTable] = useState(false);

  // useWatchContractEvent({
  //   address,
  //   abi: pitAbi,
  //   eventName: 'TableCreated',
  //   onLogs: (logs) => console.log("Table Created", logs),
  //   onError: (error) => console.log("Error", error)
  // })

  // writeContract(
  //   {
  //     abi: pitAbi,
  //     address,
  //     functionName: "createTable",
  //     args: [
  //       7, // _maxPlayers
  //       [
  //         // _betRange
  //         0, // min
  //         100, // max
  //       ],
  //       [
  //         // _rules
  //         2, // deckCount
  //         false, // dealerHitOnSoft17
  //         false, // allowDoubleAfterSplit
  //         1, // doubleRule
  //         3, // maxResplitHands
  //         true, // allowResplitAces
  //         true, // allowHitSplitAces
  //         true, // allowLateSurrender
  //         true, // allowInsurance
  //         false, // sixToFive
  //       ],
  //       "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", // _token
  //     ],
  //   },
  //   {
  //     onError: (e) => console.log(e),
  //   }
  // );

  const { data: tables, error: err } = useReadContract({
    address,
    abi: pitAbi,
    functionName: "getTables",
    args: [account.address],
  });

  useEffect(() => {
    const reads: ContractFunctionParameters[] = [];

    (tables as string[])?.forEach((address) => {
      const contract: any = {
        address,
        abi: tableAbi,
        functionName: "getTableInfo",
      };
      reads.push(contract);
    });

    setTableReads(reads);
  }, [tables]);

  const { data: tableInfo } = useReadContracts({ contracts: tableReads });

  return (
    <>
      <div>
        {isConnected ? (
          <>
            <div>
              <h1>Tables</h1>
              {tableInfo?.map((table, index) => {
                const info: any = table.result;
                return (
                  <a
                    className="flex flex-col max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 gap-2"
                    key={`table-card-${index}`}
                    href="#"
                  >
                    <div>
                      <div className="b">Token</div>
                      {info[0]}
                    </div>
                    <div>
                      <h3>Players</h3>
                      {info[1]}
                    </div>
                  </a>
                );
              })}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                document.getElementById("create_table_modal").showModal();
              }}
            >
              Create Table
            </button>
          </>
        ) : (
          <div>Please connect your wallet</div>
        )}
      </div>

      <dialog id="create_table_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default App;
