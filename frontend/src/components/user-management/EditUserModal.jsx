import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EditUserModal = ({ open, onOpenChange, onSubmit, editingUser, faculties, programs }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    faculty: "",
    program: "",
  });

  // Reset form when editingUser changes
  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        username: editingUser.username,
        email: editingUser.email,
        password: "",
        faculty: editingUser.faculty,
        program: editingUser.program,
      });
    }
  }, [editingUser]);

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      faculty: "",
      program: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, editingUser);
    resetForm();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User - {editingUser?.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-4 flex items-center">
            <Label>Nama</Label>
          </div>
          <div className="col-span-8">
            <Input 
              placeholder="Nama" 
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          <div className="col-span-4 flex items-center">
            <Label>Username</Label>
          </div>
          <div className="col-span-8">
            <Input 
              placeholder="Username" 
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
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
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          <div className="col-span-4 flex items-center">
            <Label>Password</Label>
          </div>
          <div className="col-span-8">
            <Input 
              placeholder="Kosongkan jika tidak ingin mengubah" 
              type="password" 
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </div>

          <div className="col-span-4 flex items-center">
            <Label>Fakultas</Label>
          </div>
          <div className="col-span-8">
            <Select onValueChange={(val) => handleInputChange('faculty', val)} value={formData.faculty}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Fakultas" />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-4 flex items-center">
            <Label>Program Studi</Label>
          </div>
          <div className="col-span-8">
            <Select onValueChange={(val) => handleInputChange('program', val)} value={formData.program}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Program Studi" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-12 flex justify-end gap-3 mt-4">
            <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
            <Button type="submit">Update</Button>
          </div>
        </form>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;