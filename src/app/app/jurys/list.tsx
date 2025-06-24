import { getHSLColor } from "@/lib/utils";
import {
    DownOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    FilterOutlined,
    PlusOutlined,
    PrinterOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import {
    Button,
    Dropdown,
    Input,
    Space,
    Table,
    TableColumnType,
    Tag,
} from "antd";
import { useRouter } from "next/navigation";

type JuryType = {
    id: string | number;
    key: string;
    name: string;
    classes: string[];
    president: string;
    secretary: string;
    membersCount: number;
    status: "active" | "inactive";
    period: string; // Nouvelle propriété pour la période
};

const columns: TableColumnType<JuryType>[] = [
    {
        title: "Nom du Jury",
        dataIndex: "name",
        key: "name",
        render: (value) => value,
        ellipsis: true,
    },
    {
        title: "Période",
        dataIndex: "period",
        key: "period",
        render: (value) => value,
        ellipsis: true,
    },
    {
        title: "Promotions",
        dataIndex: "classes",
        key: "classes",
        render: (_, record) => (
            <Space wrap>
                {record.classes.map((classe, index) => (
                    <Tag
                        key={index}
                        color={getHSLColor(classe + index)}
                        bordered={false}
                        style={{ borderRadius: 15 }}
                    >
                        {classe}
                    </Tag>
                ))}
            </Space>
        ),
        ellipsis: true,
        align: "match-parent",
    },
    {
        title: "Président",
        dataIndex: "president",
        key: "president",
        render: (value) => value,
        ellipsis: true,
    },
    {
        title: "Secrétaire",
        dataIndex: "secretary",
        key: "secretary",
        render: (value) => value,
        ellipsis: true,
    },
    {
        title: "Membres",
        dataIndex: "membersCount",
        key: "membersCount",
        width: 80,
        render: (value) => value,
        align: "center",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 96,
        render: (value) => (
            <>
                {value === "active" && (
                    <Tag bordered={false} color="success" className="w-full mr-0">
                        Actif
                    </Tag>
                )}
                {value === "inactive" && (
                    <Tag bordered={false} color="default" className="w-full mr-0">
                        Inactif
                    </Tag>
                )}
            </>
        ),
    },
];

const data: JuryType[] = Array.from({ length: 5 }, (_, index) => {
    const id = (index + 1).toString();
    return {
        id,
        key: id,
        name: `Jury ${id}`,
        classes: [
            "L1 Genie informatique",
            "L2 Economie",
            "L4 Théologie",
            "L2 Electromécanique",
            "L2 Informatique de gestion",
        ],
        president: `Président ${id}`,
        secretary: `Secrétaire ${id}`,
        membersCount: Math.floor(Math.random() * 10) + 3,
        status: index % 2 === 0 ? "active" : "inactive",
        period: `Session ${index + 1}`, // Exemple de données pour la période
    };
});

export function JurysList() {
    const router = useRouter();
    return (
        <Table
            title={() => (
                <header className="flex pb-3">
                    <Space>
                        <Input.Search placeholder="Rechercher ..." />
                        <Button icon={<FilterOutlined />} style={{ boxShadow: "none" }}>
                            Filtrer
                        </Button>
                    </Space>
                    <div className="flex-1" />
                    <Space>
                        <Button
                            icon={<PlusOutlined />}
                            type="primary"
                            style={{ boxShadow: "none" }}
                        >
                            Ajouter un jury
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
                                        title: "Exporter vers Excel",
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
            columns={columns}
            dataSource={data}
            rowClassName={`bg-[#f5f5f5] odd:bg-white hover:cursor-pointer`}
            rowSelection={{
                type: "checkbox",
            }}
            size="small"
            pagination={{
                defaultPageSize: 25,
                pageSizeOptions: [25, 50, 75, 100],
                size: "small",
            }}
            onRow={(record) => ({
                onClick: () => {
                    router.push(`/app/jurys/${record.id}`); // Navigate to the jury details page
                },
            })}
        />
    );
}
