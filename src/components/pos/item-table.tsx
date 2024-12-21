'use client'
import {
    Button,
    ColorPicker,
    DatePicker,
    Divider,
    Flex,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Select,
    Table,
    Typography
} from "antd";
import {BlockOutlined, UserAddOutlined} from "@ant-design/icons";
import {useCallback, useMemo, useState} from "react";
import {useModal} from "@refinedev/antd";
import {useStore} from "@libs/store";
import {Clothes} from "@libs/definitions";


const PERSON_OPTIONS = [
    {value: 'jack', label: 'Jack'},
    {value: 'lucy', label: 'Lucy'},
    {value: 'tom', label: 'Tom'},
] as const;

const TABLE_SCROLL = {y: 400, x: "max-content"};

export default function ItemTable() {
    const [formType, setFormType] = useState<'addon' | 'notes' | null>(null);
    const [form] = Form.useForm();
    const {addOrder, orders, notes, addNotes, updateQty, deleteOrder, sendPayment} = useStore();
    const {show, close, modalProps} = useModal();

    const handleShowModal = useCallback((type: 'addon' | 'notes') => {
        setFormType(type);
        show();
    }, [show]);

    const handleModalOK = useCallback(async () => {
        try {
            const values = await form.validateFields();
            if (formType === 'notes') {
                addNotes(values.description);
            } else {
                addOrder({
                    id: values.title,
                    clothes: values.title,
                    color: '',
                    rate: values.fee,
                    qty: 1
                });
            }
            form.resetFields();
            close();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    }, [formType, addNotes, addOrder, form, close]);

    const columns = useMemo(() => [
        {title: "ID", dataIndex: "id"},
        {title: "Clothes", dataIndex: "clothes"},
        {
            title: "Color",
            dataIndex: "color",
            render: (value: string, record: Clothes) => <ColorPicker defaultValue={value} disabledAlpha/>
        },
        {title: "Rate", dataIndex: "rate"},
        {
            title: "Qty",
            dataIndex: "qty",
            render: (value: number, record: Clothes) => (
                <InputNumber
                    min={1}
                    value={value}
                    size={"small"}
                    onChange={(value) => updateQty(record.id, value ?? 1)}
                />
            )
        },
        {
            title: "Total",
            render: (value: any, record: Clothes) => record.rate * record.qty
        },
        {
            title: "Actions",
            render: (value: any, record: Clothes) => (
                <Flex gap="small" wrap>
                    <Button type="primary" size={"small"} onClick={() => deleteOrder(record.id)} danger>Delete</Button>
                </Flex>
            )
        }
    ], [updateQty, deleteOrder]);

    return (
        <>
            <Flex gap="middle" wrap justify="center">
                <DatePicker style={{width: '25%'}}/>
                <Select
                    style={{width: '60%'}}
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="label"
                    options={PERSON_OPTIONS}
                />
                <Button type="primary" shape="circle" icon={<UserAddOutlined/>}/>
            </Flex>
            <Table
                dataSource={orders}
                columns={columns}
                rowKey="id"
                tableLayout={"auto"}
                pagination={false}
                scroll={TABLE_SCROLL}
                footer={() => <Footer handleShowModal={handleShowModal} orders={orders}/>}
                style={{marginTop: 10}}
            />
            <Modal {...modalProps} title={formType === 'addon' ? "Addon Fee" : "Notes"} onOk={handleModalOK}>
                <Form form={form} layout="vertical">
                    {formType === 'addon' ? (
                        <>
                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[{required: true, message: 'Please input the title!'}]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Fee"
                                name="fee"
                                rules={[{required: true, message: 'Please input the fee!'}]}
                            >
                                <InputNumber addonBefore="$" style={{width: '100%'}}/>
                            </Form.Item>
                        </>
                    ) : (
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{required: true, message: 'Please input the description!'}]}
                        >
                            <Input.TextArea defaultValue={notes}/>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </>
    );
}

const Footer = ({handleShowModal, orders}: {
    handleShowModal: (type: 'addon' | 'notes') => void,
    orders: { rate: number; qty: number }[]
}) => {
    const {setPaid, paid, sendPayment} = useStore();
    const total = useMemo(() => orders.reduce((acc, item) => acc + item.rate * item.qty, 0), [orders]);
    const handlePaid = useCallback((value: number) => {
        setPaid(value);
    }, [setPaid]);
    return (
        <Flex vertical gap={"small"}>
            <Flex justify={"space-between"} gap={"small"} wrap>
                <Typography.Text>
                    Total:
                </Typography.Text>
                <Typography.Text>
                    {total}
                </Typography.Text>
            </Flex>
            <Flex justify={"space-between"} gap={"small"} wrap>
                <Button type="primary" size={"small"} onClick={() => handleShowModal('addon')}
                        icon={<BlockOutlined/>}>Addon</Button>
                <Button type="primary" size={"small"} onClick={() => handleShowModal('notes')}>Notes</Button>
            </Flex>
            <Divider/>
            <Flex vertical>
                <InputNumber placeholder="Paid Amount" addonBefore="$" min={0} style={{width: '100%'}}
                             onChange={(value) => handlePaid(Number(value))}/>
                <Popconfirm
                    title="Confirm Payment"
                    description={`Paid : ${(paid)}, unpaid: ${Math.max(total - paid, 0)}`}
                    onConfirm={sendPayment}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" size={"large"} style={{marginTop: 10}} block>Pay</Button>
                </Popconfirm>
            </Flex>
        </Flex>
    )
}