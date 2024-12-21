'use client'
import {useCallback, useMemo, useState} from "react";
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
import {useStore} from "@libs/store";
import {useModal} from "@refinedev/antd";
import {Clothes} from "@libs/definitions";
import {DefaultOptionType} from "antd/lib/select";

const PERSON_OPTIONS: DefaultOptionType[] = [
    {value: 'jack', label: 'Jack'},
    {value: 'lucy', label: 'Lucy'},
    {value: 'tom', label: 'Tom'},
];
const DELIVER_OPTION: DefaultOptionType[] = [
    {value: 'pickup', label: 'Pickup'},
    {value: 'delivery', label: 'Delivery'},
];

const TABLE_SCROLL = {y: 400, x: "max-content"};

export default function ItemTable() {
    const [formType, setFormType] = useState<'addon' | 'notes' | null>(null);
    const [form] = Form.useForm();
    const addOrder = useStore((state) => state.addOrder);
    const orders = useStore((state) => state.orders);
    const notes = useStore((state) => state.notes);
    const addNotes = useStore((state) => state.addNotes);
    const updateQty = useStore((state) => state.updateQty);
    const deleteOrder = useStore((state) => state.deleteOrder);
    const sendPayment = useStore((state) => state.sendPayment);
    const deliverOption = useStore((state) => state.deliverOption);
    const personOption = useStore((state) => state.personOption);

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
                    name: values.title,
                    color: '',
                    price: values.price,
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
        {title: "Clothes", dataIndex: "name"},
        {
            title: "Color",
            dataIndex: "color",
            render: (value: string, record: Clothes) => <ColorPicker defaultValue={value} disabledAlpha/>
        },
        {title: "Rate", dataIndex: "price"},
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
            render: (value: any, record: Clothes) => record.price * record.qty
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

    const memoizedDatePicker = useMemo(() => (
        <DatePicker style={{width: '25%'}} placeholder="Estimation date"/>
    ), []);

    const memoizedDeliverOption = useMemo(() => (
        <Select
            style={{width: '20%'}}
            showSearch
            placeholder="Delivery Option"
            optionFilterProp="label"
            options={DELIVER_OPTION}
            defaultValue={deliverOption}
        />
    ), [deliverOption]);

    const memoizedPersonOption = useMemo(() => (
        <Select
            style={{width: '35%'}}
            showSearch
            placeholder="Select a person"
            optionFilterProp="label"
            options={PERSON_OPTIONS}
            defaultValue={personOption}
        />
    ), [personOption]);

    return (
        <>
            <Flex gap="middle" wrap justify="center">
                {memoizedDatePicker}
                {memoizedDeliverOption}
                {memoizedPersonOption}
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
                                name="price"
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
    orders: { price: number; qty: number }[]
}) => {
    const {setPaid, paid, sendPayment} = useStore();
    const total = useMemo(() => orders.reduce((acc, item) => acc + item.price * item.qty, 0), [orders]);
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
                    <Button type="primary" size={"large"} style={{marginTop: 10}} disabled={total < 1}
                            block>Pay</Button>
                </Popconfirm>
            </Flex>
        </Flex>
    )
}