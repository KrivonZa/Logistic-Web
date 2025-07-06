"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/stores";
import { getVehicle, updateVehicle } from "@/stores/vehicleManager/thunk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Vehicles } from "@/types/vehicle";

interface VehicleData {
  vehicleID: string;
  vehicleNumber: string;
  loadCapacity: number;
  status: "active" | "inactive";
  vehicleImage?: string | null;
}

interface Props {
  vehicle: VehicleData;
  onSuccess?: () => void;
}

const UpdateVehicleModal = ({ vehicle, onSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loadCapacity, setLoadCapacity] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setVehicleNumber(vehicle.vehicleNumber || "");
      setLoadCapacity(vehicle.loadCapacity.toString() || "");
      setStatus(vehicle.status);
      setImageFile(null);
    } else {
      setVehicleNumber("");
      setLoadCapacity("");
      setStatus("active");
      setImageFile(null);
    }
  }, [open, vehicle]);

  const handleUpdate = async () => {
    if (!vehicleNumber || !loadCapacity || !status) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const formData = new FormData();
    formData.append("vehicleNumber", vehicleNumber);
    formData.append("loadCapacity", loadCapacity);
    formData.append("status", status);
    if (imageFile) formData.append("file", imageFile);

    try {
      await dispatch(
        updateVehicle({ req: vehicle.vehicleID, formData })
      ).unwrap();
      await dispatch(getVehicle({ page: 1, limit: 10, status: "" }));
      toast.success("Cập nhật thành công");
      setOpen(false);
      onSuccess?.();
    } catch {
      // lỗi đã được xử lý ở trong thunk
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Cập nhật</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cập nhật phương tiện</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Biển số xe</Label>
            <Input
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="Nhập biển số xe"
            />
          </div>
          <div>
            <Label>Tải trọng (kg)</Label>
            <Input
              type="number"
              value={loadCapacity}
              onChange={(e) => setLoadCapacity(e.target.value)}
              placeholder="Nhập tải trọng"
            />
          </div>
          <div>
            <Label>Trạng thái</Label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as "active" | "inactive")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Hình ảnh xe</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdate}>Lưu</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateVehicleModal;
