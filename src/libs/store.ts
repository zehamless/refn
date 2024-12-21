import {create} from "zustand";
import {Clothes} from "@libs/definitions";
import {sendOrder} from "@providers/data-provider";
import {BaseRecord} from "@refinedev/core";

interface State {
    clothes: Clothes[];
    orders: Clothes[];
    notes: string;
    paid: number;
    initialClothes: Clothes[];
    deliverOption: string;
    personOption: string | number;
    estimatedDate: string;
}

const initialState: State = {
    clothes: [],
    initialClothes: [],
    orders: [],
    notes: "",
    paid: 0,
    deliverOption: "pickup",
    personOption: "",
    estimatedDate: "",
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
};

export const useStore = create<StateStore>((set, get) => ({
    ...initialState,
    setPaid: (paid) => set({paid}),
    addData: (data) => set({
        initialClothes: (data as Clothes[]).map(item => ({...item, qty: 1})),
        clothes: (data as Clothes[]).map(item => ({...item, qty: 1}))
    }),

    removeData: (id) => set((state) => ({
        clothes: state.clothes.filter((item) => item.id !== id)
    })),

    searchData: (search: string) => set((state) => ({
        clothes: search
            ? state.initialClothes.filter((item: Clothes) =>
                item.name.toLowerCase().includes(search.trim().toLowerCase())
            )
            : state.initialClothes
    })),

    addOrder: (data) => set((state) => {
        const existingOrder = state.orders.find((item) => item.id === data.id);
        return {
            orders: existingOrder
                ? state.orders.map((item) =>
                    item.id === data.id
                        ? {...item, qty: item.qty + 1}
                        : item
                )
                : [...state.orders, data]
        };
    }, false),

    updateQty: (id, qty) => set((state) => ({
        orders: state.orders.map((item) =>
            item.id === id ? {...item, qty} : item
        )
    })),

    deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter((item) => item.id !== id)
    })),

    addNotes: (notes) => set({notes}),

    sendPayment: async () => {
        try {
            const {orders, notes, paid} = get();
            await sendOrder({orders, notes, paid});
            set(initialState);
        } catch (error) {
            console.error('Payment failed:', error);
            throw error;
        }
    },

    resetState: () => set(initialState),
}));