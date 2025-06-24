import { LoginForm } from "./form";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/api/auth";
import { Suspense } from "react";

export default async function Page() {
  const auth = await getServerSession();

  if (auth?.faculty) {
    redirect(`/app/faculty/${auth.faculty.id}`);
  }

  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
