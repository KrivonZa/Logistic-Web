"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/stores";
import { getVehicle } from "@/stores/vehicleManager/thunk";
import { driverCompanyAcc } from "@/stores/accountManager/thunk";
import { useVehicle } from "@/hooks/useVehicle";
import { useAccount } from "@/hooks/useAccount";
import { useTrip } from "@/hooks/useTrip";
import { createTrip } from "@/stores/tripManager/thunk";

interface Props {
  orderID: string;
  onSuccess?: () => void;
}

const formatVietnamDateTime = (value: string) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
    hour12: true,
  }).format(date);
};

const UpdateTripModal = ({ orderID, onSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [driverID, setDriverID] = useState("");
  const [vehicleID, setVehicleID] = useState("");
  const [dueTime, setDueTime] = useState("");
  const { vehicles } = useVehicle();
  const { driverInfo } = useAccount();
  const { loading } = useTrip();

  useEffect(() => {
    dispatch(getVehicle({}));
    dispatch(driverCompanyAcc({}));
  }, [dispatch]);

  const handleAssign = async () => {
    if (!driverID || !vehicleID || !dueTime) {
      toast.warning("Vui lòng chọn đầy đủ tài xế, phương tiện và thời gian");
      return;
    }

    const res = await dispatch(
      createTrip({
        deliveryOrderID: orderID,
        driverID,
        vehicleID,
        dueTime: new Date(dueTime).toISOString(),
      })
    );

    if (createTrip.fulfilled.match(res)) {
      toast.success("Tạo hành trình thành công");
      onSuccess?.();
      setOpen(false);
      // reset form
      setDriverID("");
      setVehicleID("");
      setDueTime("");
    } else {
      toast.error("Tạo hành trình thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Cập nhật hành trình
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chọn tài xế & phương tiện</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Tài xế</label>
            <Select value={driverID} onValueChange={setDriverID}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn tài xế" />
              </SelectTrigger>
              <SelectContent>
                {driverInfo?.data.map((d) => (
                  <SelectItem key={d.driverID} value={d.driverID}>
                    {d.account.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Phương tiện
            </label>
            <Select value={vehicleID} onValueChange={setVehicleID}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn xe" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.vehicleID} value={v.vehicleID}>
                    {v.vehicleNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Thời gian dự kiến
            </label>
            <input
              type="datetime-local"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
            {dueTime && (
              <p className="text-xs text-muted-foreground mt-1">
                Đã chọn: {formatVietnamDateTime(dueTime)}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button onClick={handleAssign} disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTripModal;
