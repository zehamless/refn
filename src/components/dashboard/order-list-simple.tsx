import {Card, Flex, List, Tag, Typography} from "antd";
import {OrderTagColor, OrderTagDescription} from "@libs/enums";
import {DateField} from "@refinedev/antd";
import {useRouter} from "next/navigation";

interface Order {
    id: string;
    user: { name: string };
    created_at: string;
    status: string;
    order_type: string;
}

interface OrderListSimpleProps {
    order: Order[];
    title: string;
}

export default function OrderListSimple({order, title}: OrderListSimpleProps) {
    const router = useRouter();

    return (
        <Card style={{boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'}}>
            <List
                header={<Typography.Text strong>{title}</Typography.Text>}
                dataSource={order}
                renderItem={(item: Order) => (
                    <List.Item
                        onClick={() => router.push(`/orders/show/${item.id}`)}
                        style={{cursor: 'pointer', transition: 'box-shadow 0.3s'}}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                        <List.Item.Meta
                            title={item.user.name}
                            description={<DateField value={item.created_at} format="YYYY-MM-DD HH:mm"/>}
                        />
                        <Flex vertical>
                            <Tag
                                color={OrderTagColor[item.status as keyof typeof OrderTagColor]}>{OrderTagDescription[item.status as keyof typeof OrderTagDescription]}</Tag>
                            <Tag>
                                {item.order_type}
                            </Tag>
                        </Flex>
                    </List.Item>
                )}
                style={{maxHeight: '400px', overflow: 'auto'}}
            />
        </Card>
    )
}