"use client";

import { MoreOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Layout,
  List,
  Space,
  theme,
  Typography,
} from "antd";

import { Palette } from "@/components/palette";
import Link from "next/link";
import BackButton from "@/components/backButton";
import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function CoursesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const pathname = usePathname();
  const router = useRouter();

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
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Gestion des cours
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabList={[
            { key: "/console/courses", label: "Cours" },
            {
              key: "/console/courses/evaluation-form",
              label: "Formulaire d'évaluation",
            },
          ]}
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

      <Layout.Sider
        width={280}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
      >
        <Card
          variant="borderless"
          title="Groupes de cours"
          style={{ boxShadow: "none" }}
          extra={
            <Button
              type="link"
              icon={<PlusCircleOutlined />}
              title="Ajouter un groupe"
            >
              Ajouter
            </Button>
          }
        >
          <List
            dataSource={[
              {
                id: "1",
                name: "Sciences de Base",
              },
              {
                id: "2",
                name: "Informatique",
              },
              {
                id: "3",
                name: "Génie Civil",
              },
              {
                id: "4",
                name: "Sciences Économiques",
              },
              {
                id: "5",
                name: "Médecine",
              },
            ]}
            renderItem={(item, index) => (
              <List.Item
                key={item.id}
                extra={
                  <Dropdown
                    menu={{
                      items: [
                        { key: "1", label: "Modifier" },
                        { key: "2", label: "Supprimer" },
                        { key: "3", label: "Voir détails" },
                      ],
                    }}
                  >
                    <Button icon={<MoreOutlined />} type="text" />
                  </Dropdown>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar>G{index + 1}</Avatar>}
                  title={<Link href="#">{item.name}</Link>}
                />
              </List.Item>
            )}
          />
        </Card>
      </Layout.Sider>
    </Layout>
  );
}
