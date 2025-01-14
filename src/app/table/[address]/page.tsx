"use client";

import { useState, useEffect } from "react";
import { tableAbi } from "../../../abi";
import { useReadContract } from "wagmi";
import { AddressString } from "@/app/lib/definitions";

interface TableProps {
  params: Promise<{ address: string }>;
}

const Table = ({ params }: TableProps) => {
  const [tableAddress, setTableAddress] = useState<AddressString>("0x0");

  useEffect(() => {
    (async () => {
      const address = (await params).address;
      setTableAddress(address as AddressString);
    })();
  }, []);

  const { data: tableInfo } = useReadContract({
    address: tableAddress,
    abi: tableAbi,
    functionName: "getTableInfo",
  });

  if (!tableInfo) {
    return <>LOADING</>;
  }

  return <pre>{JSON.stringify(tableInfo, null, 2)}</pre>;
};

export default Table;
