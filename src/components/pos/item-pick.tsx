'use client'
import Search from "antd/es/input/Search";
import {Card, Flex} from "antd";

export default function ItemPick() {
    return (
        <>
            <Search
                placeholder="input search text"
                allowClear
                onSearch={() => {
                }}
            />
            <Flex gap={"small"} wrap justify={"space-around"} style={{marginTop: 10}}>
                {
                    Array.from({length: 10}).map((_, index) => (
                        <Card
                            key={index}
                            style={{width: 120}}
                            styles={{body: {padding: 4, textAlign: "center"}}}
                            hoverable
                            cover={
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.5 47.5" id="shirt">
                                    <defs>
                                        <clipPath id="a">
                                            <path d="M0 38h38V0H0v38Z"></path>
                                        </clipPath>
                                    </defs>
                                    <g clipPath="url(#a)" transform="matrix(1.25 0 0 -1.25 0 47.5)">
                                        <path fill="#88c9f9"
                                              d="M37 5a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v28a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V5Z"></path>
                                        <path fill="#dd2e44"
                                              d="M20.34 1.545a1.922 1.922 0 0 0-2.681 0l-6.633 6.529c-.737.726-.932 2.033-.434 2.904l7.5 18.447c.499.871 1.315.871 1.814 0l7.5-18.447c.498-.871.303-2.178-.434-2.904L20.34 1.545Z"></path>
                                        <path fill="#a0041e"
                                              d="M19 22.332c.949 0 2.004.952 2.899 2.191l-1.992 4.902c-.499.871-1.315.871-1.814 0L16.1 24.523c.897-1.239 1.951-2.191 2.9-2.191"></path>
                                        <path fill="#dd2e44"
                                              d="M24 31.222c0-1.964-2.791-7.112-5-7.112s-5 5.148-5 7.112C14 33.005 16.791 34 19 34s5-.995 5-2.778"></path>
                                        <path fill="#4ca0d3"
                                              d="M1 33v-2.254c2.074-2.77 6.779-7.751 8-7.751 2.209 0 11 10.796 11 13.005 0 1-1 1-2 1H5a4 4 0 0 1-4-4"></path>
                                        <path fill="#4ca0d3"
                                              d="M18 36c0-2.209 8.791-13.005 11-13.005 1.221 0 5.926 4.981 8 7.751V33a4 4 0 0 1-4 4H20c-1 0-2 0-2-1"></path>
                                        <path fill="#269"
                                              d="M5 37c-.267 0-.526-.029-.778-.079C5.405 35.264 11.562 34 19 34c7.437 0 13.595 1.264 14.778 2.921-.252.05-.511.079-.778.079H5Z"></path>
                                    </g>
                                </svg>

                            }
                        >
                            <Card.Meta title="Card title"/>
                        </Card>
                    ))
                }
            </Flex>
        </>
    )
}