'use client'
import Search from "antd/es/input/Search";
import {Card, Flex} from "antd";
import {useStore} from "@libs/store";

export default function ItemPick() {
    const {addOrder, clothes, searchData} = useStore();

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
                            <Card.Meta title={item.clothes}/>
                        </Card>
                    ))
                }
            </Flex>
        </>
    )
}