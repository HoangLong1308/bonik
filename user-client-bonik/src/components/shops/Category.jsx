import { DownOutlined } from '@ant-design/icons';
import { Button, Tree } from 'antd';
import React, { memo } from 'react';
const Category = ({ treeData, onSelectCategory, selectedKeys }) => {
    return (
        <Tree
            showLine
            switcherIcon={<DownOutlined />}
            selectedKeys={selectedKeys}
            onSelect={onSelectCategory}
            treeData={treeData}
        />
    );
};

export default memo(Category);
