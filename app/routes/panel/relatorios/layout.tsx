import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect } from "react-router";

import { requireUser } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  if (!user?.isAdmin) {
    return redirect("/panel");
  }
  return {};
}

export default function RelatoriosLayout() {
  return (
    <div className="space-y-8">
      <Outlet />
    </div>
  );
}
