import React, { Component } from "react"
import { api } from './api'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormGroup,
    CInput,
    CLabel,
    CRow,
    CLink,
    CTooltip,
    CBreadcrumb,
    CBreadcrumbItem
} from '@coreui/react'
import swal from 'sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faHome, faPlus } from '@fortawesome/free-solid-svg-icons'

class CreateArchiveType extends Component {

    constructor(props) {
        super(props);
        this.state = {
            archives: [],
            archive_type: ""
        };
    }

    APICheck = async e => {
        e.preventDefault()

        const checkArchiveType = this.state.archives.filter(f => f.archive_type.toLowerCase() === this.state.archive_type.toLowerCase())

        if (checkArchiveType.length > 0) {
            swal("Attention!", "Folder Name Must Be Unique", "error")
        } else {
            await api.post('/create-archive', {
                archive_type: this.state.archive_type
            })
                .then(async res => {
                    if (res.data.error) {
                        swal("Attention!", res.data.error, "error");
                    } else {
                        await swal("Attention!", res.data.message, "success")
                        window.location.href = `http://localhost:3000/#/fm`
                    }
                })
        }
    }

    componentDidMount() {
        api.get('/get-archives')
            .then(res => {
                this.setState({
                    archives: res.data.archives
                })
            })
    }

    render() {
        return (
            <>
                <CCard>
                    <CCardHeader>
                        <br />
                        <CBreadcrumb>
                            <CBreadcrumbItem>
                                <CLink to={{ pathname: "/fm" }} style={{ color: "#3c4b64" }}>
                                    <FontAwesomeIcon icon={faHome} /> Home
                                </CLink>
                            </CBreadcrumbItem>

                            <CBreadcrumbItem active>
                                <CLink style={{ color: "#3c4b64", pointerEvents: "none", opacity: "0.5" }}>
                                    <FontAwesomeIcon icon={faPlus} /> Folder
                                </CLink>
                            </CBreadcrumbItem>
                        </CBreadcrumb>
                        <CRow>
                            <CCol md="8">
                                <CLink to={{ pathname: `/fm` }}>
                                    <CTooltip content={`Back`} placement={`right`}>
                                        <CButton style={{ backgroundColor: "#3c4b64", color: "white" }}><FontAwesomeIcon icon={faArrowLeft} /></CButton>
                                    </CTooltip>
                                </CLink>
                            </CCol>

                            <CCol md="4" className="text-right">
                                <h1><strong>Create Folder</strong></h1>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CForm method="post" onSubmit={(e) => this.APICheck(e)}>
                            <CFormGroup>
                                <CLabel htmlFor="archiveType">Folder Name</CLabel>
                                <CInput id="archiveType" type="text" required placeholder="Enter the folder's name" onChange={(e) => { this.setState({ archive_type: e.target.value }) }} minLength="6"/>
                            </CFormGroup>
                            <br></br>
                            <CFormGroup>
                                <CButton block style={{ backgroundColor: "#3c4b64", color: "white" }} type="submit">Create</CButton>
                            </CFormGroup>
                        </CForm>
                    </CCardBody>
                </CCard>
            </>
        )
    }
}

export default CreateArchiveType;