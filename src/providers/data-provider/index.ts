"use client";

import dataProviderSimpleRest from "@refinedev/simple-rest";
import {DataProvider} from "@refinedev/core";
import axios from "axios";

const API_URL = "https://api.fake-rest.refine.dev";
const MYAPI = "http://refn-be.test:8080/api/v1"
export const dataProvider = dataProviderSimpleRest(MYAPI);
export const customDataProvider: DataProvider = {
    deleteOne: async ({resource, id, variables, meta}) => {
        const {data} = await axios.delete(`${MYAPI}/${resource}/${id}`);
        return {data: data};
    },
    getOne: async ({resource, id, meta}) => {
        const {data} = await axios.get(`${MYAPI}/${resource}/${id}`);
        console.log("getOne:", JSON.stringify(data, null, 2));
        return {data};
    },
    create: async ({resource, variables, meta}) => {
        const {data} = await axios.post(`${MYAPI}/${resource}`, variables);
        return {
            data
        }
    },
    getList: async ({resource, pagination, sorters, filters}) => {
        const {current, pageSize} = pagination || {};
        const sortQuery = sorters?.map(({field, order}) => `${field},${order}`).join(",");
        const filterQuery = filters?.map(({field, operator, value}) => `${field},${operator},${value}`).join(",");

        console.log(filterQuery)
        const {data} = await axios.get(`${MYAPI}/${resource}`, {
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
    }
}

export async function sendOrder(data: any) {
    const response = await axios.post(`${MYAPI}/orders`, data);
    return response.data;
}

export async function getStatDashboard() {
    return await axios.get(`${MYAPI}/dashboard`);
}

export async function getRecentOrders() {
    return await axios.get(`${MYAPI}/dashboard/recent-orders`);
}

export async function getProcessOrders() {
    return await axios.get(`${MYAPI}/dashboard/processing-orders`);
}