'use client'
import CardStats from "@components/dashboard/card-stats";
import {Card, Col, Row, Space} from "antd";
import {AppstoreFilled, CheckCircleFilled, ExclamationCircleFilled, FrownFilled} from "@ant-design/icons";
import {getProcessOrders, getRecentOrders, getStatDashboard} from "@providers/data-provider";
import {useEffect, useState} from "react";
import OrderListSimple from "@components/dashboard/order-list-simple";

interface StatResponse {
    unpaid: number;
    processing: number;
    completed: number;
    cancelled: number;
}


export default function Page() {
    const [response, setResponse] = useState<StatResponse>();
    const [recentOrder, setRecentOrder] = useState<any>();
    const [processOrder, setProcessOrder] = useState<any>();

    useEffect(() => {
        getRecentOrders().then((res) => setRecentOrder(res.data.data));
        getStatDashboard().then((res) => setResponse(res.data));
        getProcessOrders().then((res) => setProcessOrder(res.data.data));
    }, []);

    if (!response) return <div>Loading...</div>;

    const stats = [
        {title: "Unpaid", value: response.unpaid, icon: <ExclamationCircleFilled/>},
        {title: "Processing", value: response.processing, icon: <AppstoreFilled/>},
        {title: "Completed", value: response.completed, icon: <CheckCircleFilled/>},
        {title: "Cancelled", value: response.cancelled, icon: <FrownFilled/>}
    ];

    return (
        <Card>
            <h1>Dashboard</h1>
            <Space direction={"vertical"} size={"middle"} style={{display: "flex"}}>

                <Row gutter={[16, 16]}>
                    {stats.map((stat, index) => (
                        <Col key={index} xs={24} sm={12} lg={6}>
                            <CardStats title={stat.title} value={stat.value} color=""
                                       icon={stat.icon}/>
                        </Col>
                    ))}
                </Row>
                <Row gutter={16}>
                    <Col xs={24} sm={12} lg={12}>
                        <OrderListSimple order={recentOrder} title={"Recent Order"}/>
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                        <OrderListSimple order={processOrder} title={"Need Processing"}/>
                    </Col>
                </Row>
            </Space>
        </Card>
    );
}