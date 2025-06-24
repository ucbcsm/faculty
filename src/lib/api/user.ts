import api, { authApi } from "@/lib/fetcher";
import { User } from "@/types";

export async function getUsers() {
  const res = await authApi.get(`/users/`);
  return res.data as User[];
}

export async function updateUser({
  id,
  params,
}: {
  id: number;
  params: Partial<Omit<User, "id">>;
}) {
  const res = await api.patch(`/account/users/${id}/`, {
    ...params,
  });
  return res.data;
}

// export async function getAsignedFaculty() {

//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("accessToken")?.value || null;

//   const res = await api.get(`/account/faculty-from-user/`, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   if (!res.data) {
//     return null;
//   }

//   return res.data as Faculty;
// }
