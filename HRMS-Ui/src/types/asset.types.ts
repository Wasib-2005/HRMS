export interface AssetInterface {
  _id: string;
  assetName: string;
  description?: string;
  serialNumber?: string;
  status: 'active' | 'inactive' | 'disabled';
  qty: number;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssetAssignInterface {
  _id: string;
  asset: string | AssetInterface;
  user: string | { _id: string; name: string; email: string };
  itemQty: number;
  status: 'active' | 'returned' | 'damaged' | 'lost';
  assignedDate?: string;
  returnedDate?: string;
  createdAt: string;
  updatedAt: string;
}
