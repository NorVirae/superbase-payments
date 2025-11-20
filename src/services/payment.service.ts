import type { Database } from '../lib/database.types'
import { supabase } from '../lib/superbase'

type PaymentInsert = Database['public']['Tables']['payments']['Insert']
type PaymentRow = Database['public']['Tables']['payments']['Row']

export class PaymentService {
  static async createPayment(paymentData: PaymentInsert): Promise<PaymentRow> {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create payment: ${error.message}`)
    }

    return data
  }

  static async getPaymentByReference(reference: string): Promise<PaymentRow | null> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('reference', reference)
      .single()

    if (error) {
      console.error('Error fetching payment:', error)
      return null
    }

    return data
  }

  static async getUserPayments(userId: string): Promise<PaymentRow[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch payments: ${error.message}`)
    }

    return data || []
  }

  static async updatePaymentStatus(
    reference: string, 
    status: string
  ): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .update({ status })
      .eq('reference', reference)

    if (error) {
      throw new Error(`Failed to update payment status: ${error.message}`)
    }
  }
}