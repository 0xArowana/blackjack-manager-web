"use client";

import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";
import { pitAbi } from "../abi";
import { pitAddress } from "./lib/constants";
import CreateTableModal from "./ui/CreateTableModal";
import { TableInfo, TokenInfo } from "./lib/definitions";

const App = () => {
  const account = useAccount();
  const isConnected = account.status === "connected";

  const {
    data: tables,
    error: tablesError,
    refetch: refetchTables,
  } = useReadContract({
    address: pitAddress,
    abi: pitAbi,
    functionName: "getManagerTableInfo",
    args: [account.address],
  });

  const {
    data: tokens,
    error: tokensError,
    refetch: refetchTokens,
  } = useReadContract({
    address: pitAddress,
    abi: pitAbi,
    functionName: "getManagerTokenInfo",
    args: [account.address],
  });

  useWatchContractEvent({
    address: pitAddress,
    abi: pitAbi,
    eventName: "TableCreated",
    onLogs: (logs) => {
      console.log("Table Created", logs);
      refetchTables();
    },
    onError: (error) => console.log("Error", error),
  });

  const getTokenName = (address: string) => {
    const token = (tokens as TokenInfo[]).find((t) => t.id === address);
    return token?.symbol ?? "ETH";
  };

  console.log("tables", tables);
  console.log("token states", tokens);

  return (
    <>
      MANAGER
      <div className="flex justify-center">
        {isConnected ? (
          <div className="flex flex-col gap-4 w-9/12">
            <h1>Tables</h1>
            <div className="flex flex-wrap gap-4">
              {(tables as TableInfo[])?.map((table, index) => {
                const { id, token, seats } = table;

                return (
                  <a
                    className="flex flex-col w-60 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 gap-2"
                    key={`table-card-${index}`}
                    href={`/table/${id}`}
                  >
                    <div className="tooltip before:max-w-none" data-tip={id}>
                      <div className="truncate">{id}</div>
                    </div>
                    <div>{`Token = ${getTokenName(token)}`}</div>
                    <div>{`Players = ${seats.length}`}</div>
                  </a>
                );
              })}
            </div>
            <button
              type="button"
              className="btn btn-primary rounded-2xl mt-8"
              onClick={() => {
                document.getElementById("create_table_modal")?.showModal();
              }}
            >
              Create Table
            </button>
          </div>
        ) : (
          <div>Please connect your wallet</div>
        )}
      </div>
      <CreateTableModal tokenStates={tokens as TokenInfo[]} />
    </>
  );
};

export default App;
