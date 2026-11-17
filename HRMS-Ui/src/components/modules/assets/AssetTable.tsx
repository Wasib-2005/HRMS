"use client";

import { useEffect, useState } from "react";
import { assetService } from "@/services/asset.service";
import { AssetInterface } from "@/types/asset.types";
import DataTable, { Column } from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import Can from "@/components/guards/Can";
import { FaPlus, FaLaptop } from "react-icons/fa6";

interface AssetTableProps {
  myAssetsOnly?: boolean;
}

export default function AssetTable({ myAssetsOnly = false }: AssetTableProps) {
  const [assets, setAssets] = useState<AssetInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const res = await assetService.getAll();
      setAssets(res?.data || []);
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const columns: Column<AssetInterface>[] = [
    {
      header: "Asset Name",
      accessorKey: "assetName",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
            <FaLaptop className="text-sm" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.assetName}</p>
            {row.description && <p className="text-xs text-slate-500">{row.description}</p>}
          </div>
        </div>
      ),
    },
    {
      header: "Serial Number",
      accessorKey: "serialNumber",
      cell: (row) => <span className="font-mono text-xs">{row.serialNumber || "N/A"}</span>,
    },
    {
      header: "Available Qty",
      accessorKey: "qty",
      cell: (row) => <span className="font-semibold">{row.qty}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <Badge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {myAssetsOnly ? "My Assigned Assets" : "Asset Inventory"}
          </h2>
          <p className="text-xs text-slate-500">
            {myAssetsOnly ? "Equipment and hardware currently assigned to you" : "Manage company physical devices and hardware"}
          </p>
        </div>

        {!myAssetsOnly && (
          <Can permission="createAsset">
            <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition">
              <FaPlus className="text-xs" />
              Add Asset
            </button>
          </Can>
        )}
      </div>

      <DataTable columns={columns} data={assets} isLoading={loading} emptyMessage="No assets found." />
    </div>
  );
}
