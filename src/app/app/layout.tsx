"use client";

import { LanguageSwitcher } from "@/components/languageSwitcher";
import { YearSelector } from "@/components/yearSelector";
import { useYid } from "@/hooks/use-yid";
import { getDepartmentsByFacultyId } from "@/lib/api";
// import { getFaculties } from "@/lib/api";
import { logout } from "@/lib/api/auth";
import { useSessionStore } from "@/store";
import {
  BranchesOutlined,
  LoadingOutlined,
  LogoutOutlined,
  MenuOutlined,
  QuestionOutlined,
  SubnodeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Dropdown,
  Image,
  Layout,
  Menu,
  message,
  Space,
  Spin,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG, colorBorderSecondary },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);
  const { faculty } = useSessionStore();
  const { removeYid } = useYid();

  const router = useRouter();
  const pathname = usePathname();

  const { data: departments } = useQuery({
      queryKey: ["departments", `${faculty?.id}`],
      queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
      enabled: !!faculty?.id,
    });

  const getDepartmentsAsMenu = () => {
    const menu = departments?.map((dep) => ({
      key: `/app/department/${dep.id}`,
      label: dep.name,
      icon: <SubnodeOutlined />,
    }));
    return menu;
  };

  return (
    <Layout>
      {contextHolder}
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          borderBottom: `1px solid ${colorBorderSecondary}`,
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        <Link
          href={`/app/faculty/${faculty?.id}`}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div className="flex items-center pr-3">
            <Image
              src="/ucbc-logo.png"
              alt="Logo ucbc"
              width={36}
              preview={false}
            />
          </div>
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            {faculty?.acronym}
          </Typography.Title>
        </Link>
        <Menu
          mode="horizontal"
          theme="light"
          defaultSelectedKeys={[pathname]}
          selectedKeys={[pathname]}
          overflowedIndicator={<MenuOutlined />}
          items={[
            {
              key: `/app/faculty/${faculty?.id}`,
              label: "Aperçu",
            },
            { key: `/app/faculty/${faculty?.id}/students`, label: "Étudiants" },
            {
              key: `departments`,
              label: "Mentions",
              //  icon: <BranchesOutlined />,
              children: getDepartmentsAsMenu()
            },
            {
              key: `/app/faculty/${faculty?.id}/taught-courses`,
              label: "Cours",
            },
            {
              key: `/app/faculty/${faculty?.id}/courses`,
              label: "Catalogue",
            },
            // {
            //   key: `/app/faculty/${faculty?.id}/teachers`,
            //   label: "Enseignants",
            // },
          ]}
          style={{ flex: 1, minWidth: 0, borderBottom: 0 }}
          onClick={({ key }) => {
            router.push(key);
          }}
        />
        <Space>
          <YearSelector />
          <Dropdown
            menu={{
              items: [
                {
                  key: "/app/profile",
                  label: "Mon profile",
                  icon: <UserOutlined />,
                },
                {
                  type: "divider",
                },
                {
                  key: "logout",
                  label: "Déconnexion",
                  icon: <LogoutOutlined />,
                },
              ],
              onClick: async ({ key }) => {
                if (key === "logout") {
                  setIsLoadingLogout(true);
                  await logout()
                    .then(() => {
                      removeYid();
                      window.location.href = "/auth/login";
                    })
                    .catch((error) => {
                      console.log(
                        "Error",
                        error.response?.status,
                        error.message
                      );
                      messageApi.error(
                        "Ouf, une erreur est survenue, Veuillez réessayer!"
                      );
                      setIsLoadingLogout(false);
                    });
                }
              },
            }}
            trigger={["hover"]}
          >
            <Button
              disabled={isLoadingLogout}
              type="text"
              icon={<UserOutlined />}
            />
          </Dropdown>
          <Link href="/app/support">
            <Button type="text" icon={<QuestionOutlined />}></Button>
          </Link>
          <LanguageSwitcher />
        </Space>
      </Layout.Header>
      <Layout.Content>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
          <div
            className=""
            style={{
              display: isLoadingLogout ? "flex" : "none",
              flexDirection: "column",
              background: "#fff",
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 99,
              height: "100vh",
              width: "100%",
            }}
          >
            <div
              style={{
                width: 440,
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
              <Typography.Title
                type="secondary"
                level={3}
                style={{ marginTop: 10 }}
              >
                Déconnexion en cours ...
              </Typography.Title>
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
}
