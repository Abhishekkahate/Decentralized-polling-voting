// Contract deployment configuration and ABI
export const SHARDEUM_NETWORKS = {
  testnet: {
    chainId: 8082,
    name: 'Shardeum Liberty 2.X',
    rpcUrl: 'https://liberty20.shardeum.org/',
    blockExplorer: 'https://explorer-liberty20.shardeum.org/',
    nativeCurrency: {
      name: 'Shardeum',
      symbol: 'SHM',
      decimals: 18
    }
  }
} as const

export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "feedbackId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "contentLength",
        "type": "uint256"
      }
    ],
    "name": "FeedbackSubmitted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_content",
        "type": "string"
      }
    ],
    "name": "submitFeedback",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFeedbackCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getFeedback",
    "outputs": [
      {
        "internalType": "string",
        "name": "content",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_count",
        "type": "uint256"
      }
    ],
    "name": "getLatestFeedbacks",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "contents",
        "type": "string[]"
      },
      {
        "internalType": "uint256[]",
        "name": "timestamps",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

// Contract address will be set after deployment
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" // TODO: Update after deployment