import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const EditProfileForm = ({ 
  formData, 
  onInputChange, 
  onSubmit, 
  loading = false 
}) => {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Edit Informasi</h3>
        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
          {/* Desktop: Grid layout, Mobile: Stack layout */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
            <div className="sm:col-span-4 flex items-center">
              <Label className="text-sm sm:text-base font-medium">Nama</Label>
            </div>
            <div className="sm:col-span-8">
              <Input 
                placeholder="Nama" 
                value={formData.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
            <div className="sm:col-span-4 flex items-center">
              <Label className="text-sm sm:text-base font-medium">Email</Label>
            </div>
            <div className="sm:col-span-8">
              <Input 
                placeholder="Email" 
                type="email"
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex justify-center sm:justify-end pt-4">
            <Button 
              type="submit" 
              className="bg-lime-300 hover:bg-lime-400 text-black w-full sm:w-auto min-w-[140px]"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};