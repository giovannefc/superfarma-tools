import { createContext, useContext, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

import { EmprestimoForm } from "./emprestimo-form";

interface CreateEmprestimoContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CreateEmprestimoContext =
  createContext<CreateEmprestimoContextType | null>(null);

export function useCreateEmprestimo() {
  const context = useContext(CreateEmprestimoContext);
  if (!context) {
    throw new Error(
      "useCreateEmprestimo must be used within CreateEmprestimoProvider",
    );
  }
  return context;
}

export function CreateEmprestimoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <CreateEmprestimoContext.Provider value={{ open, setOpen }}>
      {children}
    </CreateEmprestimoContext.Provider>
  );
}

export default function CreateEmprestimo() {
  const { open, setOpen } = useCreateEmprestimo();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full p-6 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Novo empréstimo</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <EmprestimoForm />
        </div>
      </SheetContent>
    </Sheet>
  );
}
