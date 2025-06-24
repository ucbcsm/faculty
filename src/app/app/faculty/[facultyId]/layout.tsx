"use client";
import { Card, Form, Layout, Skeleton, Space, theme, Typography } from "antd";

import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFaculty } from "@/lib/api";

export default function FacultyLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { facultyId } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const {
    data: faculty,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["faculty", facultyId],
    queryFn: ({ queryKey }) => getFaculty(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  // const { data: cycles } = useQuery({
  //       queryKey: ["cycles"],
  //       queryFn: getCycles,
  //     });
  //  const { data: departments } = useQuery({
  //      queryKey: ["departments", facultyId],
  //      queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
  //      enabled: !!facultyId,
  //    });

  return <>{children}</>;
}
