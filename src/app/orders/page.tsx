"use client";

import {DateField, DeleteButton, FilterDropdown, List, ShowButton, useTable} from "@refinedev/antd";
import {type BaseRecord} from "@refinedev/core";
import {Select, Space, Table, Tag, Typography} from "antd";
import React from "react";
import {OrderTagColor, OrderTagDescription} from "@libs/enums";

export default function OrderList() {
    const {tableProps} = useTable({
        syncWithLocation: true,
        pagination: {mode: "server"},
        sorters: {mode: "server"},
        filters: {mode: "server", defaultBehavior: "replace"}
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="user"
                    title="Customer Name"
                    render={(user) => user?.name}
                />
                <Table.Column
                    dataIndex="status"
                    title="Status"
                    render={(value) => (
                        <Tag color={OrderTagColor[value as keyof typeof OrderTagColor] || 'defaultColor'}>
                            {value}
                        </Tag>
                    )}
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Select
                                style={{minWidth: 200}}
                                placeholder="Select Category"
                                options={Object.keys(OrderTagDescription).map((key) => ({
                                    label: OrderTagDescription[key as keyof typeof OrderTagDescription],
                                    value: key,
                                }))}
                            />
                        </FilterDropdown>
                    )}
                />
                <Table.Column
                    dataIndex="updated_at"
                    title="Create/Update Date"
                    sorter={{multiple: 1}}
                    render={(value, record) => (
                        <>
                            <div>
                                <Typography.Text strong>Order Date: </Typography.Text>
                                <DateField value={value} format="DD-MM-YYYY"/>
                            </div>
                            <div>
                                <Typography.Text strong>Estimated Date: </Typography.Text>
                                <DateField value={record.estimated_date} format="DD-MM-YYYY"/>
                            </div>
                        </>
                    )}
                />
                <Table.Column
                    dataIndex="total_amount"
                    title="Total"
                    render={(value, record) => (
                        <>
                            <Tag color="lime">Total: {value}</Tag>
                            <Tag color="magenta">Paid: {record.paid}</Tag>
                            <Tag
                                color="yellow">Debt: {(record.paid >= value ? '0' : (value - record.paid).toFixed(2))}</Tag>
                        </>
                    )}
                />
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            {/*<Button icon={<DollarOutlined />} size="small" />*/}
                            <ShowButton hideText size="small" recordItemId={record.id}/>
                            <DeleteButton hideText size="small" recordItemId={record.id}/>
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
}