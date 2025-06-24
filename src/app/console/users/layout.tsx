"use client";

import {
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Flex,
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

export default function UsersLayout({
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
              Gestion des utilisateurs
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabList={[
            {
              key: "/console/users",
              label: "Tous",
            },
            { key: "/console/users/students", label: "Étudiants" },
            { key: "/console/users/teachers", label: "Enseignants" },
            { key: "/console/users/admins", label: "Admins" },
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
        <Flex
          justify="space-between"
          align="center"
          style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 12 }}
        >
          <Typography.Title level={5} className="">
            Rôles
          </Typography.Title>
          <Button
            type="link"
            icon={<PlusCircleOutlined />}
            title="Ajouter un rôle"
          >
            Ajouter
          </Button>
        </Flex>
        <div
          style={{
            padding: "20px 12px 28px 28px",
            width: "100%",
            height: "calc(100vh - 108px)",
            overflowY: "auto",
          }}
        >
          <List
            dataSource={[
              {
                id: "1",
                name: "Administrateur",
                description: "Accès complet au système",
              },
              {
                id: "2",
                name: "Enseignant",
                description: "Dispenser des cours",
              },
              {
                id: "3",
                name: "Étudiant",
                description: "Accès aux cours et aux notes",
              },
              {
                id: "4",
                name: "Secrétaire académique",
                description: "Gestion des inscriptions et des dossiers",
              },
              {
                id: "5",
                name: "Bibliothécaire",
                description: "Gestion des ressources de la bibliothèque",
              },
              {
                id: "6",
                name: "Apparitaire",
                description: "Support logistique et administratif",
              },
              {
                id: "7",
                name: "Coordonateur de faculté",
                description: "Supervision des programmes académiques",
              },
              {
                id: "8",
                name: "Secrétaire de faculté",
                description: "Gestion administrative de la faculté",
              },
            ]}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                extra={
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "edit",
                          label: "Modifier",
                          icon: <EditOutlined />,
                        },
                        {
                          key: "delete",
                          label: "Supprimer",
                          danger: true,
                          icon: <DeleteOutlined />,
                        },
                      ],
                    }}
                  >
                    <Button icon={<MoreOutlined />} type="text" />
                  </Dropdown>
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar icon={<KeyOutlined />}>
                      {item.name.charAt(0)}
                    </Avatar>
                  }
                  title={<Link href="#">{item.name}</Link>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </div>
      </Layout.Sider>
    </Layout>
  );
}
