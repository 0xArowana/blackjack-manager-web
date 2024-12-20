"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useWriteContract,
  useReadContract,
  useReadContracts,
  useWatchContractEvent,
} from "wagmi";
import { pitAbi, tableAbi } from "../abi";
import { useEffect, useState } from "react";
import { ContractFunctionParameters } from "viem";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { writeContract } = useWriteContract();
  const { disconnect } = useDisconnect();
  const address = "0xff844a27C2C80649Cb76d56f9A36c3Cd274Dfb49";
  const [tableReads, setTableReads] = useState<ContractFunctionParameters[]>(
    []
  );

  // useWatchContractEvent({
  //   address,
  //   abi: pitAbi,
  //   eventName: 'TableCreated',
  //   onLogs: (logs) => console.log("Table Created", logs),
  //   onError: (error) => console.log("Error", error)
  // })

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
    <div>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <>
            <button type="button" onClick={() => disconnect()}>
              Disconnect
            </button>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
              onClick={async () => {
                // TODO: show modal with all options

                writeContract(
                  {
                    abi: pitAbi,
                    address,
                    functionName: "createTable",
                    args: [
                      7, // _maxPlayers
                      [
                        // _betRange
                        0, // min
                        100, // max
                      ],
                      [
                        // _rules
                        2, // deckCount
                        false, // dealerHitOnSoft17
                        false, // allowDoubleAfterSplit
                        1, // doubleRule
                        3, // maxResplitHands
                        true, // allowResplitAces
                        true, // allowHitSplitAces
                        true, // allowLateSurrender
                        true, // allowInsurance
                        false, // sixToFive
                      ],
                      "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", // _token
                    ],
                  },
                  {
                    onError: (e) => console.log(e),
                  }
                );
              }}
            >
              Create Table
            </button>
          </>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button key={connector.uid} onClick={() => connect({ connector })}>
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
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
    </div>
  );
}

export default App;
