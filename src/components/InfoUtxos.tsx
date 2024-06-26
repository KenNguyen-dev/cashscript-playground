import React from 'react'
import { Utxo } from 'cashscript'

interface Props {
  utxos: Utxo[] | undefined,
}

const InfoUtxos: React.FC<Props> = ({ utxos }) => {

  function copy(category: string | undefined) {
    if (!category) return
    navigator.clipboard.writeText(category)
  }

  function getTokenType(token: Utxo["token"]) {
    if (!token) return "no tokens"
    if (token.amount && token.nft) return "both fungible tokens & NFT"
    if (token.amount) return "fungible tokens only"
    if (token.nft) return "NFT only"
  }

  return (
    <>
      {utxos?.map((utxo, index) => {
        const reversedCategory = utxo.token?.category.match(/../g)?.reverse().join('') ||  "";

        return (
        <div style={{ marginLeft: "20px", marginTop: "5px" }} key={`utxo-index${index}`}>
          <b>{`----- UTXO ${index} -----`}</b> <br />
          {"Amount: " + utxo.satoshis + " sats"} <br />
          {"XEC Amount: " + Number(utxo.satoshis) / Math.pow(10, 2) + " XEC"} <br />
          {(<>{"token type: " + getTokenType(utxo.token)} <br /></>)}
          {utxo.token ?
            (<>
              {`token category (default): ${utxo.token.category.slice(0, 10)}...${utxo.token.category.slice(-10)} `}
              <img alt="copy icon" style={{ marginBottom: "1px", cursor: "pointer" }} src="copy.svg" onClick={() => copy(utxo.token?.category)} />
              <br />
              {`token category (unreversed, used in script): ${reversedCategory.slice(0, 10)}...${reversedCategory.slice(-10)} `}
              <img alt="copy icon" style={{ marginBottom: "1px", cursor: "pointer" }} src="copy.svg" onClick={() => copy(reversedCategory)} />
              <br />
            </>) : ""
          }
          {utxo.token?.amount ?
            (<>
              {"token amount: " + (utxo.token.amount).toString()} <br />
            </>) : ""
          }
          {utxo.token?.nft?.capability ?
            (<>
              {"nft capability: " + utxo.token.nft.capability} <br />
            </>) : ""
          }
          {utxo.token?.nft ?
            (<>
              {`nft commitment: "${utxo.token.nft.commitment}"`} <br />
            </>) : ""
          }
        </div>)})}
    </>
  )
}

export default InfoUtxos
