import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AppConfig } from "../../configuration/configuration.service";
import { v4 as uuidV4 } from "uuid";
import { IBlock } from "../model";
import { ITransaction } from "@zenotta/zenotta-js";

@Injectable()
export class ZenottaService {
  constructor(private httpService: HttpService, private appConfig: AppConfig) {}

  public async getLatestBlock() {
    const requestId = uuidV4().replace(/-/g, "");
    const url = `${this.appConfig.values.zenotta.storageNodeUrl}/latest_block`;
    const response = await this.httpService.axiosRef.get(url, {
      headers: {
        "x-request-id": requestId,
      },
    });
    const block: IBlock = response.data.content.block;

    return block;
  }

  public async getBlockRange(startBlock: number, endBlock: number) {
    const blocks = [...Array(endBlock - startBlock + 1).keys()].map((block) => block + startBlock);
    const requestId = uuidV4().replace(/-/g, "");
    const url = `${this.appConfig.values.zenotta.storageNodeUrl}/block_by_num`;
    const response = await this.httpService.axiosRef.post(url, blocks, {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": requestId,
      },
    });
    const data: [string, Record<"block", IBlock>][] = response.data.content;
    return data;
  }

  public async getTransactionByHash(hash: string) {
    const requestId = uuidV4().replace(/-/g, "");
    const url = `${this.appConfig.values.zenotta.storageNodeUrl}/blockchain_entry`;
    const genesisTxRegex = /0{5}[0-9]/;
    const isBlock = hash[0] !== "g" && !hash.match(genesisTxRegex);

    if (isBlock) {
      throw new Error("invalid hash");
    }

    const response = await this.httpService.axiosRef.post(url, `"${hash}"`, {
      headers: {
        "Content-Type": "application/json",
        "x-request-id": requestId,
      },
    });
    const data: ITransaction = response.data.content.Transaction;
    return data;
  }
}
