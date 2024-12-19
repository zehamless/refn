export enum OrderTagColor {
    not_paid = "yellow",
    processing = "geekblue",
    completed = "green",
    cancelled = "red",
}

export const OrderTagDescription = {
    not_paid: "Not Paid",
    processing: "Processing",
    completed: "Completed",
    cancelled: "Cancelled",
} as const;