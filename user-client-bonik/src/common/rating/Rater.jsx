import { Rate } from 'antd';
import React, { memo } from 'react';
const desc = ['Tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Tuyệt vời'];

const Rater = ({ handleChange, value }) => {
    return (
        <span>
            <Rate tooltips={desc} onChange={handleChange} value={value} />
            {value ? (
                <span className="ant-rate-text">{desc[value - 1]}</span>
            ) : (
                ''
            )}
        </span>
    );
};

export default memo(Rater);
