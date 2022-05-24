import 'dotenv/config'
import fetch from "node-fetch";
import { hrtime } from 'node:process';
import { sendDownload, sendUpload } from "./websockets.js";
import crypto from 'crypto'

export const runSpeedTest = async (messageDate) => {
  const maxSizePowerOf2 = messageDate.maxFileSize;

  console.log('______________________________________')

  for (let i = 0; i <= maxSizePowerOf2; i++) {
    if (messageDate.useAwait) {
      await callForDownloadSpeed(i)
      await callForUploadSpeed(i)
    } else {
      callForDownloadSpeed(i)
      callForUploadSpeed(i)
    }
  }
}

const callForDownloadSpeed = async (powerOfTwoSize) => {
  // console.log('download in process')

  const bytesLength = Math.pow(2, powerOfTwoSize)
  const startTime = hrtime.bigint();

  const response = await fetch(`${process.env.TARGET}/download/${bytesLength}`);
  let dataLength = 0

  for await (const chunk of response.body) {
    dataLength += chunk.length
  }

  const durationInNanoseconds = hrtime.bigint() - startTime
  const bitesReceived = dataLength / 8

  let mbps = bitesReceived / Number(durationInNanoseconds) * 1000;

  // console.log('download - durationInNanoseconds', durationInNanoseconds)
  // console.log('download - bites  ', bitesReceived)
  // console.log(mbps, 'Mb/s download')

  await sendDownload(powerOfTwoSize, mbps, Number(durationInNanoseconds)/1_000_000)
}

const callForUploadSpeed = async (powerOfTwoSize) => {
  // console.log('upload in process')

  const bytesLength = Math.pow(2, powerOfTwoSize)
  const startTime = hrtime.bigint();

  const response = await fetch(`${process.env.TARGET}/upload`, {
    method: 'post',
    body: crypto.randomBytes(bytesLength),
    headers: {'Content-Type': 'application/octet-stream'},
  });

  const data = await response.json();

  const durationInNanoseconds = hrtime.bigint() - startTime
  const bitesReceived = data.bitesReceived

  let mbps = bitesReceived / Number(durationInNanoseconds) * 1000;

  // console.log('upload - durationInNanoseconds', durationInNanoseconds)
  // console.log('upload - bites  ', bitesReceived)
  // console.log(mbps, 'Mb/s upload')

  await sendUpload(powerOfTwoSize, mbps, Number(durationInNanoseconds)/1_000_000)
}
