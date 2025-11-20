export interface PaymentData {
    email: string
    amount: number
    reference: string
    status: string
    user_id?: string
  }
  
  export interface PaystackResponse {
    reference: string
    status: string
    message: string
    trans: string
    transaction: string
    trxref: string
  }
  
  export interface PaystackConfig {
    email: string
    amount: number
    publicKey: string
    text?: string
    onSuccess: (response: PaystackResponse) => void
    onClose: () => void
    metadata?: {
      custom_fields?: Array<{
        display_name: string
        variable_name: string
        value: string
      }>
    }
  }