import '@nomiclabs/hardhat-waffle';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

task('deploy', 'Deploy BleepJar contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const BleepJar = await hre.ethers.getContractFactory('BleepJarContract');
    const jar = await BleepJar.deploy();

    await jar.deployed();

    console.log('Greeter deployed to:', jar.address);
  }
);
