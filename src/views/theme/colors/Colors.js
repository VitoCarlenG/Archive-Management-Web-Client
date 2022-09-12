import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { freeSet } from '@coreui/icons'
import {
  CLink,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CCol,
  CRow,
  CTooltip,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CLabel,
  CForm,
  CFormGroup,
  CFormText,
  CInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {axioz} from '../../../configs/axios'

const User = (props) => {

    const history = useHistory()
    const handleModal = () => setModal(true)
    
    const [dataa, setDataa] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    

    const [form, setForm] = useState({
      id_atm: '',
      ip: '',
      port: '',
      lokasi: '',
      keterangan: '',
      type_atm : '',
      path_folder_log: '',
      status: ''
    })
  

    const getData = () => {
        axioz.get('/get-all-user')
        .then(res => {
            console.log(res)
            setDataa(res.data.data)
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => setLoading(false));
    }

    //OnSubmit
    const onSubmit = () => {
        console.log(form)
        // if(name === '' || email === '' || password === '') {
        //     window.alert('Please fill all input')
        //     return
        // }

        // axioz.post('/register', {
        //         name: name,
        //         email: email,
        //         password: password
        // })
        // .then(res => {
        //     console.log(res)
        //     getData()
        // })
        // .catch(err => {
        //     console.log(err.response)

        //     window.alert(err.response.data.message)
           
        // })   
    }

    const delData = (id) => {
        console.log(id)
        const confirm = window.confirm('hallo')

        if(confirm) {
            axioz.post('/delete-user', {
                id: id
            })
            .then(res => {
                console.log(res)
                            getData()
            })
            .catch(err =>{
                console.log(err)
            })
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
            <CCard>
                <CCardHeader>
                    <CRow>
                        <CCol md="11">
                            Users
                        </CCol>
                        <CCol md="1">
                            <CTooltip
                                content="Tambah Users"
                                placement="top"
                            >
                            <CButton 
                            className="card-header-action"
                            onClick={handleModal}>
                                <CIcon content={freeSet.cilPlus} />                            
                            </CButton>
                            </CTooltip>
                        </CCol>
                    </CRow>

                </CCardHeader>
                <CCardBody>
                    <CDataTable
                        items={dataa}
                        fields={[
                            'id',
                            'name',
                            'email', 
                            'created_at', 
                            'action'
                        ]}
                        hover
                        loading={loading}
                        bordered
                        size="sm"
                        itemsPerPage={10}
                        pagination
                        scopedSlots = {{
                            'action':
                            (item)=>(
                                <td>
                                    <CTooltip
                                        content="Update Users"
                                        placement="top"
                                    >
                                        <CLink 
                                        className="card-header-action"
                                        onClick={() => {
                                            history.push({
                                                pathname: '/updateuser',
                                                data: {
                                                    name: item.name,
                                                    email: item.email,
                                                    id: item.id
                                                }
                                            })
                                        }}>
                                            <CIcon content={freeSet.cilPencil} />     
                                        </CLink>
                                    </CTooltip>
                                    <CTooltip
                                        content="Hapus Users"
                                        placement="top"
                                    >
                                        <CLink 
                                            className="card-header-action"
                                            onClick={() => {
                                                delData(item.id)
                                            }}>
                                                <CIcon content={freeSet.cilTrash} />        
                                        </CLink>
                                    </CTooltip>
                                </td>
                            )
                        }}
                    />
                </CCardBody>
            </CCard>

            <CModal 
              show={modal} 
              onClose={setModal}
            >
              <CModalHeader closeButton>
                <CModalTitle>Form ATM</CModalTitle>
              </CModalHeader>
              <CModalBody>
              <CForm>
                    <CFormGroup>
                        <CLabel>Id ATM</CLabel>
                        <CInput 
                            type="number"
                            placeholder="Enter your Id ATM" 
                            autoComplete="off" 
                            required
                            value={form.id_atm}
                            onChange={(e) => {
                              setForm({ id_atm: e.target.value })
                            }}
                        />
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel>keterangan</CLabel>
                        <CInput 
                            type="text"
                            placeholder="Enter your Id ATM" 
                            autoComplete="off" 
                            required
                            value={form.keterangan}
                            onChange={(e) => {
                              setForm({ keterangan: e.target.value })
                            }}
                        />
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel>Email</CLabel>
                        <CInput 
                            type="email" 
                            placeholder="Enter Email" 
                            autoComplete="off"
                            required
                            value={email}
                            onChange={(e) => {setEmail(e.target.value)}}
                        />
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel>Password</CLabel>
                        <CFormText className="help-block">8 Karakter</CFormText>
                        <CInput 
                            type="password" 
                            placeholder="Password" 
                            autoComplete="off"
                            required
                            value={password}
                            onChange={(e) => {setPassword(e.target.value)}}
                        />
                    </CFormGroup>
                </CForm>
              </CModalBody>
              <CModalFooter>
                <CButton
                    color="primary"
                    onClick={() => {
                        onSubmit()
                        setModal(false)
                    }}
                >
                    Simpan
                </CButton>
                {' '}
                <CButton 
                    color="danger"
                    onClick={() =>  setModal(false)}
                    >
                        Batal
                </CButton>
              </CModalFooter>
            </CModal>
        </div>
    )
}
export default User