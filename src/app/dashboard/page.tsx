'use client'
import CardStats from "@components/dashboard/card-stats";
import {Card, Col, Row} from "antd";
import {AppstoreFilled, CheckCircleFilled, ExclamationCircleFilled, FrownFilled} from "@ant-design/icons";
import {getStatDashboard} from "@providers/data-provider";
import {useEffect, useState} from "react";

interface StatResponse {
    unpaid: number;
    processing: number;
    completed: number;
    cancelled: number;
}

export default function Page() {
    const [response, setResponse] = useState<StatResponse>();

    useEffect(() => {
        getStatDashboard().then((res) => setResponse(res.data));
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
            <Row gutter={[16, 16]}>
                {stats.map((stat, index) => (
                    <Col key={index} xs={24} sm={12} lg={6}>
                        <CardStats title={stat.title} value={stat.value} color=""
                                   icon={stat.icon}/>
                    </Col>
                ))}
            </Row>
        </Card>
    );
}