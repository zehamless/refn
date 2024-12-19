import React from "react";
import {BaseRecord} from "@refinedev/core";
import {EditButton, List, ShowButton, useTable} from "@refinedev/antd";
import {Space, Table} from "antd";

export const OrderList = () => {
    const {tableProps} = useTable({
        syncWithLocation: true,
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <ShowButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
