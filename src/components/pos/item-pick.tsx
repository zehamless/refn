'use client';
import {useEffect} from "react";
import {useStore} from "@libs/store";
import {useList} from "@refinedev/core";
import {Card, Flex} from "antd";
import Search from "antd/es/input/Search";
import {useShallow} from "zustand/react/shallow";

export default function ItemPick() {
    const {
        clothes,
        searchData,
        addData,
        addOrder
    } = useStore(useShallow((state) => ({
        clothes: state.clothes,
        searchData: state.searchData,
        addData: state.addData,
        addOrder: state.addOrder
    })))

    const {data, isLoading, isError} = useList({
        resource: 'services',
        pagination: {
            mode: 'off'
        }
    });

    useEffect(() => {
        if (data?.data && data.data.length > 0) {
            addData(data.data); // Populate the store with the fetched data
        }
    }, [data?.data, addData]);

    if (isLoading) {
        console.log("Data is still loading");
        return <p>Loading...</p>;
    }

    if (isError) {
        console.log("Error loading data");
        return <p>Error loading data</p>;
    }

    return (
        <>
            <Search
                placeholder="Input search text"
                allowClear
                onChange={(e) => searchData(e.target.value)}
            />
            <Flex gap={"small"} wrap justify={"space-around"}
                  style={{marginTop: 10, height: '550px', overflowY: 'auto'}}>
                {
                    clothes.map((item) => (
                        <Card
                            key={item.id}
                            style={{width: 120}}
                            styles={{body: {padding: 4, textAlign: "center"}}}
                            onClick={() => addOrder(item)}
                            hoverable
                            cover={
                                <div dangerouslySetInnerHTML={{__html: item.icon ?? ''}}/>
                            }
                        >
                            <Card.Meta title={item.name}/>
                        </Card>
                    ))
                }
            </Flex>
        </>
    );
}
