import { getServerSession } from "@/lib/api/auth";
import { notFound, redirect } from "next/navigation";

export default async function Page() {
  const auth = await getServerSession();

  if (auth?.faculty) {
    redirect(`/app/faculty/${auth.faculty.id}`);
  } else {
    notFound();
  }
}
