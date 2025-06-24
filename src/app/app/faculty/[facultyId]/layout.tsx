"use client";
import {
  Card,
  Form,
  Layout,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";

import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCycles, getDepartmentsByFacultyId, getFaculty } from "@/lib/api";
import { ListTeachingUnits } from "./courses/teaching-units/list";

export default function FacultyLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
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

  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          background: colorBgContainer,
          overflowY: "auto",
          height: "calc(100vh - 64px)",
        }}
      >
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            padding: 0,
          }}
        >
          <Space>
            <BackButton />
            {!isPending ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                {faculty?.name} (Faculté)
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabList={[
            {
              key: `/app/faculty/${facultyId}`,
              label: "Aperçu",
            },
            { key: `/app/faculty/${facultyId}/students`, label: "Étudiants" },
            {
              key: `/app/faculty/${facultyId}/departments`,
              label: "Départements",
            },
            {
              key: `/app/faculty/${facultyId}/taught-courses`,
              label: "Cours programmés",
            },
            {
              key: `/app/faculty/${facultyId}/courses`,
              label: "Catalogue des cours",
            },
            { key: `/app/faculty/${facultyId}/teachers`, label: "Enseignants" },
          ]}
          defaultActiveTabKey={pathname}
          activeTabKey={pathname}
          onTabChange={(key) => {
            router.push(key);
          }}
        >
          {children}
        </Card>
        <Layout.Footer
          style={{
            display: "flex",
            background: colorBgContainer,
            padding: "24px 0",
          }}
        >
          <Typography.Text type="secondary">
            © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
          </Typography.Text>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Footer>
      </Layout.Content>
      {/* <Layout.Sider
        width={280}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
      >
        <ListTeachingUnits cycles={cycles} departments={departments}/>
      </Layout.Sider> */}
    </Layout>
  );
}
