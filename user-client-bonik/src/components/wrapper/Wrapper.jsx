import React from "react"
import "./style.css"

const Wrapper = () => {
  const data = [
    {
      cover: <i className='fa-solid fa-truck-fast'></i>,
      title: "Giao hàng trên toàn thế giới",
      decs: "Chúng tôi cung cấp giá cả cạnh tranh trên 100 triệu sản phẩm cộng với bất kỳ phạm vi nào.",
    },
    {
      cover: <i className='fa-solid fa-id-card'></i>,
      title: "Thanh toán an toàn",
      decs: "Chúng tôi cung cấp giá cả cạnh tranh trên 100 triệu sản phẩm cộng với bất kỳ phạm vi nào.",
    },
    {
      cover: <i className='fa-solid fa-shield'></i>,
      title: "Tự Tin Mua Sắm ",
      decs: "Chúng tôi cung cấp giá cả cạnh tranh trên 100 triệu sản phẩm cộng với bất kỳ phạm vi nào.",
    },
    {
      cover: <i className='fa-solid fa-headset'></i>,
      title: "Hỗ trợ 24/7 ",
      decs: "Chúng tôi cung cấp giá cả cạnh tranh trên 100 triệu sản phẩm cộng với bất kỳ phạm vi nào.",
    },
  ]
  return (
    <>
      <section className='wrapper background'>
        <div className='container grid2'>
          {data.map((val, index) => {
            return (
              <div className='product' key={index}>
                <div className='img icon-circle'>
                  <i>{val.cover}</i>
                </div>
                <h3>{val.title}</h3>
                <p>{val.decs}</p>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default Wrapper
