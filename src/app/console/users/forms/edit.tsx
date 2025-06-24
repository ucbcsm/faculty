"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
import {
    Col,
    Form,
    Input,
    message,
    Modal,
    Row,
    Select,
    Switch,
} from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/lib/api";
import { User } from "@/types";

type EditUserFormProps = {
    user: User;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

type FormDataType = Omit<User, "id">;

export const EditUserForm: FC<EditUserFormProps> = ({
    user,
    open,
    setOpen,
}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: updateUser,
    });

    const onFinish = (values: FormDataType) => {
        mutateAsync(
            { id: user.id, params: values },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["users"] });
                    queryClient.invalidateQueries({
                        queryKey: ["user", String(user.id)],
                    });
                    messageApi.success("Compte utilisateur mis à jour avec succès !");
                    setOpen(false);
                },
                onError: () => {
                    messageApi.error(
                        "Une erreur s'est produite lors de la mise à jour du compte utilisateur."
                    );
                },
            }
        );
    };

    return (
        <>
            {contextHolder}
            <Modal
                open={open}
                title="Modifier le compte utilisateur"
                centered
                okText="Mettre à jour"
                cancelText="Annuler"
                okButtonProps={{
                    autoFocus: true,
                    htmlType: "submit",
                    style: { boxShadow: "none" },
                    loading: isPending,
                }}
                cancelButtonProps={{
                    style: { boxShadow: "none" },
                }}
                onCancel={() => setOpen(false)}
                destroyOnClose
                closable={!isPending}
                maskClosable={!isPending}
                modalRender={(dom) => (
                    <Form
                        disabled={isPending}
                        key="edit_user_form"
                        layout="vertical"
                        form={form}
                        name="edit_user_form"
                        initialValues={{
                            is_superuser: user.is_superuser,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            is_staff: user.is_staff,
                            is_active: user.is_active,
                            surname: user.surname,
                            username: user.username,
                            email: user.email,
                            matricule: user.matricule,
                            avatar: user.avatar,
                            pending_avatar: user.pending_avatar,
                        }}
                        onFinish={onFinish}
                    >
                        {dom}
                    </Form>
                )}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="first_name"
                            label="Prénom"
                        >
                            <Input placeholder="Prénom" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="last_name"
                            label="Nom"
                        >
                            <Input placeholder="Nom" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="username"
                            label="Nom d'utilisateur"
                            rules={[
                                { required: true, message: "Veuillez entrer le nom d'utilisateur" },
                            ]}
                        >
                            <Input placeholder="Nom d'utilisateur" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, type: "email", message: "Veuillez entrer un email valide" },
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="matricule"
                            label="Matricule"
                            rules={[
                                { required: true, message: "Veuillez entrer le matricule" },
                            ]}
                        >
                            <Input placeholder="Matricule" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="surname"
                            label="Surnom"
                        >
                            <Input placeholder="Surnom" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="is_superuser"
                            label="Super utilisateur"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="is_staff"
                            label="Membre du staff"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="is_active"
                            label="Actif"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    name="avatar"
                    label="Avatar"
                >
                    <Input placeholder="URL de l'avatar" />
                </Form.Item>
                <Form.Item
                    name="pending_avatar"
                    label="Avatar en attente"
                >
                    <Input placeholder="URL de l'avatar en attente" />
                </Form.Item>
            </Modal>
        </>
    );
}
