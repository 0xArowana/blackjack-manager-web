"use client";

import { useState, useEffect } from "react";
import { tableAbi } from "../../../abi";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import {
  Address,
  GameStatus,
  PlayerState,
  TableInfo,
} from "../../lib/definitions";
import { zeroAddress } from "viem";

interface TableProps {
  params: Promise<{ address: string }>;
}

const Table = ({ params }: TableProps) => {
  const account = useAccount();
  const { writeContract } = useWriteContract();
  const [tableAddress, setTableAddress] = useState<Address>();
  const [startGameLoading, setStartGameLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const address = (await params).address;
      setTableAddress(address as Address);
    })();
  }, []);

  const { data, refetch } = useReadContract({
    address: tableAddress,
    abi: tableAbi,
    functionName: "getTableInfo",
  });

  useWatchContractEvent({
    address: tableAddress,
    abi: tableAbi,
    eventName: "GameStarted",
    onLogs: (logs) => {
      console.log("Game started", logs);
      refetch();
    },
    onError: (error) => console.log("Error", error),
  });

  const tableInfo = data as TableInfo;

  if (!tableAddress || !tableInfo) {
    return <div className="loading loading-spinner loading-lg h-full"></div>;
  }

  const isManager = tableInfo.manager === account.address;
  const isInactive = tableInfo.gameStatus === GameStatus.Inactive;

  console.log("table info", tableInfo);

  return (
    <div>
      {isManager && isInactive && (
        <button
          type="button"
          className="btn btn-primary rounded-2xl mt-8"
          disabled={startGameLoading}
          onClick={() => {
            setStartGameLoading(true);

            writeContract(
              {
                abi: tableAbi,
                address: tableAddress,
                functionName: "startBets",
                args: [],
              },
              {
                onError: (e) => {
                  console.log(e);
                },
                onSuccess: () => {
                  refetch();
                },
                onSettled: () => {
                  setStartGameLoading(false);
                },
              }
            );
          }}
        >
          {!startGameLoading ? (
            "Start Game"
          ) : (
            <span className="loading loading-spinner loading-sm" />
          )}
        </button>
      )}
      <div className="flex flex-row gap-4 mt-10">
        {tableInfo.seats.map((seat, index) => {
          const isEmpty = seat.player === zeroAddress;

          return (
            <div
              className="flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow gap-2 truncate w-32"
              key={`table-spot-${index}`}
            >
              {isEmpty ? "EMPTY" : seat.player}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Table;
