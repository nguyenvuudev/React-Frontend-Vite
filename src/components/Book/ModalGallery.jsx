import { Col, Image, Modal, Row } from "antd"
import "./book.scss"
import { useEffect, useRef, useState } from "react"
import ImageGallery from "react-image-gallery"

const ModalGallery = (props) => {

    const { openModalViewDetail, setOpenModalViewDetail, currentIndex, title, items } = props

    const [activeIndex, setActiveIndex] = useState(0)

    const refGallery = useRef(null)

    useEffect(() => {
        if (openModalViewDetail) {
            setActiveIndex(currentIndex)
        }
    }, [openModalViewDetail, currentIndex])

    return (
        <>
            <Modal
                width={"60vw"}
                className="modal-gallery"
                open={openModalViewDetail}
                onCancel={() => setOpenModalViewDetail(false)}
                footer={null} // hide footer
                closable={false} // hide close button
            >
                <Row gutter={[20, 20]}>
                    <Col span={16}>
                        <ImageGallery
                            ref={refGallery}
                            items={items}
                            showPlayButton={false} //hide play button
                            showFullscreenButton={false} //hide fullscreen button
                            startIndex={currentIndex} // start at current index
                            showThumbnails={false} //hide thumbnail
                            onSlide={(i) => setActiveIndex(i)}
                            slideDuration={0} //duration between slices
                        />
                    </Col>
                    <Col span={8}>
                        <div>
                            {title}
                        </div>
                        <div>
                            <Row gutter={[20, 20]}>
                                {
                                    items?.map((item, i) => {
                                        return (
                                            <Col key={`image-${i}`}>
                                                <Image
                                                    className="wrap-image"
                                                    width={100}
                                                    height={100}
                                                    src={item.original}
                                                    preview={false}
                                                    onClick={() => {
                                                        refGallery.current.slideToIndex(i)
                                                    }}
                                                />
                                                <div className={activeIndex === i ? "active" : ""}></div>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </>
    )
}

export default ModalGallery