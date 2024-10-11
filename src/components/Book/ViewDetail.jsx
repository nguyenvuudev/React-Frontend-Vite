import { Col, Divider, Rate, Row } from "antd"
import { useRef, useState } from "react"
import ImageGallery from "react-image-gallery"
import "./book.scss"
import ModalGallery from "./ModalGallery"
import BookLoader from "./BookLoader"

const ViewDetail = () => {

    const [openModalViewDetail, setOpenModalViewDetail] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    const refGallery = useRef(null) // biến tham chiếu dùng để thao tác trực tiếp với components (h) thao tác trực tiếp với functions(hàm)

    const handleOnClickImage = () => {
        setOpenModalViewDetail(true)
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
    }

    const images = [
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image"
        },
    ]

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto' }}>
                {/* <Row gutter={[20, 20]}>
                    <Col md={10} sm={0} xs={0}>
                        <ImageGallery
                            ref={refGallery} // thao tác trực tiếp với functions
                            items={images}
                            showPlayButton={false} //hide play button
                            showFullscreenButton={false} //hide fullscreen button
                            renderLeftNav={() => <></>} //left arrow === <> </>
                            renderRightNav={() => <></>}//right arrow === <> </>
                            slideOnThumbnailOver={true}  //onHover => auto scroll images
                            onClick={() => handleOnClickImage()}
                        />
                    </Col>
                    <Col md={14} sm={24}>
                        <Col md={0} sm={24} xs={24}>
                            <ImageGallery
                                ref={refGallery}
                                items={images}
                                showPlayButton={false} //hide play button
                                showFullscreenButton={false} //hide fullscreen button
                                renderLeftNav={() => <></>} //left arrow === <> </>
                                renderRightNav={() => <></>}//right arrow === <> </>
                                showThumbnails={false}
                            />
                        </Col>
                        <Col span={24} style={{paddingLeft: "30px"}}>
                            <div className="box-info">
                                <div className='author'>Tác giả: <a style={{ fontSize: "13px", lineHeight: "20px" }}>Jo Hemmings</a></div>
                                <div className='title'>How Psychology Works - Hiểu Hết Về Tâm Lý Học</div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: "#ffce3d", fontSize: 14 }} />
                                    <Divider style={{ marginTop: "5px" }} type="vertical" />
                                    <span className='sold'>Đã bán 6969</span>
                                </div>
                            </div>
                            <div className='price'>
                                <span>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(696966666)}
                                </span>
                            </div>
                            <div className='delivery'>           
                                    <span className="text-left">Vận chuyển</span>
                                    <span className="text-right">Miễn phí vận chuyển</span>
                            </div>
                            <div className='quantity'>                               
                                    <span style={{ color: "757575" }}>Số lượng</span>
                                    <span className="input-control-group">
                                        <button className="minus">-</button>
                                        <input className="input" />
                                        <button className="plus">+</button>
                                    </span>
                            </div>
                            <div className="control-button">
                                <button className="add-cart">Thêm vào giỏ hàng</button>
                                <button className="buy-now">Mua ngay</button>
                            </div>
                        </Col>
                    </Col>
                </Row> */}
                <BookLoader />
            </div>
            <ModalGallery
                openModalViewDetail={openModalViewDetail}
                setOpenModalViewDetail={setOpenModalViewDetail}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                items={images}
                title={"hardcode"}
            />
        </div>
    )
}

export default ViewDetail