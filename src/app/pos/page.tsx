import {Card, Col, Row} from "antd";
import ItemPick from "@components/pos/item-pick";
import ItemTable from "@components/pos/item-table";

export default function PosList() {
    return (
        <Card>
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    {/*<div>Column 1</div>*/}
                    <ItemPick/>
                </Col>
                <Col xs={24} md={12}>
                    {/*<div>Column 2</div>*/}
                    <ItemTable/>
                </Col>
            </Row>
        </Card>

    );
}