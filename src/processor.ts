import { lookupArchive } from "@subsquid/archive-registry";
import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from "@subsquid/evm-processor";
import * as pool from "./abi/pool";
import * as factory from "./abi/factory";
import { Store } from "@subsquid/typeorm-store";
export const FACTORY_ADDRESS = "0x1f98431c8ad98523631ae4a59f267346ea31f984";

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive("eth-mainnet"),

    chain: "https://rpc.ankr.com/eth",
  })
  .setFinalityConfirmation(75)
  .setFields({
    transaction: {
      hash: true,
    },
    log: {
      data: true,
      topics: true,
    },
  })
  .setBlockRange({
    from: 12000000,
  })
  .addLog({
    address: [FACTORY_ADDRESS],
    topic0: [factory.events.PoolCreated.topic],
  })
  .addLog({
    topic0: [pool.events.Swap.topic],
    transaction: true,
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
export type Context = DataHandlerContext<Store, Fields>;
