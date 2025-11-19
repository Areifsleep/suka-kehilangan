import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudyPrograms } from "@/features/admin-management/mutations/adminManagementMutations";

export const CreateUserModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    studyProgramId: "",
  });

  const { data: studyPrograms } = useStudyPrograms();

  const resetForm = () => {
    setFormData({
      fullName: "",
      username: "",
      email: "",
      password: "",
      studyProgramId: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Clean up data - convert empty string to undefined for optional fields
    const cleanedData = {
      ...formData,
      studyProgramId: formData.studyProgramId || undefined,
    };

    onSubmit(cleanedData);
    resetForm();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah User Baru</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleFormSubmit}
          className="grid grid-cols-12 gap-4 mt-4"
        >
          <div className="col-span-4 flex items-center">
            <Label>Nama Lengkap</Label>
          </div>
          <div className="col-span-8">
            <Input
              placeholder="Nama Lengkap"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              required
              disabled={loading}
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
              required
              disabled={loading}
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
              required
              disabled={loading}
            />
          </div>

          <div className="col-span-4 flex items-center">
            <Label>Password</Label>
          </div>
          <div className="col-span-8">
            <Input
              placeholder="Password (min. 8 karakter)"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
          </div>

          <div className="col-span-4 flex items-center">
            <Label>Program Studi</Label>
          </div>
          <div className="col-span-8">
            <Select
              value={formData.studyProgramId}
              onValueChange={(value) => handleInputChange("studyProgramId", value)}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Program Studi (Opsional)" />
              </SelectTrigger>
              <SelectContent>
                {studyPrograms?.map((program) => (
                  <SelectItem
                    key={program.id}
                    value={program.id.toString()}
                  >
                    {program.name} ({program.level}) - {program.faculty?.abbreviation}
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
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Tambah User"}
            </Button>
          </div>
        </form>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};
