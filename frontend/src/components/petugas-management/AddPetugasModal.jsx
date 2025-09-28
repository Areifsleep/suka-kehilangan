import React, { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddPetugasModal = ({ open, onOpenChange, onSubmit, posOptions }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    pos: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      pos: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    resetForm();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Petugas Baru</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleFormSubmit}
          className="grid grid-cols-12 gap-4 mt-4"
        >
          <div className="col-span-4 flex items-center">
            <Label>Nama</Label>
          </div>
          <div className="col-span-8">
            <Input
              placeholder="Nama"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div className="col-span-4 flex items-center">
            <Label>Username</Label>
          </div>
          <div className="col-span-8">
            <Input
              placeholder="Username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
          </div>

          <div className="col-span-4 flex items-center">
            <Label>Email</Label>
          </div>
          <div className="col-span-8">
            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>

          <div className="col-span-4 flex items-center">
            <Label>Password</Label>
          </div>
          <div className="col-span-8">
            <Input
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
          </div>

          <div className="col-span-4 flex items-center">
            <Label>Pos</Label>
          </div>
          <div className="col-span-8">
            <Select
              onValueChange={(val) => handleInputChange("pos", val)}
              value={formData.pos}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Pos" />
              </SelectTrigger>
              <SelectContent>
                {posOptions.map((p) => (
                  <SelectItem
                    key={p}
                    value={p}
                  >
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-12 flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit">Tambah</Button>
          </div>
        </form>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export default AddPetugasModal;
