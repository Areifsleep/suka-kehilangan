import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiCamera, FiTrash2, FiUpload } from "react-icons/fi";
import { useAlert } from "@/components/AlertProvider";

export const ProfileImageUpload = ({ 
  currentImage, 
  onImageChange, 
  onImageRemove, 
  loading = false,
  className = "" 
}) => {
  const { showError, showSuccess } = useAlert();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentImage);

  // Update preview when currentImage changes
  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Harap pilih file gambar yang valid (JPG, PNG, GIF)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Ukuran file harus kurang dari 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Call parent handler
      onImageChange(file);
      showSuccess('Foto profil berhasil diunggah!');
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemove();
    showSuccess('Foto profil berhasil dihapus!');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 items-center ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={loading}
      />
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <FiCamera className="w-4 h-4" />
          <span className="hidden sm:inline">Change Photo</span>
          <FiUpload className="w-4 h-4 sm:hidden" />
        </Button>
        
        {(preview || currentImage) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
            disabled={loading}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <FiTrash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Remove</span>
          </Button>
        )}
      </div>
      
      <div className="text-xs text-gray-500 text-center sm:text-left">
        <div>Max size: 5MB</div>
        <div>Formats: JPG, PNG, GIF</div>
      </div>
    </div>
  );
};