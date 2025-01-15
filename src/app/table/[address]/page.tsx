"use client";

import { useState, useEffect } from "react";
import { tableAbi } from "../../../abi";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import {
  Address,
  GameStatus,
  PlayerState,
  TableInfo,
} from "../../lib/definitions";

interface TableProps {
  params: Promise<{ address: string }>;
}

const Table = ({ params }: TableProps) => {
  const account = useAccount();
  const { writeContract } = useWriteContract();
  const [tableAddress, setTableAddress] = useState<Address>();
  const [spots, setSpots] = useState<(PlayerState | undefined)[]>([]);
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

  const tableInfo = data as TableInfo;

  useEffect(() => {
    if (!tableInfo) return;

    const newSpots: (PlayerState | undefined)[] = [];

    for (let i = 0; i < tableInfo.maxPlayers; i++) {
      const spot = tableInfo.playerStates.find((p) => p.seat === i + 1);
      newSpots.push(spot);
    }

    console.log("new spots", newSpots);

    setSpots(newSpots);
  }, [tableInfo]);

  if (!tableAddress || !tableInfo) {
    return <div className="loading loading-spinner loading-lg h-full"></div>;
  }

  const isManager = tableInfo.manager === account.address;
  const isInactive = tableInfo.gameStatus === GameStatus.Inactive;

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
        {spots?.map((spot, index) => {
          return (
            <div
              className="flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow gap-2"
              key={`table-spot-${index}`}
            >
              {!spot ? "EMPTY" : "SOMEBODY"}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Table;
