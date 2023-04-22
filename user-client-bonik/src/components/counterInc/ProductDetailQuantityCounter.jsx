import { useState, Fragment, useEffect,memo } from 'react';
import './style.css';
import { QTY_MAX, QTY_MIN } from '../../common/Cart/Cart';
function ProductDetailQuantityCounter({
    cartQty,
    cartQtyOnChangeHandler,
    inventory,
    fetchInventory
    // setCartbuttonDisabled,
}) {
    console.log(inventory);
    const {max_quantity : MAXQTY, current_inventory: CUR_INVENTORY,  outOfStock: OUTOFSTOCK } = inventory;
    // let [num, setNum] = useState(1);
    let incNum = () => {
        if (cartQty < MAXQTY) {
            // console.log('pass value:', Number(cartQty) + 1);
            cartQtyOnChangeHandler(Number(cartQty) + 1);

            // setNum(Number(cartQty) + 1);
        }
        handleChange();
    };
    const checkInventory = () => {
        
    }
    let decNum = () => {
        if (cartQty > QTY_MIN) {
            cartQtyOnChangeHandler(Number(cartQty) - 1);
        }
        handleChange();
    };
    useEffect(() => {
        handleChange();
    }, [cartQty]);

    const handleChange = () => {
        console.log('handle', cartQty);
    };
    return (
        <div className="counter-section">
            {MAXQTY !== undefined && MAXQTY <= 5 && CUR_INVENTORY <= 5 && !OUTOFSTOCK && (
                <h5 className="max-qty-noti">
                    <i class="fa-solid fa-bell"></i>
                    {'  '}Chỉ còn: {MAXQTY} sản phẩm
                </h5>
            )}
            {OUTOFSTOCK && <h5 className="max-qty-noti outstock">{'  '} Hết hàng</h5>}

            {!OUTOFSTOCK && (  <div className="counter-wrapper">
                <div class="counter-title">Chọn số lượng: </div>
                <div class="counter-input-wrapper">
                    <div class="qty-input">
                        <button class="qty-count qty-count--minus" data-action="minus" type="button" onClick={decNum} disabled={cartQty <= QTY_MIN}>
                            -
                        </button>
                        <input class="product-qty" type="number" name="product-qty" value={cartQty} onChange={handleChange} />
                        <button class="qty-count qty-count--add" data-action="add" type="button" onClick={incNum} disabled={cartQty >= MAXQTY}>
                            +
                        </button>
                    </div>
                </div>
            </div>) }
          
        </div>
    );
    // <Fragment>
    {
        /* <div className="counter-wrapper">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <button
                            class="btn btn-outline-primary"
                            type="button"
                            onClick={decNum}
                        >
                            -
                        </button>
                    </div>
                    <input
                        type="text"
                        class="form-control"
                        value={num}
                        onChange={handleChange}
                    />
                    <div class="input-group-prepend">
                        <button
                            class="btn btn-outline-primary"
                            type="button"
                            onClick={incNum}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div> */
    }

    {
        /* </Fragment> */
    }
}

export default memo(ProductDetailQuantityCounter);
