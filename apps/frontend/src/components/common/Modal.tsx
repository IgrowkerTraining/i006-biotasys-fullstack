interface ModalProps {
  open: boolean;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {children}
      </div>
    </div>
  );
};
