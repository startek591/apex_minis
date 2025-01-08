export interface FieldOption {
  id: number;
  name: string;
}

export interface SubDepartment {
  subDept: number;
  subDeptName: string;
  active: boolean;
}

export interface FieldData {
  docks: FieldOption[];
  shifts: FieldOption[];
}

export type JobType =
  | 'palletsUnloading'
  | 'casesUnloading'
  | 'selecting'
  | 'freightHauling';
export type JobTypeMap<T> = { [K in JobType]: T };

export interface PlanGroup extends JobTypeMap<Plan | null> {
  weeklyStaffingId: number | null;
  subDept: number;
  dockId: number;
  weekBeginningDate: string;
  shiftId: number;

  clockCasesPerHour: number;
  clockPalletsPerHour: number;
  netRevenuePerCase: number;
  netRevenuePerPallet: number;

  createdBy: string | null;
  createdDate: string | null;
  modifiedBy: string | null;
  modifiedDate: string | null;
}

export interface Plan {
  weeklyStaffingId: number | null;

  shiftHours: number;
  callOutPercentage: number;
  weeklyAssociatePayGoal: number;
  actualHeadCount: number;
  budgetedPayPercentage: number;

  dailyStaffing: Weekday[];
}

export interface Weekday {
  dailyStaffingId: number | null;
  workDate: string;

  itemsScheduled: number;
  staffScheduled: number;
}
