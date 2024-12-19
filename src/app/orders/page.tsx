"use client";

import {DeleteButton, EditButton, FilterDropdown, List, ShowButton, useTable,} from "@refinedev/antd";
import {type BaseRecord} from "@refinedev/core";
import {Select, Space, Table, Tag} from "antd";
import React from "react";
import {OrderTagColor, OrderTagDescription} from "@libs/enums";
import moment from "moment";

export default function OrderList() {
    const {tableProps} = useTable({
        syncWithLocation: true,
        pagination: {
            mode: "server"
        },
        sorters: {
            mode: "server",
        },
        filters: {
            mode: "server",
            defaultBehavior: "replace"
        }
    });
    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title={"ID"}/>
                <Table.Column dataIndex="order_id" title={"Order ID"}/>
                <Table.Column dataIndex="status" title={"Status"} render={(value, record, index) => (
                    <Tag color={OrderTagColor[value as keyof typeof OrderTagColor]}>
                        {value}
                    </Tag>
                )}
                              filterDropdown={(props) => (
                                  <FilterDropdown {...props}>
                                      <Select
                                          style={{minWidth: 200}}
                                          placeholder="Select Category"
                                          options={
                                              Object.keys(OrderTagDescription).map((key) => ({
                                                  label: OrderTagDescription[key as keyof typeof OrderTagDescription],
                                                  value: key,
                                              }))
                                          }
                                      />
                                  </FilterDropdown>
                              )}
                />
                <Table.Column dataIndex="updated_at" title={"Create/Update Date"} sorter={{multiple: 1}}
                              render={(value, record, index) => (
                                  moment(value).format("YYYY-MM-DD HH:mm:ss")
                              )}/>
                <Table.Column
                    title={"Actions"}
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton hideText size="small" recordItemId={record.id}/>
                            <ShowButton hideText size="small" recordItemId={record.id}/>
                            <DeleteButton hideText size="small" recordItemId={record.id}/>
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
}