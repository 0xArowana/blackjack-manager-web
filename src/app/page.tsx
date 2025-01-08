"use client";

import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWatchContractEvent,
} from "wagmi";
import { pitAbi, tableAbi } from "../abi";
import { useEffect, useState } from "react";
import { ContractFunctionParameters } from "viem";
import { pitAddress } from "./lib/constants";
import CreateTableModal from "./ui/CreateTableModal";

function App() {
  const account = useAccount();
  const isConnected = account.status === "connected";
  const [tableReads, setTableReads] = useState<ContractFunctionParameters[]>();

  // useWatchContractEvent({
  //   address,
  //   abi: pitAbi,
  //   eventName: 'TableCreated',
  //   onLogs: (logs) => console.log("Table Created", logs),
  //   onError: (error) => console.log("Error", error)
  // })

  const { data: tables, error: err } = useReadContract({
    address: pitAddress,
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
              className="btn btn-primary rounded-2xl"
              onClick={() => {
                document.getElementById("create_table_modal")?.showModal();
              }}
            >
              Create Table
            </button>
          </>
        ) : (
          <div>Please connect your wallet</div>
        )}
      </div>
      <CreateTableModal />
    </>
  );
}

export default App;
