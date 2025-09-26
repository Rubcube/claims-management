import type {
  ActivityStatus,
  ActivityRole,
  ClaimStatus,
  Currency,
  CauseOfLoss,
  Coverage,
  ProductLineOfBusiness,
} from "./enums"
import type { Policy } from "./policy"

export interface Claim {
  id: number
  claim_number: string
  title: string
  syndicate_id?: number
  policy_id?: number
  policy?: Policy
  status: ClaimStatus
  currency: Currency
  policy_number?: string
  product_lob: ProductLineOfBusiness
  insured_name: string
  cause_of_loss?: CauseOfLoss
  coverage?: Coverage
  date_of_loss?: string
  date_reported?: string
  date_closed?: string
  reserve_amount: number
  paid_amount: number
  outstanding_amount: number
  created_date: string
  created_by?: string
  modified_date?: string
  modified_by?: string
}

export interface Activity {
  id: number
  claim_id: number
  claim?: Claim
  title: string
  assignee: string
  role: ActivityRole
  due_date: string
  description?: string
  created_date: string
  created_by: string
  modified_date?: string
  modified_by?: string
  related_document_id?: string
  status: ActivityStatus
  created_at: string
  updated_at: string
}

export interface CreateActivityData {
  claim_id: number
  title: string
  assignee: string
  role: ActivityRole
  due_date: string
  description?: string
  created_by: string
  related_document_id?: number
  status?: ActivityStatus
}

export interface UpdateActivityData extends Partial<CreateActivityData> {
  modified_by: string
  modified_date?: string
}
