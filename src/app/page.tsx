'use client'

import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract, useWatchContractEvent } from 'wagmi';
import { abi } from '../abi';

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { writeContract } = useWriteContract();
  const { disconnect } = useDisconnect();
  const address = '0x6F423B744b2eb0B577c7e99E25E3f77F58d35De1';

  useWatchContractEvent({
    address,
    abi,
    eventName: 'TableCreated',
    onLogs: (logs) => console.log("Table Created", logs),
    onError: (error) => console.log("Error", error)
  })

  const { data: tables, error: err } = useReadContract({
    address,
    abi,
    functionName: 'getTables',
  });

  const { data: table, error: err1 } = useReadContract({
    address,
    abi,
    functionName: 's_managerToTables',
    args: [account.address, 0]
  });

  console.log("Address: ", account.address);
  console.log("Tables: ", tables);
  console.log("Table: ", table);
  console.log("error", err);

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <>
            <button type="button" onClick={() => disconnect()}>
              Disconnect
            </button>
            { `${tables}` }
            <button 
              type="button" 
              onClick={async () => {
              // TODO: show modal with all options

              writeContract(
                { 
                  abi,
                  address,
                  functionName: 'createTable',
                  args: [
                    7, // _maxPlayers
                    [ // _betRange
                      0, // min
                      100 // max
                    ], 
                    [  // _rules
                      2, // deckCount
                      false, // dealerHitOnSoft17
                      false, // allowDoubleAfterSplit
                      1, // doubleRule
                      3, // maxResplitHands
                      true, // allowResplitAces
                      true, // allowHitSplitAces
                      true, // allowLateSurrender
                      true, // allowInsurance
                      false // sixToFive
                    ],
                    '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d' // _token
                  ],
                },
                {
                  onError: (e) => console.log(e)
                }
              );
            }}>
              Create Table
            </button>
          </>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
    </>
  )
}

export default App
