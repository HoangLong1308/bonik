import {
    React,
    memo,
    useDispatch,
    useEffect,
    useSelector,
    useState,
    useCallback,
} from 'react';
import { Card, Col, Row, Button } from 'antd';
import { Link } from 'react-router-dom';
import { getImage } from '../../../common/img';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const FavoriteProductCard = ({
    value,
    wishlistItemDetail,
    handleFavoriteClick,
}) => {
    console.log('object');
    const navigate = useNavigate();
    const [isRemoved, setIsRemoved] = useState(false);

    useEffect(() => {
        console.log('isREmove: ', wishlistItemDetail(value).isRemoved);
        setIsRemoved(wishlistItemDetail(value).isRemoved);
    }, []);
    console.log('value: ', value);
    //    console.log('isRemove: ',wishlistItemDetail(value).isRemoved);

    const favoriteClickHandler = () => {
        console.log('set  to true');
        // set to true not reset;
        setIsRemoved((prev) => {
            return true;
        });
        handleFavoriteClick(wishlistItemDetail(value));
    };

    return (
        <Card
            className="wishlist-card"
            hoverable
            style={{}}
            cover={
                <img
                    className="wishlist-card-image"
                    height="100px"
                    alt="example"
                    src={getImage(wishlistItemDetail(value).image)}
                />
            }
        >
            <div className="wishlist-card-body-info">
                <div className="cat-info">{wishlistItemDetail(value).cate}</div>
                <div className="product-name">
                    {wishlistItemDetail(value).name}
                </div>
                <div>
                    <Button
                        style={{
                            // backgroundColor: 'orangered',
                            color: 'white',
                        }}
                        onClick={() => {
                            navigate(
                                `/product-detail/${
                                    wishlistItemDetail(value).id
                                }`,
                            );
                        }}
                    >
                        Xem chi tiết
                    </Button>
                </div>
            </div>
            <Button
                className="wishlist-card-body-btn"
                icon={
                    !isRemoved ? (
                        <HeartFilled style={{ color: 'red' }} />
                    ) : (
                        <HeartOutlined />
                    )
                }
                onClick={() => {
                    favoriteClickHandler();
                }}
            ></Button>
        </Card>
    );
};
export default memo(FavoriteProductCard);
