'use client'
import {OrderTagColor} from "@libs/enums";
import {DateField, Show} from "@refinedev/antd";
import {Descriptions, Tag} from "antd";
import React from "react";
import {useShow} from "@refinedev/core";

export default React.memo(function OrderShow() {
    const {queryResult} = useShow({});
    const {data, isLoading} = queryResult;

    const record = data?.data?.data;

    const items = React.useMemo(() => [
        {
            key: '1',
            label: 'Order ID',
            children: record?.invoice_id || "N/A",
            span: 3,
        },
        {
            key: '2',
            label: 'Order Date',
            children: <DateField value={record?.updated_at} format="DD-MM-YYYY"/>,
        },
        {
            key: '3',
            label: 'Customer Name',
            children: record?.user?.name || "N/A",
        },
        {
            key: '4',
            label: 'Status',
            children: (
                <Tag color={OrderTagColor[record?.status as keyof typeof OrderTagColor] || "default"}>
                    {record?.status || "N/A"}
                </Tag>
            ),
        },
        {
            key: '5',
            label: 'Estimated Date',
            children: <DateField value={record?.estimated_date} format="DD-MM-YYYY"/>,
        },
        {
            key: '6',
            label: 'User Address',
            children: record?.user?.address || "N/A",
        },
        {
            key: '7',
            label: 'Order Type',
            children: <Tag>{record?.order_type || "N/A"}</Tag>,
        },
        {
            key: '8',
            label: 'Total Amount',
            children: <Tag color="lime">{record?.total_amount || "N/A"}</Tag>,
        },
        {
            key: '9',
            label: 'User Phone',
            children: record?.user?.phone || "N/A",
        },
        {
            key: '10',
            label: 'Paid Amount',
            children: <Tag color="magenta">{record?.paid || "N/A"}</Tag>,
        },
    ], [record]);

    return (
        <Show isLoading={isLoading} canDelete={true} canEdit={false}>
            <Descriptions title="Order Info" items={items}/>
        </Show>
    );
});
