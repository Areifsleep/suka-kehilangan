import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteUserModal = ({ open, onOpenChange, onConfirm, deletingUser }) => {
  const handleConfirm = () => {
    onConfirm(deletingUser);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus User</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <p>
            Apakah Anda yakin ingin menghapus user <strong>{deletingUser?.name}</strong>?
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
          >
            Hapus
          </Button>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserModal;
