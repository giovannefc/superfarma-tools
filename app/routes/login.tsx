import { Lock } from "lucide-react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, redirect, useActionData, useNavigation } from "react-router";

import logo from "~/assets/sfp_logo.png";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { authenticateUser, getUser } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // Se o usuário já estiver autenticado, redirecionar
  const user = await getUser(request);
  if (user) {
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get("redirectTo") || "/panel";
    return redirect(redirectTo);
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Autenticar o usuário
    const user = await authenticateUser(email, password);

    // Criar sessão
    const session = await sessionStorage.getSession(
      request.headers.get("Cookie"),
    );
    session.set("user", user);

    // Verificar se há redirectTo na URL
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get("redirectTo") || "/panel";

    // Redirecionar com a sessão para a página de destino
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isLoading = navigation.state === "submitting";

  return (
    <main className="text-foreground mx-auto flex h-screen flex-col items-center justify-center md:w-96">
      <header className="mb-6">
        <img src={logo} alt="Super Farma Popular" className="h-auto w-auto" />
      </header>
      <Form
        method="post"
        className="w-5/6 space-y-4 p-6 md:w-full md:p-10"
        noValidate
      >
        <div>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            required
            className={actionData?.error ? "border-destructive" : ""}
          />
        </div>

        <div>
          <Input
            name="password"
            type="password"
            placeholder="Senha"
            required
            className={actionData?.error ? "border-destructive" : ""}
          />
        </div>

        {actionData?.error && (
          <p className="text-destructive text-center text-sm">
            {actionData.error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Entrando...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Entrar
            </>
          )}
        </Button>
      </Form>
    </main>
  );
}
