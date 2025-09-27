import type { MovementType, Coverage } from "./enums"
import type { Claim } from "./activity"

export interface Movement {
  id: number
  claim_id: number
  claim?: Claim
  type: MovementType
  coverage: Coverage
  amount: number
  date: string
  note?: string
  user_name?: string
  created_date: string
}

export interface CreateMovementData {
  claim_id: number
  type: MovementType
  coverage: Coverage
  amount: number
  date: string
  note?: string
  user_name?: string
}

export interface UpdateMovementData extends Partial<CreateMovementData> {
  // Movements are typically immutable once created
}
