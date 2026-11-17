export interface HolidayInterface {
  _id: string;
  titleEn: string;
  titleBn: string;
  startDate: string;
  endDate: string;
  type: string;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}
