import React, { Component } from "react"
import { api } from './api'
import moment from 'moment'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormGroup,
    CTextarea,
    CInput,
    CLabel,
    CRow,
    CLink,
    CBreadcrumb,
    CBreadcrumbItem,
    CTooltip
} from '@coreui/react'
import fileDownload from "js-file-download"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faDownload, faHome, faFolder, faFile } from '@fortawesome/free-solid-svg-icons'

class View extends Component {

    constructor(props) {
        super(props)
        this.state = {
            file: [{
                file_name: ""
            }],
            data_url: "",
            file_name: "",
            archive_type: ""
        }
    }

    retrieveData = async (file_id) => {

        await api.post('/retrieve-file', {
            file_id: file_id
        })
            .then(res => {
                this.setState({ data_url: res.data.file })
            })

        await api.post('/get-file-name', {
            file_id: file_id
        })
            .then(res => {
                this.setState({ file_name: res.data.file_name })
            })

        var convert = await this.dataURLtoFile(this.state.data_url, this.state.file_name)
        fileDownload(convert, this.state.file_name)
    }

    dataURLtoFile(data_url, file_name) {

        var arr = data_url.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], file_name, { type: mime });
    }

    getData(file_id) {
        api.get(`/get-file?file_id=${file_id}`)
            .then(res => {
                this.setState({
                    file: res.data.file
                })
                api.get(`/get-archive-type?archive_id=${this.state.file[0].archive_type}`)
                    .then(res => {
                        this.setState({
                            archive_type: res.data.archive_type[0].archive_type
                        })
                    })
            })
    }

    componentDidMount() {
        this.getData(this.props.match.params.file_id)
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

                            <CBreadcrumbItem>
                                <CLink to={{ pathname: `/year/${this.props.match.params.archive_type}` }} style={{ color: "#3c4b64" }}>
                                    <FontAwesomeIcon icon={faFolder} /> {this.props.match.params.archive_type}
                                </CLink>
                            </CBreadcrumbItem>

                            <CBreadcrumbItem>
                                <CLink to={{ pathname: `/month/${this.props.match.params.archive_type}/${this.props.match.params.archive_year}` }} style={{ color: "#3c4b64" }}>
                                    <FontAwesomeIcon icon={faFolder} /> {this.props.match.params.archive_year}
                                </CLink>
                            </CBreadcrumbItem>

                            <CBreadcrumbItem>
                                <CLink to={{ pathname: `/file/${this.props.match.params.archive_type}/${this.props.match.params.archive_year}/${this.props.match.params.archive_month}` }} style={{ color: "#3c4b64" }}>
                                    <FontAwesomeIcon icon={faFolder} /> {this.props.match.params.archive_month}
                                </CLink>
                            </CBreadcrumbItem>

                            <CBreadcrumbItem active>
                                <CLink style={{ color: "#3c4b64", pointerEvents: "none", opacity: "0.5" }}>
                                    <FontAwesomeIcon icon={faFile} /> {this.state.file[0].file_name}
                                </CLink>
                            </CBreadcrumbItem>
                        </CBreadcrumb>
                        <CRow>
                            <CCol md="8">
                                <CLink to={{ pathname: `/file/${this.props.match.params.archive_type}/${this.props.match.params.archive_year}/${this.props.match.params.archive_month}` }}>
                                    <CTooltip content={`Back`} placement={`right`}>
                                        <CButton style={{ backgroundColor: "#3c4b64", color: "white" }}><FontAwesomeIcon icon={faArrowLeft} /></CButton>
                                    </CTooltip>
                                </CLink>
                            </CCol>

                            <CCol md="4" className="text-right">
                                <h1><strong>View Archive</strong></h1>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CFormGroup>
                            <CLabel htmlFor="archiveName">Archive Name</CLabel>
                            <CInput id="archiveName" type="text" required disabled value={this.state.file[0].file_name} placeholder="Enter the archive's name" />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="archiveDescription">Archive Description</CLabel>
                            <CTextarea id="archiveDescription" rows="4" cols="50" type="text" disabled value={this.state.file[0].file_description ? this.state.file[0].file_description : "-"} placeholder="Enter the archive's description" />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="archiveType">Archive Folder</CLabel>
                            <CInput id="archiveType" type="text" required disabled value={this.state.archive_type} placeholder="Select the archive's folder" />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="archiveCreated">Archive Created</CLabel>
                            <CInput id="archiveCreated" type="text" required disabled value={moment(this.state.file[0].file_created_at).format('MMMM Do YYYY, h:mm:ss a')} placeholder="Enter the archive's created" />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="archiveUpdated">Archive Updated</CLabel>
                            <CInput id="archiveUpdated" type="text" required disabled value={this.state.file[0].file_updated_at ? moment(this.state.file[0].file_updated_at).format('MMMM Do YYYY, h:mm:ss a') : "-"} placeholder="Enter the archive's updated" />
                        </CFormGroup>
                        <br></br>
                        <CFormGroup>
                            <CButton block style={{ backgroundColor: "#3c4b64", color: "white" }} onClick={() => this.retrieveData(this.state.file[0].file_id)}><FontAwesomeIcon icon={faDownload} /></CButton>
                        </CFormGroup>
                    </CCardBody>
                </CCard>
            </>
        )
    }
}

export default View;