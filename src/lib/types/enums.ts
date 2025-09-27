export enum ClaimStatus {
  Open = 1,
  UnderReview = 2,
  Approved = 3,
  Paid = 4,
  Closed = 5,
  SoftClosed = 6,
}

export enum ActivityStatus {
  InProgress = 1,
  Completed = 2,
  Pending = 3,
}

export enum ActivityRole {
  Adjuster = 1,
  Surveyor = 2,
  Lawyer = 3,
}

export enum Currency {
  BRL = 1,
  USD = 2,
  GBP = 3,
}

export enum CauseOfLoss {
  EscapeOfWater = 1,
  Fire = 2,
  Theft = 3,
}

export enum Coverage {
  MaterialDamage = 1,
  BI = 2,
  Stock = 3,
  Fidelity = 4,
  Other = 5,
}

export enum DocumentType {
  Pdf = 1,
  Doc = 2,
  Xls = 3,
  Image = 4,
}

export enum PolicyCoverageType {
  AllRisksProperty = 1,
}

export enum ReserveType {
  Indemnity = 1,
  Expenses = 2,
  Recoveries = 3,
}

export enum ManagingEntity {
  LimeMGA = 1,
  LimeSyndicate = 2,
  SunMGA = 3,
  SunSyndicate = 4,
}

export enum Jurisdiction {
  BR = 1,
  US = 2,
  UK = 3,
}

export enum OperationType {
  MGA = 1,
  Syndicate = 2,
}

export enum MovementType {
  ReserveIncrease = 1,
  ReserveDecrease = 2,
  Payment = 3,
  Recovery = 4,
}

export enum ProductLineOfBusiness {
  Property = 1,
  Engineering = 2,
  MobileDevice = 3,
  FinancialLines = 4,
}

// Helper functions to get enum labels
export const getClaimStatusLabel = (status: ClaimStatus): string => {
  const labels = {
    [ClaimStatus.Open]: "Open",
    [ClaimStatus.UnderReview]: "Under Review",
    [ClaimStatus.Approved]: "Approved",
    [ClaimStatus.Paid]: "Paid",
    [ClaimStatus.Closed]: "Closed",
    [ClaimStatus.SoftClosed]: "Soft Closed",
  }
  return labels[status] || "Unknown"
}

export const getActivityStatusLabel = (status: ActivityStatus): string => {
  const labels = {
    [ActivityStatus.InProgress]: "In Progress",
    [ActivityStatus.Completed]: "Completed",
    [ActivityStatus.Pending]: "Pending",
  }
  return labels[status] || "Unknown"
}

export const getActivityRoleLabel = (role: ActivityRole): string => {
  const labels = {
    [ActivityRole.Adjuster]: "Adjuster",
    [ActivityRole.Surveyor]: "Surveyor",
    [ActivityRole.Lawyer]: "Lawyer",
  }
  return labels[role] || "Unknown"
}

export const getCurrencyLabel = (currency: Currency): string => {
  const labels = {
    [Currency.BRL]: "BRL",
    [Currency.USD]: "USD",
    [Currency.GBP]: "GBP",
  }
  return labels[currency] || "Unknown"
}

export const getCauseOfLossLabel = (cause: CauseOfLoss): string => {
  const labels = {
    [CauseOfLoss.EscapeOfWater]: "Escape of Water",
    [CauseOfLoss.Fire]: "Fire",
    [CauseOfLoss.Theft]: "Theft",
  }
  return labels[cause] || "Unknown"
}

export const getPolicyCoverageTypeLabel = (type: PolicyCoverageType): string => {
  const labels = {
    [PolicyCoverageType.AllRisksProperty]: "All Risks Property",
  }
  return labels[type] || "Unknown"
}

export const getReserveTypeLabel = (type: ReserveType): string => {
  const labels = {
    [ReserveType.Indemnity]: "Indemnity",
    [ReserveType.Expenses]: "Expenses",
    [ReserveType.Recoveries]: "Recoveries",
  }
  return labels[type] || "Unknown"
}

export const getManagingEntityLabel = (entity: ManagingEntity): string => {
  const labels = {
    [ManagingEntity.LimeMGA]: "Lime MGA",
    [ManagingEntity.LimeSyndicate]: "Lime Syndicate",
    [ManagingEntity.SunMGA]: "Sun MGA",
    [ManagingEntity.SunSyndicate]: "Sun Syndicate",
  }
  return labels[entity] || "Unknown"
}

export const getJurisdictionLabel = (jurisdiction: Jurisdiction): string => {
  const labels = {
    [Jurisdiction.BR]: "Brazil",
    [Jurisdiction.US]: "United States",
    [Jurisdiction.UK]: "United Kingdom",
  }
  return labels[jurisdiction] || "Unknown"
}

export const getOperationTypeLabel = (type: OperationType): string => {
  const labels = {
    [OperationType.MGA]: "Managing General Agent",
    [OperationType.Syndicate]: "Syndicate",
  }
  return labels[type] || "Unknown"
}

export const getMovementTypeLabel = (type: MovementType): string => {
  const labels = {
    [MovementType.ReserveIncrease]: "Reserve Increase",
    [MovementType.ReserveDecrease]: "Reserve Decrease",
    [MovementType.Payment]: "Payment",
    [MovementType.Recovery]: "Recovery",
  }
  return labels[type] || "Unknown"
}

export const getProductLineOfBusinessLabel = (lob: ProductLineOfBusiness): string => {
  const labels = {
    [ProductLineOfBusiness.Property]: "Property",
    [ProductLineOfBusiness.Engineering]: "Engineering",
    [ProductLineOfBusiness.MobileDevice]: "Mobile Device",
    [ProductLineOfBusiness.FinancialLines]: "Financial Lines",
  }
  return labels[lob] || "Unknown"
}
