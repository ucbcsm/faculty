"use client";

import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Space,
  Table,
  Tag,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { DataFetchErrorResult } from "@/components/errorResult";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { User } from "@/types";
import { DeleteUserForm } from "./forms/delete";
import { EditUserForm } from "./forms/edit";


type ActionsBarProps = {
  record: User;
};

const ActionsBar: FC<ActionsBarProps> = ({ record }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditUserForm
        user={record}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteUserForm
        user={record}
        open={openDelete}
        setOpen={setOpenDelete}
      />
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
              icon: <DeleteOutlined />,
              danger: true,
            },
          ],
          onClick: ({ key }) => {
            if (key === "edit") {
              setOpenEdit(true);
            } else if (key === "delete") {
              setOpenDelete(true);
            }
          },
        }}
      >
        <Button type="text" icon={<MoreOutlined />} />
      </Dropdown>
    </Space>
  );
};


export const ListUsers:FC=()=> {


  const { data: users, isPending, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if(isPending){
    return <DataFetchPendingSkeleton variant="table"/>
  }

  if(isError){
    return <DataFetchErrorResult/>
  }

  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Input.Search placeholder="Rechercher un utilisateur ..." />
          </Space>
          <div className="flex-1" />
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              title="Ajouter un utilisateur"
              style={{ boxShadow: "none" }}
            >
              Ajouter
            </Button>
            <Button icon={<PrinterOutlined />} style={{ boxShadow: "none" }}>
              Imprimer
            </Button>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "pdf",
                    label: "PDF",
                    icon: <FilePdfOutlined />,
                    title: "Exporter en pdf",
                  },
                  {
                    key: "excel",
                    label: "EXCEL",
                    icon: <FileExcelOutlined />,
                    title: "Exporter ver excel",
                  },
                ],
              }}
            >
              <Button icon={<DownOutlined />} style={{ boxShadow: "none" }}>
                Exporter
              </Button>
            </Dropdown>
          </Space>
        </header>
      )}
      columns={[
        {
          key: "avatar",
          dataIndex: "avatar",
          title: "Photo",
          render: (value, record) => (
            <Avatar src={value} alt={record?.first_name || ""}>
              {record.first_name?.charAt(0) || "U"}
            </Avatar>
          ),
          width:56
        },
        {
          key: "fullName",
          dataIndex: "fullName",
          title: "Nom complet",
          render: (_, record, __) =>
            `${record.first_name || ""} ${record.last_name || ""} ${
              record.surname || ""
            }`,
        },
        {
          key: "matricule",
          dataIndex: "matricule",
          title: "Matricule",
        },
        {
          key: "email",
          dataIndex: "email",
          title: "Email",
        },
        {
          key: "role",
          dataIndex: "role",
          title: "Rôle",
        },
        {
          key: "date_joined",
          dataIndex: "date_joined",
          title: "Création",
          render: (_, record, __) => dayjs(record.date_joined).format("DD/MM/YYYY"),
        ellipsis:true
        },
        {
          key: "status",
          dataIndex: "status",
          title: "Statut",
          render: (_, record, __) => (
            <Tag
              color={record.is_active ? "green" : "red"}
              style={{ border: 0 }}
            >
              {record.is_active ? "Actif" : "Bloqué"}
            </Tag>
          ),
          width:60
        },
        {
          key: "actions",
          dataIndex: "actions",
          render: (_, record, __) => {
            return (
             <ActionsBar record={record}/>
            );
          },
          width: 50,
        },
      ]}
      dataSource={users}
      rowKey="id"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      rowSelection={{
        type: "checkbox",
      }}
      size="small"
      pagination={{
        defaultPageSize: 10,
        pageSizeOptions: [10, 25, 50],
        size: "small",
      }}
      bordered={false}
    />
  );
}
