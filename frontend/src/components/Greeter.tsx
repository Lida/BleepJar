import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import BleepJarArtifact from '../artifacts/contracts/BleepJar.sol/BleepJarContract.json';
import BleepJar, { BleepJarContract } from '../../../typechain/BleepJarContract';
import { Provider } from '../utils/provider';
import { SectionDivider } from './SectionDivider';

const StyledDeployContractButton = styled.button`
  width: 180px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

const StyledGreetingDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
`;

export function Greeter(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, active } = context;

  const [signer, setSigner] = useState<Signer>();
  const [myjars, setMyJars] = useState<string[]>();
  const [bleepJarContract, setGreeterContract] = useState<BleepJarContract>();
  const [greeterContractAddr, setGreeterContractAddr] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  useEffect(() => {
    if (signer) {
      const bleepJarContract = new ethers.Contract(
        '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        BleepJarArtifact.abi,
        signer
      ) as BleepJarContract;
        setGreeterContract(bleepJarContract);
        setGreeting(greeting);

        setGreeterContractAddr(bleepJarContract.address);
        (async () => {
          setMyJars(await bleepJarContract.getMyJars());
        })();
    }
  }, [signer]);

  function handleNewJar() {
    (async () => {
      await bleepJarContract!.createJar('Test', [await signer?.getAddress()!], 1);
    })();
  }
  return (
    <>
      <StyledGreetingDiv>
        <StyledLabel>Contract addr</StyledLabel>
        <div>
          {greeterContractAddr ? (
            greeterContractAddr
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel>Current greeting</StyledLabel>
        <div>
          {greeting ? greeting : <em>{`<Contract not yet deployed>`}</em>}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel htmlFor="greetingInput">Set new greeting</StyledLabel>
        <StyledButton
          onClick={handleNewJar}
        >
          New Jar
        </StyledButton>
        {
          myjars?.map((address) => {
            return <div>{address}</div>
          })
        }
      </StyledGreetingDiv>
    </>
  );
}
