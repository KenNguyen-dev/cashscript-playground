import React from 'react'
import { Artifact, Network } from 'cashscript'
import { Contract } from '@samrock5000/cashscript';
import ContractFunction from './ContractFunction'
import { Wallet } from './shared'

interface Props {
  artifact?: Artifact
  contract?: Contract
  network: Network
  wallets: Wallet[]
  updateUtxosContract: () => void
}

const ContractFunctions: React.FC<Props> = ({ artifact, contract, network, wallets, updateUtxosContract }) => {
  const functions = artifact?.abi.map(func => (
    <ContractFunction contract={contract} key={func.name} abi={func} network={network} wallets={wallets} updateUtxosContract={updateUtxosContract}/>
  ))

  return (
    <div style={{
      height: '100%',
      border: '2px solid black',
      borderTop: '1px solid black',
      fontSize: '100%',
      lineHeight: 'inherit',
      overflow: 'auto',
      background: '#fffffe',
      padding: '8px 16px',
      color: '#000'
    }}>
      {contract &&
        <div>
          <h2>Functions</h2>
          {functions}
        </div>
      }
    </div>
  )
}

export default ContractFunctions
