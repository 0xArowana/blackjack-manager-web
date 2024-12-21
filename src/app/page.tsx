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
import { Close } from "./ui/Icons";
import { BlackJackPayout, DoubleRule, TableRules } from "./lib/definitions";

function App() {
  const account = useAccount();
  const isConnected = account.status === "connected";
  const { writeContract } = useWriteContract();
  const address = "0xff844a27C2C80649Cb76d56f9A36c3Cd274Dfb49";
  const [tableReads, setTableReads] = useState<ContractFunctionParameters[]>();

  const defaultRules: TableRules = {
    deckCount: 8,
    dealerHitOnSoft17: false,
    allowDoubleAfterSplit: true,
    doubleRule: DoubleRule.Any,
    maxResplitHands: 4,
    allowResplitAces: false,
    allowHitSplitAces: false,
    allowLateSurrender: false,
    allowInsurance: false,
    blackJackPayout: BlackJackPayout.ThreeToTwo,
  };

  const [createTableRules, setCreateTableRules] =
    useState<TableRules>(defaultRules);

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
      <dialog id="create_table_modal" className="modal">
        <div className="modal-box flex flex-col">
          <div className="self-end">
            <form method="dialog">
              <button>
                <Close />
              </button>
            </form>
          </div>
          <div className="text-2xl font-semibold self-center">Create Table</div>
          <div className="text-lg pt-4 self-center">Select table rules</div>
          <div className="px-8 py-12 gap-4">
            <label className="flex label cursor-pointer items-between">
              <span>Number of decks</span>
              <div className="dropdown dropdown-left">
                <div tabIndex={0} role="button" className="btn m-1">
                  {createTableRules.deckCount}
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow"
                >
                  <li>
                    <a>1</a>
                  </li>
                  <li>
                    <a>2</a>
                  </li>
                  <li>
                    <a>4</a>
                  </li>
                  <li>
                    <a>5</a>
                  </li>
                  <li>
                    <a>6</a>
                  </li>
                  <li>
                    <a>8</a>
                  </li>
                </ul>
              </div>
            </label>
            <label className="flex label cursor-pointer items-between">
              <span>Dealer hits on soft 17</span>
              <input
                type="checkbox"
                className="toggle"
                defaultChecked
                onChange={(event) => {
                  setCreateTableRules((rules) => {
                    rules.dealerHitOnSoft17 = event.target.checked;
                    return rules;
                  });
                }}
              />
            </label>
            <label className="flex label cursor-pointer items-between">
              <span>Allow double after split</span>
              <input
                type="checkbox"
                className="toggle"
                defaultChecked
                onChange={(event) => {
                  setCreateTableRules((rules) => {
                    rules.allowDoubleAfterSplit = event.target.checked;
                    return rules;
                  });
                }}
              />
            </label>
          </div>
          <button
            type="button"
            className="btn btn-primary rounded-2xl"
            onClick={() => {
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
            Create
          </button>
        </div>
      </dialog>
    </>
  );
}

export default App;
