import type { LoaderFunctionArgs } from "react-router";
import { Outlet } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Implementar autenticação
  // const user = await authenticator.isAuthenticated(request);
  // if (!user?.isAdmin) return redirect("/panel");

  return null;
}

export default function RelatoriosLayout() {
  return (
    <div className="space-y-8">
      <Outlet />
    </div>
  );
}
