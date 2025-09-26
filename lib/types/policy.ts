import type { PolicyCoverageType } from "./enums"

export interface Exclusion {
  id: number
  title: string
  description?: string
  created_date: string
  modified_date: string
}

export interface Policy {
  id: number
  policy_number: string
  period_start: string
  period_end: string
  named_insured: string
  sum_insured: number
  coverage_type: PolicyCoverageType
  deductible?: number
  binder_ref?: string
  exclusions?: Exclusion[]
  created_date: string
  modified_date: string
}

export interface PolicyExclusion {
  policy_id: number
  exclusion_id: number
  policy?: Policy
  exclusion?: Exclusion
}

export interface CreatePolicyData {
  policy_number: string
  period_start: string
  period_end: string
  named_insured: string
  sum_insured: number
  coverage_type: PolicyCoverageType
  deductible?: number
  binder_ref?: string
}

export interface UpdatePolicyData extends Partial<CreatePolicyData> {
  modified_date?: string
}
