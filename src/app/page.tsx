'use client'

import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract, useWatchContractEvent } from 'wagmi';
import { abi } from '../abi';

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { writeContract } = useWriteContract();
  const { disconnect } = useDisconnect();
  const address = '0x844058BD98c93D111ea038BDdbEC5D2992F5C2D9';


  // useWatchContractEvent({
  //   address,
  //   abi,
  //   eventName: 'TableCreated',
  //   onLogs: (logs) => console.log("Table Created", logs),
  //   onError: (error) => console.log("Error", error)
  // })

  const { data: tables } = useReadContract({
    address,
    abi,
    functionName: 's_managerToTables',
    args: [account.address]
  })

  console.log("TABLES", tables);
  console.log("ADDress", account.address);

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
            <button type="button" onClick={() => {
              // TODO: show modal with all options

              writeContract({ 
                abi,
                address,
                functionName: 'createTable',
                args: [
                  7,
                  [0,100],
                  [8, true, true, 1, 3, true, true, true, true, false],
                  '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
                ]
              });
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
