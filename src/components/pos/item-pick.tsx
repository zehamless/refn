'use client'
import {useEffect} from "react";
import {useStore} from "@libs/store";
import {useList} from "@refinedev/core";
import {Card, Flex} from "antd";
import Search from "antd/es/input/Search";

export default function ItemPick() {
    const {addOrder, clothes, searchData, addData} = useStore();
    const {data, isLoading, isError} = useList({
        resource: 'services',
        pagination: {
            mode: 'off'
        }
    });

    useEffect(() => {
        if (data) {
            addData(data.data);
        }
    }, [data, addData]);

    if (isLoading) {
        console.log("Data is still loading");
    } else if (isError) {
        console.log("Error loading data");
    }

    return (
        <>
            <Search
                placeholder="input search text"
                allowClear
                onChange={(e) => searchData(e.target.value)}
            />
            <Flex gap={"small"} wrap justify={"space-around"}
                  style={{marginTop: 10, height: '500px', overflowY: 'auto'}}>
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
    )
}