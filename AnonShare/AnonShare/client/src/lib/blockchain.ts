import { ethers } from "ethers"
import { CONTRACT_ABI, CONTRACT_ADDRESS, SHARDEUM_NETWORKS } from "@shared/contracts"

export interface FeedbackData {
  id: string
  content: string
  timestamp: Date
  txHash: string
}

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null
  private contract: ethers.Contract | null = null
  private signer: ethers.Signer | null = null
  private readOnlyProvider: ethers.JsonRpcProvider
  private readOnlyContract: ethers.Contract

  constructor() {
    // Initialize read-only provider for public data access
    this.readOnlyProvider = new ethers.JsonRpcProvider(SHARDEUM_NETWORKS.testnet.rpcUrl)
    this.readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.readOnlyProvider)
  }

  async connectWallet(): Promise<{ address: string; isConnected: boolean }> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed')
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      // Initialize provider
      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()

      // Check if on correct network, switch if needed
      await this.ensureCorrectNetwork()

      // Initialize contract
      this.initializeContract()

      return {
        address: accounts[0],
        isConnected: true
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      throw error
    }
  }

  private async ensureCorrectNetwork() {
    if (!this.provider) throw new Error('Provider not initialized')

    const network = await this.provider.getNetwork()
    const targetChainId = SHARDEUM_NETWORKS.testnet.chainId

    if (Number(network.chainId) !== targetChainId) {
      try {
        // Try to switch to Shardeum network
        await window.ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${targetChainId.toString(16)}` }]
        })
      } catch (switchError: any) {
        // Network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: SHARDEUM_NETWORKS.testnet.name,
              rpcUrls: [SHARDEUM_NETWORKS.testnet.rpcUrl],
              blockExplorerUrls: [SHARDEUM_NETWORKS.testnet.blockExplorer],
              nativeCurrency: SHARDEUM_NETWORKS.testnet.nativeCurrency
            }]
          })
        } else {
          throw switchError
        }
      }
    }
  }

  private initializeContract() {
    if (!this.provider || !this.signer) {
      throw new Error('Provider or signer not initialized')
    }

    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer)
  }

  async submitFeedback(content: string): Promise<{ txHash: string; feedbackId: number }> {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not initialized')
    }

    try {
      // Submit transaction
      const tx = await this.contract.submitFeedback(content)
      
      // Wait for confirmation
      const receipt = await tx.wait()
      
      // Extract feedback ID from event
      const event = receipt.logs.find((log: any) => 
        log.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
      )
      
      let feedbackId = 0
      if (event) {
        const decodedEvent = this.contract.interface.parseLog({
          topics: event.topics,
          data: event.data
        })
        feedbackId = Number(decodedEvent?.args?.feedbackId || 0)
      }

      return {
        txHash: receipt.hash,
        feedbackId
      }
    } catch (error) {
      console.error('Submit feedback error:', error)
      throw error
    }
  }

  async estimateGasFee(content: string): Promise<string> {
    if (!this.contract || !this.provider) {
      throw new Error('Contract not initialized')
    }

    try {
      // Correct ethers v6 syntax for gas estimation
      const gasEstimate = await this.contract.submitFeedback.estimateGas(content)
      const gasPrice = await this.provider.getFeeData()
      
      const estimatedCost = gasEstimate * (gasPrice.gasPrice || BigInt(0))
      const costInSHM = ethers.formatEther(estimatedCost)
      
      return parseFloat(costInSHM).toFixed(6)
    } catch (error) {
      console.error('Gas estimation error:', error)
      return "0.001" // Fallback estimate
    }
  }

  async getLatestFeedback(count: number = 10): Promise<FeedbackData[]> {
    try {
      // Use read-only contract so this works without wallet connection
      const [contents, timestamps] = await this.readOnlyContract.getLatestFeedbacks(count)
      
      return contents.map((content: string, index: number) => ({
        id: `blockchain-${Number(timestamps[index])}-${index}`, // Stable ID generation
        content,
        timestamp: new Date(Number(timestamps[index]) * 1000),
        txHash: "on-chain" // Indicate this is blockchain data without fake hash
      }))
    } catch (error) {
      console.error('Get feedback error:', error)
      // If CONTRACT_ADDRESS is not deployed, silently return empty array
      return []
    }
  }

  async getFeedbackCount(): Promise<number> {
    try {
      // Use read-only contract so this works without wallet connection
      const count = await this.readOnlyContract.getFeedbackCount()
      return Number(count)
    } catch (error) {
      console.error('Get feedback count error:', error)
      return 0
    }
  }

  disconnect() {
    this.provider = null
    this.contract = null
    this.signer = null
  }
}

// Global instance
export const blockchainService = new BlockchainService()

// Type augmentation for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (eventName: string, callback: (...args: any[]) => void) => void
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void
      isMetaMask?: boolean
    }
  }
}