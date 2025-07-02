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
import { useState } from "react";
import { useAppDispatch } from "@/stores";
import { createVehicle, getVehicle } from "@/stores/vehicleManager/thunk";

interface Props {
  onSuccess?: () => void;
}

const VehicleAction = ({ onSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loadCapacity, setLoadCapacity] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleCreate = async () => {
    if (!vehicleNumber || !loadCapacity || !imageFile) return;
    const formData = new FormData();
    formData.append("vehicleNumber", vehicleNumber);
    formData.append("loadCapacity", loadCapacity);
    formData.append("file", imageFile);
    await dispatch(createVehicle(formData));
    await dispatch(getVehicle({ page: 1, limit: 10 }));
    onSuccess?.();
    setOpen(false);
    setVehicleNumber("");
    setLoadCapacity("");
    setImageFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">Thêm phương tiện</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Thêm phương tiện</DialogTitle>
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
            <Button onClick={handleCreate}>Tạo</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleAction;
