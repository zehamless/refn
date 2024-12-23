import {create} from "zustand";
import {Clothes} from "@libs/definitions";
import {sendOrder} from "@providers/data-provider";
import {BaseRecord} from "@refinedev/core";
import dayjs from 'dayjs';

interface State {
    clothes: Clothes[];
    orders: Clothes[];
    notes: string;
    paid: number;
    initialClothes: Clothes[];
    deliverOption: string;
    personOption: number | null;
    estimatedDate: dayjs.Dayjs;
}

const initialState: State = {
    clothes: [],
    initialClothes: [],
    orders: [],
    notes: "",
    paid: 0,
    deliverOption: "pickup",
    personOption: null,
    estimatedDate: dayjs(),
};

type StateStore = State & {
    addData: (data: BaseRecord[] | undefined) => void;
    removeData: (id: number) => void;
    searchData: (search: string) => void;
    addOrder: (data: Clothes) => void;
    addNotes: (notes: string) => void;
    updateQty: (id: number | string, qty: number) => void;
    deleteOrder: (id: number | string) => void;
    sendPayment: () => Promise<void>;
    setPaid: (paid: number) => void;
    resetState: () => void;
    setPerson: (personOption: number) => void;
    setEstimatedDate: (estimatedDate: dayjs.Dayjs) => void;
    setDeliverOption: (deliverOption: string) => void;
    updateColor: (id: number | string, color: string) => void;
};
export const useStore = create<StateStore>((set, get) => ({
    ...initialState,
    setPaid: (paid) => set({paid}),
    addData: (data) => set({
        initialClothes: (data as Clothes[]).map(item => ({...item, qty: 1})),
        clothes: (data as Clothes[]).map(item => ({
            ...item,
            qty: 1,
            color: '#1677ff'
        }))
    }),
    setDeliverOption: (deliverOption) => set({deliverOption}),
    removeData: (id) => set((state) => ({
        clothes: state.clothes.filter((item) => item.id !== id)
    })),
    searchData: (search: string) => set((state) => ({
        clothes: search
            ? state.initialClothes.filter((item) =>
                item.name.toLowerCase().includes(search.trim().toLowerCase())
            )
            : state.initialClothes
    })),
    setPerson: (personOption) => set({personOption}),
    addOrder: (data) => set((state) => {
        const existingOrder = state.orders.find((item) => item.id === data.id);
        if (existingOrder) {
            return {
                orders: state.orders.map((item) =>
                    item.id === data.id ? {...item, qty: item.qty + 1} : item
                )
            };
        }
        return {
            orders: [...state.orders, {
                id: data.id,
                name: data.name,
                color: data.color,
                price: data.price,
                qty: data.qty
            }]
        };
    }),
    updateQty: (id, qty) => set((state) => ({
        orders: state.orders.map((item) =>
            item.id === id ? {...item, qty} : item
        )
    })),
    updateColor: (id, color) => set((state) => ({
        orders: state.orders.map((item) =>
            item.id === id ? {...item, color} : item
        )
    })),
    deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter((item) => item.id !== id)
    })),
    addNotes: (notes) => set({notes}),
    sendPayment: async () => {
        try {
            const {orders, notes, paid, personOption, deliverOption, estimatedDate} = get();
            const formattedEstimatedDate = estimatedDate.toISOString();
            console.log({orders, notes, paid, personOption, deliverOption, estimatedDate: formattedEstimatedDate});
            await sendOrder({
                orders,
                notes,
                paid,
                customer_id: personOption,
                delivery_option: deliverOption,
                estimated_date: formattedEstimatedDate
            });

            get().resetState(); // Call resetState here
        } catch (error) {
            console.error('Payment failed:', error);
            throw error;
        }
    },
    setEstimatedDate: (estimatedDate) => set({estimatedDate}),
    resetState: () => set((state) => ({
        ...state,
        orders: [],
        personOption: null,
        paid: 0,
        notes: ""
    })),
}));