import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons"
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin } from "antd"
import { useEffect, useState } from "react"
import { callFetchCategory, callFetchListBook } from "../../services/api"
import "./home.scss"
import { useNavigate } from "react-router-dom"
const Home = () => {

    const [listCategory, setListCategory] = useState([])

    const [listBook, setListBook] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)

    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState("")
    const [sortQuery, setSortQuery] = useState("sort=-sold")

    const [form] = Form.useForm()
    const navigate = useNavigate()

    useEffect(() => {

        // Mapping từ tiếng Anh sang tiếng Việt
        const fieldMapping = {
            Arts: "Nghệ thuật",
            Business: "Kinh doanh",
            Comics: "Truyện tranh",
            Cooking: "Nấu ăn",
            Entertainment: "Giải trí",
            History: "Lịch sử",
            Music: "Âm nhạc",
            Sports: "Thể thao",
            Teen: "Thiếu niên",
            Travel: "Du lịch"
        }

        // Hàm để chuyển đổi các trường từ tiếng Anh sang tiếng Việt
        const convertFieldsToVietnamese = (data) => {
            return data.map(item => ({
                value: item, // trường phù hợp với giá trị của danh mục
                label: fieldMapping[item] || item // chuyển đổi tên hoặc giữ nguyên nếu không có trong mapping
            }))
        }

        const getCategory = async () => {
            const res = await callFetchCategory()
            console.log("getCategory: ", res.data)
            if (res && res.data) {
                const convertedData = convertFieldsToVietnamese(res.data) // Chuyển đổi dữ liệu
                setListCategory(convertedData) // Cập nhật state với dữ liệu đã chuyển đổi
            }
        }

        getCategory()
    }, [])

    useEffect(() => {
        fetchBook()
    }, [current, pageSize, filter, sortQuery])

    const fetchBook = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`
        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }

        const res = await callFetchListBook(query)
        if (res && res.data) {
            setListBook(res.data.result)
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A")
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E")
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I")
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i")
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O")
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U")
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y")
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
        str = str.replace(/Đ/g, "D")
        str = str.replace(/đ/g, "d")
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "") // loại bỏ các dấu thanh (huyền, sắc, hỏi, ngã, nặng)
        str = str.replace(/\u02C6|\u0306|\u031B/g, "") // loại bỏ các dấu phụ liên quan đến các nguyên âm đặc biệt trong tiếng Việt
        return str
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str)
        str = str.replace(/^\s+|\s+$/g, '') // loại bỏ các khoảng trắng đầu cuối
        str = str.toLowerCase()

        // chuẩn hóa chuỗi ký tự
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:"
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------"
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // xóa các ký tự không hợp lệ
            .replace(/\s+/g, '-') // chuyển đổi khoảng trắng thành
            .replace(/-+/g, '-') // dấu gạch ngang

        return str
    }

    const handleRedirectBook = (book) => {
        const slug = convertSlug(book.mainText)
        navigate(`/book/${slug}?id=${book._id}`)
    }


    const handleOnchangePage = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }

    }

    const handleChangeFilter = (changedValues, values) => {
        console.log(">>> check handleChangeFilter", changedValues, values)

        // chỉ kích hoạt khi mà category thay đổi
        if (changedValues.category) {
            const cate = values.category
            if (cate && cate.length > 0) {
                const merge = cate.join(',')
                setFilter(`category=${merge}`)
            } else {
                setFilter('')
            }
        }
    }

    const onFinish = (values) => {
        // console.log('>> check values: ', values)

        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`
            if (values?.category?.length) {
                const cate = values?.category?.join(',')
                f += `&category=${cate}`
            }
            setFilter(f)
        }
    }

    const items = [
        {
            key: "sort=-sold",
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: "sort=-updatedAt",
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: "sort=price",
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: "sort=-price",
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ]

    return (
        <div style={{ background: "#efefef", padding: "20px 0" }}>
            <div className="homepage-container">
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0}>
                        <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span> <FilterTwoTone />
                                    <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
                                </span>
                                <ReloadOutlined title="Reset" onClick={() => {
                                    form.resetFields()
                                    setFilter('')
                                }} />
                            </div>
                            <Divider />
                            <Form
                                onFinish={onFinish}
                                form={form}
                                onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                            >
                                <Form.Item
                                    name="category"
                                    label="Danh mục sản phẩm"
                                    labelCol={{ span: 24 }}
                                >
                                    <Checkbox.Group>
                                        <Row>
                                            {listCategory?.map((item, index) => {
                                                return (
                                                    <Col span={24} key={`index-${index}`} style={{ padding: '7px 0' }}>
                                                        <Checkbox value={item.value} >
                                                            {item.label}
                                                        </Checkbox>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Divider />
                                <Form.Item
                                    label="Khoảng giá"
                                    labelCol={{ span: 24 }}
                                >
                                    <Row gutter={[10, 10]} style={{ width: "100%" }}>
                                        <Col xl={11} md={24}>
                                            <Form.Item name={["range", "from"]}>
                                                <InputNumber
                                                    name="from"
                                                    min={0}
                                                    placeholder="đ TỪ"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={2} md={0}>
                                            <div > - </div>
                                        </Col>
                                        <Col xl={11} md={24}>
                                            <Form.Item name={["range", "to"]}>
                                                <InputNumber
                                                    name="to"
                                                    min={0}
                                                    placeholder="đ ĐẾN"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Button
                                            onClick={() => form.submit()}
                                            style={{ width: "100%" }} type="primary"
                                        >
                                            Áp dụng
                                        </Button>
                                    </div>
                                </Form.Item>
                                <Divider />
                                <Form.Item
                                    label="Đánh giá"
                                    labelCol={{ span: 24 }}
                                >
                                    <div>
                                        <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 15 }} />
                                        <span className="antd-rate-navbar"></span>
                                    </div>
                                    <div>
                                        <Rate value={4} disabled style={{ color: "#ffce3d", fontSize: 15 }} />
                                        <span className="antd-rate-navbar">trở lên</span>
                                    </div>
                                    <div>
                                        <Rate value={3} disabled style={{ color: "#ffce3d", fontSize: 15 }} />
                                        <span className="antd-rate-navbar">trở lên</span>
                                    </div>
                                    <div>
                                        <Rate value={2} disabled style={{ color: "#ffce3d", fontSize: 15 }} />
                                        <span className="antd-rate-navbar">trở lên</span>
                                    </div>
                                    <div>
                                        <Rate value={1} disabled style={{ color: "#ffce3d", fontSize: 15 }} />
                                        <span className="antd-rate-navbar">trở lên</span>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>

                    <Col md={20} xs={24} >
                        <Spin spinning={isLoading} tip="Loading...">
                            <div style={{ padding: "20px", background: "#fff", borderRadius: 5 }}>
                                <Row >
                                    <Tabs
                                        defaultActiveKey="sort=-sold"
                                        items={items}
                                        onChange={(value) => { setSortQuery(value) }}
                                        style={{ overflowX: "auto" }}
                                    />
                                </Row>
                                <Row className="wrapper-all-card-content">
                                    {listBook?.map((item, index) => {
                                        return (
                                            <div className="wrap-card-content" key={`book-${index}`} onClick={() => handleRedirectBook(item)}>
                                                <div className="customize-card-content">
                                                    <div className="thumbnail">
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="thumbnail book" />
                                                    </div>
                                                    <div className="text" title={item.mainText}>{item.mainText}</div>
                                                    <div className="price">
                                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item?.price ?? 0)}
                                                    </div>
                                                    <div className="rating">
                                                        <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 10 }} />
                                                        <span style={{ marginLeft: "10px" }}>Đã bán {item.sold}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}


                                </Row>
                                <div style={{ marginTop: 30 }}></div>
                                <Row style={{ display: "flex", justifyContent: "center" }}>
                                    <Pagination
                                        current={current}
                                        total={total}
                                        pageSize={pageSize}
                                        responsive
                                        onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
                                    />
                                </Row>
                            </div>
                        </Spin>
                    </Col>

                </Row>
            </div>
        </div>
    )
}

export default Home