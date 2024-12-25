'use client'
import {OrderTagColor} from "@libs/enums";
import {DateField, Show} from "@refinedev/antd";
import {ColorPicker, Descriptions, Divider, Space, Table, Tag, Typography} from "antd";
import React, {useMemo} from "react";
import {useShow} from "@refinedev/core";
import {Clothes} from "@libs/definitions";

const OrderShow: React.FC = () => {
    const {queryResult: {data, isLoading}} = useShow({});
    const record = data?.data?.data;

    const columns = useMemo(() => [
        {title: "ID", dataIndex: "id"},
        {title: "Clothes", dataIndex: "name"},
        {
            title: "Color",
            dataIndex: "color",
            render: (value: string) => (
                <ColorPicker
                    defaultValue={value}
                    disabled
                    disabledAlpha
                />
            )
        },
        {title: "Rate", dataIndex: "price"},
        {title: "Qty", dataIndex: "quantity"},
        {
            title: "Total",
            render: ({price, quantity}: { price: number, quantity: number }) => price * quantity
        },
    ], []);

    const items = useMemo(() => [
        {
            key: '1',
            label: 'Order ID',
            children: <Typography.Text copyable>{record?.invoice_id}</Typography.Text>,
            span: 2,
        },
        {
            key: '3',
            label: 'Customer Name',
            children: record?.user?.name ?? "N/A",
            span: 2
        },
        {
            key: '2',
            label: 'Order Date',
            children: <DateField value={record?.updated_at} format="DD-MM-YYYY"/>,
        },
        {
            key: '4',
            label: 'Status',
            children: (
                <Tag color={OrderTagColor[record?.status as keyof typeof OrderTagColor] ?? "default"}>
                    {record?.status ?? "N/A"}
                </Tag>
            ),
        },
        {
            key: '6',
            label: 'User Address',
            children: record?.user?.address ?? "N/A",
            span: 2
        },
        {
            key: '5',
            label: 'Estimated Date',
            children: <DateField value={record?.estimated_date} format="DD-MM-YYYY"/>,
        },
        {
            key: '7',
            label: 'Order Type',
            children: <Tag>{record?.order_type ?? "N/A"}</Tag>,
        },
        {
            key: '9',
            label: 'User Phone',
            children: record?.user?.phone ?? "N/A",
            span: 2
        },
        {
            key: '8',
            label: 'Total Amount',
            children: <Tag color="lime">{record?.total_amount ?? "N/A"}</Tag>,
        },
        {
            key: '10',
            label: 'Paid Amount',
            children: <Tag color="magenta">{record?.paid ?? "N/A"}</Tag>,
        },
    ], [record]);

    return (
        <Show isLoading={isLoading} canDelete canEdit={false}>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <Descriptions title="Order Info" items={items} column={4}/>
                <Table
                    columns={columns}
                    dataSource={record?.order_services}
                    rowKey="id"
                />
                <Divider/>
                <div>
                    <Typography.Text strong>Notes: </Typography.Text>
                    <Typography.Paragraph>{record?.notes}</Typography.Paragraph>
                </div>
            </Space>
        </Show>
    );
};

export default React.memo(OrderShow);
