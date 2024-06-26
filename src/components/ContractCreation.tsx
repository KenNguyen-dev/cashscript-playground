import React, { useState, useEffect } from 'react'
import { Artifact, Argument, Network, ElectrumNetworkProvider, Utxo } from 'cashscript'
import { ChronikNetworkProvider, Contract } from '@samrock5000/cashscript';
import { InputGroup, Form, Button } from 'react-bootstrap'
// import { QRFunc } from 'react-qrbtf'
import { readAsType } from './shared'
import CopyText from './shared/CopyText'
import InfoUtxos from './InfoUtxos'
import { ChronikClient } from 'chronik-client';

interface Props {
  artifact?: Artifact
  contract?: Contract
  setContract: (contract?: Contract) => void
  network: Network | "ecash"
  setNetwork: (network: Network) => void
  setShowWallets: (showWallets: boolean) => void
  utxos: Utxo[] | undefined
  balance: bigint | undefined
  updateUtxosContract: () => void
}

const ContractCreation: React.FC<Props> = ({ artifact, contract, setContract, network, setNetwork, setShowWallets, balance, utxos, updateUtxosContract}) => {
  const [args, setArgs] = useState<Argument[]>([])

  useEffect(() => {
    // This code is suuper ugly but I haven't found any other way to clear the value
    // of the input fields.
    artifact?.constructorInputs.forEach((input, i) => {
      const el = document.getElementById(`constructor-arg-${i}`)
      if (el) (el as any).value = ''
    })

    // Set empty strings as default values
    const newArgs = artifact?.constructorInputs.map(() => '') || []

    setArgs(newArgs)
  }, [artifact])

  useEffect(() => {
    updateUtxosContract()
  }, [contract])

  const inputFields = artifact?.constructorInputs.map((input, i) => (
    <Form.Control key={`constructor-arg-${i}`} size="sm" id={`constructor-arg-${i}`}
      placeholder={`${input.type} ${input.name}`}
      aria-label={`${input.type} ${input.name}`}
      onChange={(event) => {
        const argsCopy = [...args]
        argsCopy[i] = readAsType(event.target.value, input.type)
        setArgs(argsCopy)
      }}
    />
  )) || []

  const networkSelector = (
    <Form.Control size="sm" id="network-selector"
      as="select"
      value={network}
      onChange={(event) => {
        setNetwork(event.target.value as Network)
      }}
    >
      <option>ecash</option>
    </Form.Control>
  )

  const createButton = <Button variant="secondary" size="sm" onClick={() => createContract()}>Create</Button>

  const constructorForm = artifact &&
    (<InputGroup size="sm">
      {inputFields}
      {networkSelector}
      <InputGroup.Append>
        {createButton}
      </InputGroup.Append>
    </InputGroup>)

  function createContract() {
    if (!artifact) return
    try {
      let provider
      if(network === 'ecash') {
        const chronik = new ChronikClient("https://chronik.be.cash/xec")
        provider = new ChronikNetworkProvider("mainnet",chronik);
      }else {
        provider = new ElectrumNetworkProvider(network)
      }
      console.log("🚀 ~ createContract ~ args:", args)

      //@ts-ignore
      const newContract = new Contract(artifact, args, provider)
      setContract(newContract)
    } catch (e: any) {
      alert(e.message)
      console.error(e.message)
    }
  }

  return (
    <div style={{
      height: '100%',
      border: '2px solid black',
      borderBottom: '1px solid black',
      fontSize: '100%',
      lineHeight: 'inherit',
      overflow: 'auto',
      background: '#fffffe',
      padding: '8px 16px',
      color: '#000'
    }}>
      <h2>{artifact?.contractName} <button onClick={() => setShowWallets(true)} style={{ float: 'right', border: 'none', backgroundColor: 'transparent', outline: 'none' }}>⇆</button></h2>
      {constructorForm}
      {contract !== undefined && balance !== undefined &&
        <div style={{ margin: '5px', width: '100%' }}>
          <div style={{ float: 'left', width: '70%' }}>
            <strong>Contract address (p2sh32)</strong>
            <CopyText>{contract.address}</CopyText>
            <strong>Contract utxos</strong>
            <p>{utxos?.length} {utxos?.length == 1 ? "utxo" : "utxos"}</p>
            <details  onClick={() => updateUtxosContract()}>
              <summary>Show utxos</summary>
              <div>
                <InfoUtxos utxos={utxos}/>
              </div>
            </details>
            <strong>Total contract balance</strong>
            <p>{balance.toString()} satoshis</p>
            <strong>Contract size</strong>
            <p>{contract.bytesize} bytes (max 520), {contract.opcount} opcodes (max 201)</p>
          </div>
          {/* <div style={{ float: 'left', width: '30%', paddingTop: '4%' }}>
            <QRFunc value={contract.address} />
          </div> */}
        </div>
      }
    </div>
  )
}

export default ContractCreation
