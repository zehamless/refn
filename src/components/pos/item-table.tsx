'use client'
import {useCallback, useEffect, useMemo, useState} from "react";
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
import {useList, useNotification} from "@refinedev/core";
import {useShallow} from "zustand/react/shallow";
import is from "@sindresorhus/is";
import emptyString = is.emptyString;

const DELIVER_OPTION: DefaultOptionType[] = [
    {value: 'pickup', label: 'Pickup'},
    {value: 'delivery', label: 'Delivery'},
];

const TABLE_SCROLL = {y: 400, x: "max-content"};

export default function ItemTable() {
    const [formType, setFormType] = useState<'addon' | 'notes' | null>(null);
    const [form] = Form.useForm();
    const [personOptions, setPersonOptions] = useState<DefaultOptionType[]>([]);
    const {
        addOrder,
        orders,
        notes,
        addNotes,
        updateQty,
        deleteOrder,
        setEstimatedDate,
        estimatedDate,
        deliverOption,
        setPerson,
        setDeliverOption,
        updateColor
    } = useStore(useShallow((state) => ({
        addOrder: state.addOrder,
        orders: state.orders,
        notes: state.notes,
        addNotes: state.addNotes,
        updateQty: state.updateQty,
        deleteOrder: state.deleteOrder,
        setEstimatedDate: state.setEstimatedDate,
        estimatedDate: state.estimatedDate,
        deliverOption: state.deliverOption,
        setPerson: state.setPerson,
        setDeliverOption: state.setDeliverOption,
        updateColor: state.updateColor
    })));

    const {show, close, modalProps} = useModal();
    const {data, isLoading, isError} = useList({
        resource: 'users',
        pagination: {
            mode: 'off'
        }
    });
    useEffect(() => {
        if (data?.data && data.data.length > 0) {
            console.log("Data fetched", data.data);
            setPersonOptions(data.data.map((item: any) => ({value: item.id, label: (item.name + ' # ' + item.phone)})));
        }
    }, [data?.data]);

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
            render: (value: string, record: Clothes) => <ColorPicker defaultValue={value}
                                                                     onChange={(value) => updateColor(record.id, value.toHexString() ?? '')}
                                                                     disabledAlpha/>
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
    ], [updateQty, deleteOrder, updateColor]);

    const memoizedDatePicker = useMemo(() => (
        <DatePicker style={{flexGrow: 1}} placeholder="Estimation date" onChange={setEstimatedDate}
                    defaultValue={estimatedDate}/>
    ), [estimatedDate, setEstimatedDate]);

    const memoizedDeliverOption = useMemo(() => (
        <Select
            showSearch
            placeholder="Delivery Option"
            optionFilterProp="label"
            options={DELIVER_OPTION}
            defaultValue={deliverOption}
            onChange={setDeliverOption}
        />
    ), [deliverOption, setDeliverOption]);

    const memoizedPersonOption = useMemo(() => (
        <Select
            style={{flexGrow: 1}}
            disabled={isLoading || isError}
            showSearch
            onChange={setPerson}
            placeholder="Select a person"
            optionFilterProp="label"
            options={personOptions}
        />
    ), [isError, isLoading, personOptions, setPerson]);

    return (
        <>
            <Flex gap="small" vertical wrap justify="center">
                <Flex gap={"small"}>
                    {memoizedDatePicker}
                    {memoizedDeliverOption}
                    <Button type="primary" shape="circle" icon={<UserAddOutlined/>}/>
                </Flex>
                <Flex>
                    {memoizedPersonOption}
                </Flex>
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
    const {setPaid, paid, sendPayment, personOption} = useStore(
        useShallow((state) => ({
            setPaid: state.setPaid,
            paid: state.paid,
            sendPayment: state.sendPayment,
            personOption: state.personOption
        }))
    );
    const {open, close} = useNotification()
    const total = useMemo(() => orders.reduce((acc, item) => acc + item.price * item.qty, 0), [orders]);
    const handlePaid = useCallback((value: number) => {
        setPaid(value);
    }, [setPaid]);

    const handleSendPayment = useCallback(async () => {
        try {
            await sendPayment();
            if (open) {
                open({
                    message: "Payment Successful",
                    description: `Paid: ${paid}, unpaid: ${Math.max(total - paid, 0)}`,
                    type: "success",
                });
            }
        } catch (error) {
            if (open) {
                open({
                    message: "Payment Failed",
                    description: (error as Error).message,
                    type: "error",
                });
            }
        }
    }, [open, paid, sendPayment, total]);
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
                    onConfirm={handleSendPayment}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" size={"large"} style={{marginTop: 10}}
                            disabled={total < 1 || emptyString(personOption)}
                            block>Pay</Button>
                </Popconfirm>
            </Flex>
        </Flex>
    )
}