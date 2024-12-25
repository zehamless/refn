export enum OrderTagColor {
    unpaid = "yellow",
    processing = "geekblue",
    completed = "green",
    cancelled = "red",
}

export const OrderTagDescription = {
    unpaid: "Not Paid",
    processing: "Processing",
    completed: "Completed",
    cancelled: "Cancelled",
} as const;