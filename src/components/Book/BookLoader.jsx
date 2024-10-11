import { Col, Row, Skeleton } from "antd"

const BookLoader = () => {
    return (
        <>
            <Row gutter={[20, 20]}>
                <Col md={10} sm={0} xs={0}>
                    <Skeleton.Image
                        active={true}
                        block={true}
                        style={{ width: 588, height: 350 }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                        <Skeleton.Image active={true} block={true} style={{ width: 124, height: 96 }} />
                        <Skeleton.Image active={true} block={true} style={{ width: 124, height: 96 }} />
                        <Skeleton.Image active={true} block={true} style={{ width: 124, height: 96 }} />
                        <Skeleton.Image active={true} block={true} style={{ width: 124, height: 96 }} />
                    </div>
                </Col>
                <Col md={14} sm={24} style={{paddingLeft: 30}}>
                    <Skeleton
                        paragraph={{ rows: 4 }}
                        active={true}
                    />
                    <br /><br />
                    <Skeleton
                        paragraph={{ rows: 2 }}
                        active={true}
                    />
                    <br /><br />
                    <div style={{display: "flex", gap: 20}}>
                        <Skeleton.Button
                            active={true}
                            style={{ width: 150, height: 40 }}
                        />
                        <Skeleton.Button
                            active={true}
                            style={{ width: 150, height: 40 }}
                        />
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default BookLoader