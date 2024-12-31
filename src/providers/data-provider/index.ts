"use client";

import {DataProvider} from "@refinedev/core";
import axios from "@libs/axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// console.log("API_URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

export const customDataProvider: DataProvider = {
    deleteOne: async ({resource, id, variables, meta}) => {
        const {data} = await axios.delete(`${API_URL}/${resource}/${id}`);
        return {data: data};
    },
    getOne: async ({resource, id, meta}) => {
        const {data} = await axios.get(`${API_URL}/${resource}/${id}`);
        console.log("getOne:", JSON.stringify(data, null, 2));
        return {data};
    },
    create: async ({resource, variables, meta}) => {
        const {data} = await axios.post(`${API_URL}/${resource}`, variables);
        return {data};
    },
    update: async ({resource, id, variables, meta}) => {
        const {data} = await axios.patch(`${API_URL}/${resource}/${id}`, variables);
        return {data};
    },
    getList: async ({resource, pagination, sorters, filters}) => {
        const {current, pageSize} = pagination || {};
        const sortQuery = sorters?.map(({field, order}) => `${field},${order}`).join(",");
        const filterQuery = filters?.map(({key, operator, value}) => `${key},${operator},${value}`).join(",");

        console.log(filterQuery);
        const {data} = await axios.get(`${API_URL}/${resource}`, {
            params: {
                page: current,
                perPage: pageSize,
                sort: sortQuery,
                filter: filterQuery,
            },
        });

        return {
            data: data.data,
            total: data.meta?.total ?? data.data.length,
        };
    },
};

export async function sendOrder(data: any) {
    const response = await axios.post(`${API_URL}/orders`, data);
    return response.data;
}

export async function getStatDashboard() {
    return await axios.get(`${API_URL}/dashboard`);
}

export async function getRecentOrders() {
    return await axios.get(`${API_URL}/dashboard/recent-orders`);
}

export async function getProcessOrders() {
    return await axios.get(`${API_URL}/dashboard/processing-orders`);
}