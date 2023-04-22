import React, { useEffect, useState, memo } from 'react';
import { Select, Row, Col, Space, Form, Input } from 'antd';
import { getProvince, getSearchProvince, getDistrict, getSearchDistrict, getSearchWard } from '../../services/addressService';
const AddressForm = ({ form, otherAddress }) => {
    // const inputProvince = Form.useWatch('input_province', form);
    const optionForDropDown = [];
    console.log('to: ', otherAddress);
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [wardOptions, setWardOptions] = useState([]);

    const [inputSearch, setInputSearch] = useState('');
    // const [codeSearch, setCodeSearch] = useState(0);
    const [inputDistrictSearch, setInputDistrictSearch] = useState('');
    const [inputWardSearch, setInputWardSearch] = useState('');
    // const address = "hồ chí minh";
    const address = 'Ja';
    useEffect(() => {
        getProvince().then((data) => {
            const options = data.map((e) => {
                return { value: e.name, label: e.name, code: e.code };
            });
            // console.log(options);
            setProvinceOptions(options);
            return options;
            // return optionForDropDown ;
        });
        return () => {
            console.log('clear');
            setInputSearch((prev) => '');
            setProvinceOptions(() => []);
            // setInputWardSearch((prev) => '');
            // setDistrictOptions((prev) => []);
            // setWardOptions((prev) => []);
            // onDistChange('');
            form.setFieldsValue({ input_province: undefined });
            // form.setFieldsValue({ input_ward: undefined });
        };
    }, []);

    useEffect(() => {
        console.log('find code');
        // find code;
        let selectedP = provinceOptions.filter((p) => p.label === inputSearch);
        // console.log('selectedP: ');
        // console.log(selectedP);
        if (selectedP !== undefined && selectedP.length > 0) {
            let code = selectedP[0].code;
            getSearchDistrict(code)
                .then((data) => {
                    console.log('call search Prov: ');

                    // console.log(data);
                    let { districts } = data;
                    const options = districts.map((e) => {
                        return {
                            value: e.name,
                            label: e.name,
                            code: e.code,
                        };
                    });
                    console.log(options);
                    setDistrictOptions((prev) => options);
                    return options;
                    // return optionForDropDown ;
                })
                .catch((e) => {
                    console.log(e.message);
                });
        }
        return () => {
            console.log('clear');
            setInputDistrictSearch((prev) => '');
            setInputWardSearch((prev) => '');
            setDistrictOptions((prev) => []);
            setWardOptions((prev) => []);
            onDistChange('');
            form.setFieldsValue({ input_district: undefined });
            form.setFieldsValue({ input_ward: undefined });
        };
    }, [inputSearch]);

    useEffect(() => {
        // find district code
        let selectedDis = districtOptions.filter((p) => p.label === inputDistrictSearch);
        // console.log('selectedP: ');
        // console.log(selectedDis);
        if (selectedDis !== undefined && selectedDis.length > 0) {
            let code = selectedDis[0].code;
            getSearchWard(code)
                .then((data) => {
                    console.log('call search Dis: ');

                    console.log(data);
                    let { wards } = data;
                    const options = wards.map((e) => {
                        return {
                            value: e.name,
                            label: e.name,
                            code: e.code,
                        };
                    });
                    console.log(options);
                    setWardOptions((prev) => options);
                    return options;
                    // return optionForDropDown ;
                })
                .catch((e) => {
                    console.log(e.message);
                });
        }

        return () => {
            console.log('clear');
            setInputWardSearch((prev) => '');
            setWardOptions((prev) => []);
            onDistChange('');
            form.setFieldsValue({ input_ward: undefined });
        };
    }, [inputDistrictSearch]);

    const onChange = (value) => {
        console.log(`selected ${value}`);
        setInputSearch((prev) => {
            return value;
        });
    };

    const onSearch = (value) => {
        console.log('search:', value);
        // setInputSearch(prev => {return value})
    };

    const onDistSearch = (value) => {
        console.log('dis search ', value);
    };

    const onDistChange = (value) => {
        setInputDistrictSearch((prev) => {
            return value;
        });
    };
    const onWardChange = (value) => {
        setInputWardSearch((prev) => {
            return value;
        });
    };

    const onWardSearch = (value) => {};

    const getSelectedProvinceName = () => {
        // console.log('input search: ', inputSearch);
        let selectedP = provinceOptions.filter((p) => p.value === inputSearch);
        if (selectedP === undefined) return '';
        console.log('index: ' + selectedP);
        return selectedP.province_name;
    };
    const setSelectedValueHandler = () => {
        let input = address;
        const filter = provinceOptions.filter((select) => (select.label ?? '').toLowerCase().includes(input.toLowerCase()));
        console.log(filter[0]);
        setInputSearch(filter.length > 0 ? filter[0].value : '');
    };

    return (
        <React.Fragment>
            <Form className="other-address-f" layout="vertical" name="basic" form={form}>
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        {provinceOptions !== undefined && provinceOptions.length > 0 && getSelectedProvinceName()}
                        <Form.Item
                            name="input_province"
                            label="Tỉnh thành"
                            rules={[
                                {
                                    required: otherAddress,
                                    message: 'Vui lòng nhập tỉnh thành',
                                },
                            ]}
                        >
                            <Select
                                allowClear={true}
                                value={inputSearch}
                                showSearch
                                placeholder="Chọn tỉnh thành"
                                optionFilterProp="children"
                                onChange={onChange}
                                onSearch={onSearch}
                                // defaultValue={1}
                                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                options={provinceOptions}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="input_district"
                            label="Quận/Huyện"
                            rules={[
                                {
                                    required: otherAddress,
                                    message: 'Vui lòng nhập quận/huyện',
                                },
                            ]}
                        >
                            <Select
                                allowClear={true}
                                value={inputDistrictSearch}
                                showSearch
                                placeholder="Chọn Quận/Huyện"
                                optionFilterProp="children"
                                onChange={onDistChange}
                                onSearch={onDistSearch}
                                // defaultValue={1}
                                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                options={districtOptions}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="input_ward"
                            label="Phường/Xã"
                            rules={[
                                {
                                    required: otherAddress,
                                    message: 'Vui lòng nhập phường/xã',
                                },
                            ]}
                        >
                            <Select
                                allowClear={true}
                                value={inputWardSearch}
                                showSearch
                                optionFilterProp="children"
                                placeholder="Chọn Quận/Huyện"
                                onChange={onWardChange}
                                onSearch={onWardSearch}
                                // defaultValue={1}
                                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                options={wardOptions}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    name="input_addressline"
                    label="Địa chỉ"
                    rules={[
                        {
                            required: otherAddress,
                            message: 'Vui lòng nhập địa chỉ',
                        },
                    ]}
                >
                    <Input
                        autoComplete="off"
                        placeholder="Địa chỉ"
                        style={{
                            width: '100%',
                            marginBottom: '0.5rem',
                        }}
                        value={''}
                    />
                </Form.Item>
            </Form>
        </React.Fragment>
    );
};

export default memo(AddressForm);
