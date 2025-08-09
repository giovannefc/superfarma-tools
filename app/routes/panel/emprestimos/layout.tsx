import { Plus } from "lucide-react";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { Outlet, useLocation } from "react-router";

import CreateEmprestimo, {
  CreateEmprestimoProvider,
  useCreateEmprestimo,
} from "~/components/panel/emprestimos/create-emprestimo";
import { Button } from "~/components/ui/button";
import { HeaderTabs } from "~/components/ui/header-tabs";

const tabs = [
  {
    name: "Devem pra nós",
    to: "/panel/emprestimos/deve",
  },
  {
    name: "Devemos",
    to: "/panel/emprestimos/devemos",
  },
  {
    name: "Parceiros",
    to: "/panel/emprestimos/parceiros",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const location = new URL(request.url).pathname;
  if (location === "/panel/emprestimos") {
    return redirect("/panel/emprestimos/deve");
  }
  return {};
}

function EmprestimosContent() {
  const { setOpen } = useCreateEmprestimo();
  const location = useLocation();

  const inParceiroLocation =
    location.pathname === "/panel/emprestimos/parceiros";

  const handleNovoEmprestimo = () => {
    setOpen(true);
  };

  return (
    <div className="flex flex-col space-y-4">
      <HeaderTabs tabs={tabs}>
        {!inParceiroLocation && (
          <Button onClick={handleNovoEmprestimo}>
            <Plus className="mr-2 h-4 w-4" />
            Novo empréstimo
          </Button>
        )}
      </HeaderTabs>
      <CreateEmprestimo />
      <Outlet />
    </div>
  );
}

export default function Emprestimos() {
  return (
    <CreateEmprestimoProvider>
      <EmprestimosContent />
    </CreateEmprestimoProvider>
  );
}
