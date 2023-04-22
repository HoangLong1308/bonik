import { PlusOutlined } from '@ant-design/icons';
import React, { useState, memo, useEffect, useCallback, useMemo } from 'react';
import { Button, Modal, Input, Form, Select, Radio, notification, Spin } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import  { getProvince, getSearchProvince, getDistrict, getSearchDistrict, getSearchWard } from '../../../services/addressService';
import axios from '../../../services/axios';
import { ENV_URL } from '../../../constants/index';
import { USER_INFOS, USER_ADDRESS_LIST, USER_ADDRESS_DEFAULT,CRUD_USER_ADDRESS } from '../../../constants/user';
import { OpenInNewOffRounded } from '@mui/icons-material';
import { clear } from '@testing-library/user-event/dist/clear';
const fetchUserAddress = async () => {
    return axios.get(`${ENV_URL}${USER_ADDRESS_LIST}`);
};
const fetchUserInfo = async () => {
    return axios.get(`${ENV_URL}${USER_INFOS}`).catch((error) => console.log(error));
};

function Address() {
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, message, description = '',placements = 'top',duration ='2') => {
        api[type]({
            message: message,
            placement: placements,
            description: description,
            duration: duration
        });
    };
    // console.log('----------------------');
    // console.log('load addressList');
    const [open, setOpen] = useState(false);
    const [newOpen, setNewOpen] = useState(false);
    const [addressList, setAddressList] = useState([]);
    const [infoUser, setInfoUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(-1);
    const [addressForm] = Form.useForm();
    const [newAddressForm] = Form.useForm();
    const { confirm } = Modal;

    const province = Form.useWatch('provinces', addressForm);
    const district = Form.useWatch('district', addressForm);
    const ward = Form.useWatch('ward', addressForm);
    const address_line = Form.useWatch('address_line', addressForm);
    const is_default = Form.useWatch('is_default', addressForm);

    const new_address_line = Form.useWatch('address_line', newAddressForm);
    const new_province = Form.useWatch('provinces',  newAddressForm);
    const new_district = Form.useWatch('district',  newAddressForm);
    const new_ward = Form.useWatch('ward',  newAddressForm);

    useEffect(() => {
        setLoading(true);
        getUserAddress().catch(console.error);
        getUserInfo().catch(console.error);

        setLoading(false);
        // return () => setLoading(false);
    }, []);

    useEffect(() => {
        console.log('MY ADDRESS: ', addressList);
    }, [addressList]);

    const getUserAddress = useCallback(async () => {
        // const list = await (await fetchUserAddress()).data;
        fetchUserAddress().then(res => {
            console.log(res.data)
            setAddressList((prev) => res.data);
        }).catch(e => {
            setAddressList((prev) => []);
        })
       
    });
    const getUserInfo = useCallback(async () => {
        const userInfo = await (await fetchUserInfo()).data;
        setInfoUser((prev) => userInfo);
    });

    // const showModal = ({ target }) => {
    //     let { parentElement } = target;
    //     let index = parentElement.getAttribute('data-address-value');
    //     console.log(index);
    //     setSelectedAddress((prev) => index);

    //     setOpen(true);
    // };
    // const handleOk = () => {
    //     setOpen(false);
    // };

    const showModal = ({ currentTarget }) => {
        setLoading(true);
        // console.log('currentTarget: ', currentTarget);
        let index = currentTarget.getAttribute('data-address-value');
        // console.log('index: ', index);
        setSelectedAddress((prev) => index);
        setLoading(false);
        setOpen(true);
    };
   
    const handleOk = () => {
        addressForm
            .validateFields()
            .then((res) => {
                let idAddress = addressList[selectedAddress].id;
                let postal = addressList[selectedAddress].postal_id;
                const addressRequest = (idAddress, wards, district, address_line, province, postal_id, is_default) => {
                    return {
                        id: idAddress,
                        wards: wards,
                        district: district,
                        address_line: address_line,
                        province: province,
                        postal_id: postal_id,
                        is_default: is_default,
                    };
                };
                sendRequest(addressRequest(idAddress, ward, district, address_line, province, postal, is_default));
                // setOpen(false);
            })
            .catch((e) => console.log(e));
    };

    const sendRequest = (request) => {
        // setTimeout(() => {
        axios.put(`${ENV_URL}${CRUD_USER_ADDRESS}`,request)
                .then(res => {
                    openNotificationWithIcon('success', 'Cập nhật thành công');
                    getUserAddress().catch(console.error);
                })
                .catch(e => {
                   
                    let {response} = e;
                    console.log(response);
                    if(response.status === 400) {
                      console.log("bad re")
                        openNotificationWithIcon('error', 'Cập nhật thất bại',response.data,'top',4);
                    }else {
                        openNotificationWithIcon('error','Có lỗi xảy ra')
                    }
                 
                })    
       
      };
    const handleCancel = () => {
        // console.log('canceled ----');
        setOpen(false);
        setSelectedAddress((prev) => -1);
        addressForm.resetFields();
    };
    //modal để thê mới và cập nhật địa chỉ
    // const ModalAddress = useMemo(
    //     (props) => {
    //         const selectedAddressIndex = props.selectedAddress;
    //         const fillAddress = addressList[selectedAddressIndex];
    //         return (
    //             <>
    //                 {!loading && (
    //                     <Modal
    //                         open={open}
    //                         title="Địa chỉ mới"
    //                         onOk={handleOk}
    //                         onCancel={handleCancel}
    //                         footer={[
    //                             <Button key="back" onClick={handleCancel}>
    //                                 Trở lại
    //                             </Button>,
    //                             <Button key="submit" type="primary" onClick={handleOk}>
    //                                 Hoàn thành
    //                             </Button>,
    //                         ]}
    //                     >
    //                         <AddressForm address={fillAddress} />
    //                     </Modal>
    //                 )}
    //             </>
    //         );
    //     },
    //     [selectedAddress],
    // );

    const showNewModal = ({currentTarget}) => {
        setLoading(true);
       
        setLoading(false);
        setNewOpen(true);
    }
const handleNewOk = () => {
    newAddressForm.validateFields().then(res => {
       const postalId = Math.floor(100000 + Math.random() * 900000);
        const newAddressRequest = (wards, district,address_line,province,postal_id) =>  {return {
            id: 0,
            wards: wards,
            district: district,
            address_line: address_line,
            province: province,
            postal_id: postal_id,
            is_default: true
          };}
         
          const request = newAddressRequest( new_ward, new_district, new_address_line, new_province, postalId);
                // console.log('id: ', idAddress);
                console.log(new_province);
                console.log(new_district);
                console.log(new_ward);
                console.log(new_address_line);
          sendNewRequest(request);
    })
}
const sendNewRequest = (request) => {
    axios.post(`${ENV_URL}${CRUD_USER_ADDRESS}`,request).then(res => {
        openNotificationWithIcon('success', 'Thêm mới thành công');
      
         getUserAddress().catch(console.error);
         setNewOpen(false)
    }).catch(e => {
                    let {response} = e;
                    console.log(response);
                    if(response.status === 400) {
                      console.log("bad re")
                        openNotificationWithIcon('error', 'Cập nhật thất bại',response.data,'top',4);
                    }else {
                        openNotificationWithIcon('error','Có lỗi xảy ra')
                    }
                 
                })   
}
const handleNewCancel = () => {
    // console.log('canceled ----');
    setNewOpen(false);
    newAddressForm.resetFields();
};
const showPromiseConfirm = ({currentTarget}) => {
    let index = currentTarget.getAttribute('data-address-value');
    let addressId = addressList[index].id;
    confirm({
        title: 'Bạn có muốn xoá địa chỉ?',
        icon: <ExclamationCircleFilled />,
        onOk() {
            return onDeleteAddressHandler(addressId)
                .then(async (res) => {
                    await getUserAddress();
                    openNotificationWithIcon(
                        'success',
                        'Đã xoá địa chỉ',
                    );
                })
                .catch((err) => {
                    console.log(err);
                    openNotificationWithIcon(
                        'error',
                        'Có lỗi trong khi hủy vui lòng thử lại!',
                    );
                });
        },
        onCancel() {},
    });
};
const onDeleteAddressHandler = (addressId) => {
  
  return  axios.delete(`${ENV_URL}${CRUD_USER_ADDRESS}`,
   {params: {id: addressId}})
}
    return (
        <>
            {contextHolder}
            {!loading && (
                <div
                className='address-section'
                    style={{
                        width: '100%',
                        minHeight: '750px',
                        // backgroundColor: "rgba(0,0,0,.09)",
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            margin: 'auto',
                            width: 800,
                            // height: 400,
                            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 13%)',
                            boxSizing: 'border-box',
                            backgroundColor: '#fff',
                            padding: '50px',
                            marginTop: '50px',
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <h3>Địa chỉ của tôi</h3>
                                <Button  className='add-new-btn'  size="middle" icon={<PlusOutlined />} onClick={showNewModal}>
                                    Thêm địa chỉ mới
                                </Button>
                            </div>
                            <hr style={{ opacity: 0.2 }} />
                            {addressList.length === 0 && <div style={{ textAlign: 'center', padding: '12px 30px 0' }}> Không tìm thấy địa chỉ mặc định </div>}
                            {addressList.length > 0 &&
                                addressList.map((address, index) => {
                                    return (
                                        <div className='address-row' key={Math.random(1000 - 1) * 1000 + index}>
                                            <div style={{ padding: '12px 30px 0' }}>
                                                <div className='address-title' >Địa chỉ #{index + 1} 
                                                {address.is_default &&  <span className='add-def'> Mặc định</span>}
                                               
                                                </div>
                                                <div style={{ borderBottom: '1px solid rgba(0,0,0,.26)' }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{ minWidth: 0, width: '100%' }}>
                                                            <div
                                                                style={{
                                                                    justifyContent: 'space-between',
                                                                    marginBottom: '4px',
                                                                    display: 'flex',
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        marginRight: '8px',
                                                                        flexGrow: 1,
                                                                        overflowX: 'hidden',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        color: '#696464de',
                                                                    }}
                                                                >
                                                                    <span style={{ fontSize: '16px' }}>
                                                                        <div>{infoUser.full_name}</div>{' '}
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            borderLeft: '1px solid rgba(0,0,0,.26)',
                                                                            margin: '0 8px',
                                                                            minHeight: '26px',
                                                                        }}
                                                                    ></div>
                                                                    <div style={{}}>(+84) {infoUser.phone}</div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        justifyContent: 'flex-end',
                                                                        display: 'flex',
                                                                        flexBasis: '40px',
                                                                    }}
                                                                >
                                                                    <Button data-address-value={index} type="link" onClick={showModal}>
                                                                        Cập nhật
                                                                    </Button>
                                                                    <Button data-address-value={index}  onClick={showPromiseConfirm} type="link">Xóa</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex' }}>
                                                        <div className="d_flex_col" style={{ minWidth: 0, width: '100%', fontSize: '16px', padding: '10px 0' }}>
                                                            <div>{address.address_line} </div>
                                                            <div>
                                                                {address.wards} {address.district} {address.province}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <ModalAddress open={open} handleOk={handleOk} handleCancel={handleCancel} addressList={addressList} selectedAddress={selectedAddress} addressForm={addressForm} />
                    <ModalNewAddress open={newOpen}
                    handleOk={handleNewOk} handleCancel={handleNewCancel}  addressForm={newAddressForm}
                    ></ModalNewAddress>
                    {/* <ModalAddress selectedAddress={selectedAddress}> </ModalAddress> */}
                </div>
            )}
            {/* {!loading && <ModalAddress open={open} handleOk={handleOk} handleCancel={handleCancel} addressList={addressList} selectedAddress={selectedAddress} addressForm={addressForm} />} */}
        </>
    );
}

const AddressForm = memo(({ selectedAddress, addressList, form, handleOk }) => {
    const selectedAddressIndex = selectedAddress;
    const address = addressList[selectedAddressIndex];
    const [isEdited, setIsEdited] = useState(false);
    const [defaultAddress, setDefaultAddress] = useState({
        province: {},
        district: {},
        wards: {},
        address_line: '',
        is_default: false,
    });
    const [defaultProvince, setDefaultProvince] = useState('');
    const [updatedProvince, setUpdatedProvince] = useState({});
    const [updatedDistrict, setUpdatedDistrict] = useState({});
    const [updatedWard, setUpdatedWard] = useState({});
    const [updatedAddressLine, setUpdatedAddressLine] = useState('');
    const [updatedIsDefault, setUpdatedIsDefault] = useState(false);
    const [isLoad, setIsLoad] = useState(false);

    // console.log(' addd: ', address);
    const { TextArea } = Input;
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [wardOptions, setWardOptions] = useState([]);

    // first load, fetch provice
    useEffect(() => {
        setIsLoad(true);
        // console.log('address line: ', address);
        // console.log('useEffect');
        fetchProvince().catch(console.error);
        setUpdatedAddressLine((prev) => address.address_line);
        setUpdatedIsDefault((prev) => address.is_default);
        setIsLoad(false);
        // return (() => {

        // })
    }, []);

    // after loaded Province Options, set UpdatedProvince
    useEffect(() => {
        setIsLoad(true);
        if (provinceOptions.length !== 0) {
            const waitFnc = async () => {
                let found = filterOption(provinceOptions, address.province);

                if (!isEdited) {
                    onSetDefaultAddress();
                }
                setUpdatedProvince((prev) => found);
            };
            waitFnc();
            // console.log('fethc adderss: ');
        }

        setIsLoad(false);
    }, [provinceOptions, setProvinceOptions]);

    // after set UpdatedProvince, fetch districtOptions
    useEffect(() => {
        // console.log('inside updated provice');
        form.setFieldsValue({ provinces: updatedProvince.label });
        // console.log('updatedP: ', updatedProvince.label);

        fetchDistrict(updatedProvince.value);

        return () => {
            form.setFieldsValue({ provinces: '' });
        };
    }, [setUpdatedProvince, updatedProvince]);

    // after loaded District Options, set UpdatedDistrict
    useEffect(() => {
        setIsLoad(true);
        // console.log('useEffec dis options ');
        if (provinceOptions.length !== 0 && districtOptions.length !== 0) {
            // console.log('dis options ', isEdited);
            const waitFnc = async () => {
                // console.log('call waitFnc', isEdited);
                if (!isEdited) {
                    let found = filterOption(districtOptions, address.district);
                    // console.log('found dis: ', found);
                    onSetDefaultAddress();
                    setUpdatedDistrict((prev) => found);
                } else {
                    // console.log('isEdited ture');
                    let first = districtOptions[0];
                    setUpdatedDistrict((prev) => first);
                }
            };
            waitFnc();
            setIsLoad(false);
        }
    }, [districtOptions, setDistrictOptions]);

    // after set UpdatedDistrict, fetch ward options
    useEffect(() => {
        form.setFieldsValue({ district: updatedDistrict.label });
        // console.log('updatedD: ', updatedDistrict);

        fetchWard(updatedDistrict.value);

        return () => {
            form.setFieldsValue({ district: '' });
        };
    }, [setUpdatedDistrict, updatedDistrict]);

    //  after loaded Ward Options, set setUpdatedWard
    useEffect(() => {
        setIsLoad(true);
        // console.log('useEffec ward options ');
        if (provinceOptions.length !== 0 && districtOptions.length !== 0 && wardOptions.length !== 0) {
            // console.log('ward options ', isEdited);
            const waitFnc = async () => {
                // console.log('call waitFnc', isEdited);
                if (!isEdited) {
                    let found = filterOption(wardOptions, address.wards);

                    // console.log('found ward: ', found);
                    onSetDefaultAddress();
                    setUpdatedWard((prev) => found);
                } else {
                    // console.log('isEdited ture');
                    let first = wardOptions[0];
                    setUpdatedWard((prev) => first);
                }
            };
            waitFnc();
            setIsLoad(false);
        }
    }, [wardOptions, setWardOptions]);

    // set setUpdatedWard
    useEffect(() => {
        form.setFieldsValue({ ward: updatedWard.label });
        return () => {
            form.setFieldsValue({ ward: '' });
        };
    }, [setUpdatedWard, updatedWard]);

    // set updatedAddressLine
    useEffect(() => {
        form.setFieldsValue({ address_line: updatedAddressLine });

        return () => {
            form.setFieldsValue({ address_line: '' });
        };
    }, [updatedAddressLine, setUpdatedAddressLine]);

    // set updatedIsDefault
    useEffect(() => {
        form.setFieldsValue({ is_default: updatedIsDefault });

        return () => {
            form.setFieldsValue({ is_default: '' });
        };
    }, [updatedIsDefault, setUpdatedIsDefault]);

    const fetchProvince = async () => {
        // console.log('fetchtws');
        let data = await getProvince();
        // console.log('data: ', data);
        let provinces = data.map((p) => {
            return { label: p.name, value: p.code };
        });

        setProvinceOptions((prev) => provinces);
    };

    const fetchDistrict = async (provinceCode) => {
        let dataDis = await getSearchDistrict(provinceCode);
        // console.log('district options!: ', dataDis);

        // console.log('mapping.... ');
        let districts = dataDis.districts.map((p) => {
            return { label: p.name, value: p.code };
        });
        setDistrictOptions((prev) => districts);
    };

    const fetchWard = async (districtCode) => {
        let dataWard = await getSearchWard(districtCode);
        let wards = dataWard.wards.map((p) => {
            return { label: p.name, value: p.code };
        });
        setWardOptions((prev) => wards);
    };

    const filterOption = (options, input) => {
        if (options.length > 0) {
            let found = options.filter((option) => {
                return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
            });
             return found[0];
        }
    };

    const searchForPronvice = async (input) => {
        let result = await  getSearchProvince(input);
        // console.log(result);
        return result;
    }

    const onSelectProvice = (e) => {
        let defaultCode = defaultAddress.province.code;
        if (e !== defaultCode) {
            setIsEdited(true);
            let foundIndex = provinceOptions.findIndex((p) => p.value === e);

            // let found = filterOption(provinceOptions, )
            if (foundIndex != -1) {
                // console.log('set updatd province = ');
                setUpdatedProvince((prev) => {
                    return { ...provinceOptions[foundIndex] };
                });
            }
        }
    };

    const onSelectDistrict = (e) => {
        let defaultCode = defaultAddress.district.code;
        if (e !== defaultCode) {
            setIsEdited(true);
            // console.log('found index ');
            let foundIndex = districtOptions.findIndex((p) => p.value === e);
            if (foundIndex != -1) {
                // console.log('set updatd province = ');
                setUpdatedDistrict((prev) => {
                    return { ...districtOptions[foundIndex] };
                });
            }
        }
    };

    const onSelectWard = (e) => {
        let defaultCode = defaultAddress.wards.code;
        if (e !== defaultCode) {
            setIsEdited(true);

            let foundIndex = wardOptions.findIndex((p) => p.value === e);
            // console.log('found index ', foundIndex);
            if (foundIndex != -1) {
                // console.log('set updatd ward = ');
                setUpdatedWard((prev) => {
                    return { ...wardOptions[foundIndex] };
                });
            }
        }
    };
    const onChangeAddressLine = (e) => {
        let input = e.currentTarget.value;
        console.log('address.address_line', address.address_line);
        if (input !== address.address_line) {
            setIsEdited((prev) => true);
            setUpdatedAddressLine((v) => input);
        }
    };

    const onIsDefaultChangeHandler = (e) => {
        let selected = e.target.value;
        setIsEdited((prev) => true);
        setUpdatedIsDefault((prev) => selected);
    };

    const onResetDefault = () => {
        console.log('call reset', address);
        // form.resetFields();
        // console.log('pass seet');
        setIsEdited((prev) => {
            return false;
        });
        // alert('set true');
        // onSetDefaultAddress();
    };

    useEffect(() => {
        // alert('run');
        // console.log('idEdidted : ', isEdited);
        if (!isEdited) {
            console.log('fetch defaul');
            fetchProvince().catch((e) => console.log(e));
            console.log('call set default');
            setUpdatedAddressLine((prev) => address.address_line);
            setUpdatedIsDefault((prev) => address.is_default);
        } else {
            console.log('wrong ');
        }
    }, [isEdited]);

    const findDefaultProvince = () => {
        return filterOption(provinceOptions, address.province);
    };
    const findDefaultDistrict = () => {
        return filterOption(districtOptions, address.district);
    };

    const findDefaultWard = () => {
        return filterOption(wardOptions, address.wards);
    };

    const onSetDefaultAddress = () => {
        if (districtOptions.length !== 0 && provinceOptions.length !== 0 && wardOptions.length !== 0) {
            // console.log('set defautl add');
            let foundD = findDefaultDistrict();
            let foundP = findDefaultProvince();
            let foundW = findDefaultWard();
            let line = address.address_line;
            let isDef = address.is_default;
            setDefaultAddress((prev) => {
                return {
                    ...prev,
                    province: foundP,
                    district: foundD,
                    wards: foundW,
                    address_line: line,
                    is_default: isDef,
                };
            });
        }
    };

    return (
        <>
            {isLoad && <Spin />}
            {!isLoad && (
                <>
                    <Form
                        name="complex-form"
                        onFinish={onFinish}
                        labelCol={{
                            span: 0,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        initialValues={
                            {
                                // province: address.province,
                                // provinces: updatedProvince.value,
                                // dis: address.district,
                                // ward: updatedWard.value,
                                // district: updatedDistrict.value,
                                // address_line: updatedAddressLine,
                            }
                        }
                        validateTrigger={handleOk}
                        form={form}
                    >
                        {(values, formInstance) => {
                            return (
                                <>
                                    <h2>
                                        <Button onClick={onResetDefault}>Khôi phục</Button>
                                    </h2>
                                    <Form.Item
                                        name="provinces"
                                        initialValue={updatedProvince}
                                        noStyle
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn tỉnh thành',
                                            },
                                        ]}
                                    >
                                        <Select
                                            value={updatedProvince.label}
                                            style={{ width: '100%' }}
                                            options={provinceOptions}
                                            showSearch
                                            onSelect={onSelectProvice}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        noStyle
                                        name="district"
                                        initialValue={updatedDistrict.label}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Username is required',
                                            },
                                        ]}
                                    >
                                        <Select
                                            value={updatedDistrict.label}
                                            style={{ width: '100%' }}
                                            options={districtOptions}
                                            showSearch
                                            onSelect={onSelectDistrict}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        noStyle
                                        name="ward"
                                        initialValue={updatedWard.label}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn phường xã',
                                            },
                                        ]}
                                    >
                                        <Select
                                            value={updatedWard.value}
                                            style={{ width: '100%' }}
                                            options={wardOptions}
                                            showSearch
                                            onSelect={onSelectWard}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        // noStyle
                                        name="address_line"
                                        initialValue={updatedAddressLine}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng không để trống địa chỉ',
                                            },
                                        ]}
                                    >
                                        <TextArea value={updatedAddressLine} maxLength={100} style={{ height: 120, marginBottom: 10, resize: 'none' }} placeholder="Địa chỉ cụ thể" onChange={onChangeAddressLine} />
                                    </Form.Item>
                                    <Form.Item
                                        // noStyle
                                        initialValue={address.is_default}
                                        label="Địa chỉ mặc định"
                                        name="is_default"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng không để trống địa chỉ',
                                            },
                                        ]}
                                    >
                                        <Radio.Group onChange={onIsDefaultChangeHandler} value={updatedIsDefault} size="medium">
                                            <Radio.Button value={true}>Mở</Radio.Button>
                                            <Radio.Button value={false}>Tắt</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </>
                            );
                        }}
                    </Form>
                </>
            )}
        </>
    );
});

const ModalAddress = memo(({ open, handleOk, handleCancel, addressList, selectedAddress, addressForm }) => {
    // console.log(' -----');
    // console.log('%c Render modal', 'color: red');
    const [isLoad, setIsLoad] = useState(false);

    return (
        <>
            {!isLoad && open && addressList.length !== 0 && selectedAddress != -1 && (
                <Modal
                    open={open}
                    title="Cập nhật địa chỉ "
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Trở lại
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                            Hoàn thành
                        </Button>,
                    ]}
                >
                    <AddressForm addressList={addressList} selectedAddress={selectedAddress} form={addressForm} handleOk={handleOk} />
                </Modal>
            )}
        </>
    );
});

const ModalNewAddress = memo(({ open, handleOk, handleCancel, addressForm }) => {
    // console.log(' -----');
    // console.log('%c Render modal', 'color: red');
    const [isLoad, setIsLoad] = useState(false);
    // const [fillAddress, setFillAddress] = useState({});
    // const [isLoad, setIsLoad] = useState(false);
    useEffect(() => {
    //   setIsLoad(true);

    //   // setFillAddress((prev) => address);
    //   setIsLoad(false);
    }, []);
    return (
        <>
            {!isLoad && open &&  (
                <Modal
                    open={open}
                    title="Thêm địa chỉ mới"
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Trở lại
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                            Thêm địa chỉ mới
                        </Button>,
                    ]}
                >
                    <NewAddressForm   form={addressForm} handleOk={handleOk} />
                </Modal>
            )}
        </>
    );
});

const NewAddressForm = memo(({  form, handleOk }) => {
    const [updatedProvince, setUpdatedProvince] = useState({});
    const [updatedDistrict, setUpdatedDistrict] = useState({});
    const [updatedWard, setUpdatedWard] = useState({});
    const [updatedAddressLine, setUpdatedAddressLine] = useState('');
    const [isLoad, setIsLoad] = useState(false);
    const { TextArea } = Input;
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [wardOptions, setWardOptions] = useState([]);

    // first load, fetch provice
    useEffect(() => {
        setIsLoad(true);
        fetchProvince().catch(console.error);
        setIsLoad(false);
        return (() => {   
            setProvinceOptions(() => []);
            form.setFieldsValue({ provinces: ''});
        })
    }, []);

    // after loaded Province Options, set UpdatedProvince
    useEffect(() => {
        if (provinceOptions.length !== 0) {
            const waitFnc = async () => {
                let found = provinceOptions[0];
                setUpdatedProvince((prev) => found);
            };
            waitFnc();
        }   
    }, [provinceOptions, setProvinceOptions]);

    // after set UpdatedProvince, fetch districtOptions
    useEffect(() => {
        setIsLoad(true);
        form.setFieldsValue({ provinces: updatedProvince.label });
        fetchDistrict(updatedProvince.value);
        setIsLoad(false);
        return (() => {    
            setDistrictOptions((prev) => [])
            setWardOptions((prev) => [])
            form.setFieldsValue({ provinces: ''});
            form.setFieldsValue({ district: '' });
            form.setFieldsValue({ ward: '' });
        })
    }, [setUpdatedProvince, updatedProvince]);

    // after loaded District Options, set UpdatedDistrict
    useEffect(() => {
        setIsLoad(true);
        if (provinceOptions.length !== 0 && districtOptions.length !== 0) {
            const waitFnc = async () => {
                    let first = districtOptions[0];
                    setUpdatedDistrict((prev) => first);
            };
            waitFnc();
            setIsLoad(false);
        }
    }, [districtOptions, setDistrictOptions]);

    // after set UpdatedDistrict, fetch ward options
    useEffect(() => {
        setIsLoad(true);
        form.setFieldsValue({ district: updatedDistrict.label });
        fetchWard(updatedDistrict.value);
        setIsLoad(false);
        return () => {
            form.setFieldsValue({ district: '' });
            form.setFieldsValue({ ward:'' });
            setWardOptions((prev) => [])
        };
    }, [setUpdatedDistrict, updatedDistrict]);

    //  after loaded Ward Options, set setUpdatedWard
    useEffect(() => {
        if (provinceOptions.length !== 0 && districtOptions.length !== 0 && wardOptions.length !== 0) {
            const waitFnc = async () => {
                    let first = wardOptions[0];
                    setUpdatedWard((prev) => first);
                // }
            };
            waitFnc();
          
        }
    }, [wardOptions, setWardOptions]);

    // set setUpdatedWard
    useEffect(() => {
        form.setFieldsValue({ ward: updatedWard.label });
        return () => {
            form.setFieldsValue({ ward: '' });
        };
    }, [setUpdatedWard, updatedWard]);

    // set updatedAddressLine
    useEffect(() => {
        form.setFieldsValue({ address_line: updatedAddressLine });

        return () => {
            form.setFieldsValue({ address_line: '' });
        };
    }, [updatedAddressLine, setUpdatedAddressLine]);
    const fetchProvince = async () => {
        // console.log('fetchtws');
        let data = await getProvince();
        // console.log('data: ', data);
        let provinces = data.map((p) => {
            return { label: p.name, value: p.code };
        });

        setProvinceOptions((prev) => provinces);
    };

    const fetchDistrict = async (provinceCode) => {
        let dataDis = await getSearchDistrict(provinceCode);
        let districts = dataDis.districts.map((p) => {
            return { label: p.name, value: p.code };
        });
        setDistrictOptions((prev) => districts);
    };

    const fetchWard = async (districtCode) => {
        let dataWard = await getSearchWard(districtCode);
        // console.log('dataWard  options!: ', dataWard);

        // console.log('mapping.... ');
        let wards = dataWard.wards.map((p) => {
            return { label: p.name, value: p.code };
        });
        setWardOptions((prev) => wards);
    };

    const filterOption = (options, input) => {
        if (options.length > 0) {
            let found = options.filter((option) => {
                return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
            });
             return found[0];
        }
    };

    const searchForPronvice = async (input) => {
        let result = await  getSearchProvince(input);
        console.log(result);
        return result;
    }

    const onSelectProvice = (e) => {
            let foundIndex = provinceOptions.findIndex((p) => p.value === e);
            if (foundIndex != -1) {
                setUpdatedProvince((prev) => {
                    return { ...provinceOptions[foundIndex] };
                });
            }
        // }
    };

    const onSelectDistrict = (e) => {
            let foundIndex = districtOptions.findIndex((p) => p.value === e);
            if (foundIndex != -1) {
                setUpdatedDistrict((prev) => {
                    return { ...districtOptions[foundIndex] };
                });
            }
    };

    const onSelectWard = (e) => {

            let foundIndex = wardOptions.findIndex((p) => p.value === e);
            if (foundIndex != -1) {
                setUpdatedWard((prev) => {
                    return { ...wardOptions[foundIndex] };
                });
            }
        // }
    };

    const onResetDefault = () => {

    };

    const onSetDefaultAddress = () => {
        if (districtOptions.length !== 0 && provinceOptions.length !== 0 && wardOptions.length !== 0) {
            let foundD = districtOptions[0];
            let foundP = provinceOptions[0];
            let foundW = wardOptions[0];
            let line = '';
                return {   
                    province: foundP,
                    district: foundD,
                    wards: foundW,
                    address_line: line
                };
        }
    };

    return (
        <>
            {isLoad && <Spin />}
            {!isLoad && (
                <>
                    <Form
                        name="complex-form"
                        onFinish={onFinish}
                        labelCol={{
                            span: 0,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        validateTrigger={handleOk}
                        form={form}
                    >
                        {(values, formInstance) => {
                            return (
                                <>
                                    {/* <h2>
                                        <Button onClick={onResetDefault}>Khôi phục</Button>
                                    </h2> */}
                                    <Form.Item
                                    label="Tỉnh/thành:"
                                        name="provinces"
                                        initialValue={updatedProvince}
                                        // noStyle
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn tỉnh thành',
                                            },
                                        ]}
                                    >
                                        <Select
                                            value={updatedProvince.label}
                                            style={{ width: '100%' }}
                                            options={provinceOptions}
                                            showSearch
                                            onSelect={onSelectProvice}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        // noStyle
                                        label="Quận/huyện:"
                                        name="district"
                                        initialValue={updatedDistrict.label}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Username is required',
                                            },
                                        ]}
                                    >
                                        <Select
                                            value={updatedDistrict.label}
                                            style={{ width: '100%' }}
                                            options={districtOptions}
                                            showSearch
                                            onSelect={onSelectDistrict}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        // noStyle
                                        label="Phường/xã:"
                                        name="ward"
                                        initialValue={updatedWard.label}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn phường xã',
                                            },
                                        ]}
                                    >
                                        <Select
                                            value={updatedWard.value}
                                            style={{ width: '100%' }}
                                            options={wardOptions}
                                            showSearch
                                            onSelect={onSelectWard}
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Địa chỉ cụ thể"
                                        name="address_line"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng không để trống địa chỉ',
                                            },
                                        ]}
                                    >
                                        <TextArea value={''} maxLength={100} style={{ height: 120, marginBottom: 10, resize: 'none' }} placeholder="Địa chỉ cụ thể"  />
                                    </Form.Item>
                                </>
                            );
                        }}
                    </Form>
          
                </>
            )}
        </>
    );
})
export default memo(Address);
