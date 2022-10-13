import React, { Component } from "react"
import { api } from './api'
import moment from 'moment'
import {
    CCard,
    CCardHeader,
    CCardBody,
    CRow,
    CCol,
    CInput,
    CDataTable,
    CInputGroup,
    CInputGroupAppend,
    CButton,
    CLink,
    CBreadcrumb,
    CBreadcrumbItem,
    CTooltip
} from '@coreui/react'
import swal from 'sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faEye, faEdit, faTrash, faSearch, faArrowLeft, faHome, faFolder } from '@fortawesome/free-solid-svg-icons'

const fields = [
    { key: ' ' },
    { key: 'name' },
    { key: 'file' },
    { key: 'created' },
    { key: 'updated' },
    { key: '   Actions', _style: { textAlign: 'center' } },
]

class File extends Component {

    constructor(props) {
        super(props)
        this.state = {
            files: [],
            data_url: "",
            file_name: ""
        }
    }

    postDelete = (file_id) => {

        swal({
            title: "Are You Sure?",
            text: "You Want To Delete This Archive?",
            buttons: ["No", "Yes"],
            icon: "warning",
            dangerMode: true,
        })
            .then(willDelete => {
                if (willDelete) {
                    api.post("/delete-file", {
                        file_id: file_id
                    });

                    api.delete("/delete-archive", {
                        data: {
                            file_id: file_id
                        }
                    })
                        .then(async res => {
                            await swal("Attention!", res.data.message, "success")
                            window.location.reload()
                        })
                }
            });
    }

    retrieveData = async (file_id) => {

        await api.post('/retrieve-file', {
            file_id: file_id
        })
            .then(res => {
                this.setState({ data_url: res.data.file })
            })

        let w = window.open('about:blank');
        let iframe = w.document.createElement('iframe');
        iframe.width = "100%";
        iframe.height = "100%";

        w.document.body.appendChild(iframe).src = this.state.data_url;
    }

    onChangeInput(e) {
        api.post('/search-files', {
            file_name: e.target.value
        })
            .then(res => {
                this.setState({
                    files: res.data.search_results
                })
            })
    }

    getData(archive_type, archive_year, archive_month) {
        api.get(`/view-files?archive_type=${archive_type}&archive_year=${archive_year}&archive_month=${archive_month}`)
            .then(res => {
                this.setState({
                    files: res.data.files
                })
            })
    }

    componentDidMount() {
        this.getData(this.props.match.params.archive_type, this.props.match.params.archive_year, this.props.match.params.archive_month)
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

                            <CBreadcrumbItem active>
                                <CLink style={{ color: "#3c4b64", pointerEvents: "none", opacity: "0.5" }}>
                                    <FontAwesomeIcon icon={faFolder} /> {this.props.match.params.archive_month}
                                </CLink>
                            </CBreadcrumbItem>
                        </CBreadcrumb>
                        <CRow>
                            <CCol className="text-center">
                                <h1><strong>Archives Management</strong></h1>
                            </CCol>
                        </CRow>
                    </CCardHeader>

                    <CCardBody>
                        <CRow>
                            <CCol md="8" className="text-left">
                                <CLink to={{ pathname: `/month/${this.props.match.params.archive_type}/${this.props.match.params.archive_year}` }}>
                                    <CTooltip content={`Back`} placement={`right`}>
                                        <CButton style={{ backgroundColor: "#3c4b64", color: "white" }}><FontAwesomeIcon icon={faArrowLeft} /></CButton>
                                    </CTooltip>
                                </CLink>
                            </CCol>

                            <CCol md="4">
                                <CInputGroup>
                                    <CInput type="text" id="search" name="search" placeholder="Type to search by name ..." onChange={(e) => this.onChangeInput(e)} />
                                    <CInputGroupAppend>
                                        <CTooltip content={`Search`} placement={`top`}>
                                            <CButton className="btn-sm" type="submit" style={{ backgroundColor: "#3c4b64", color: "white" }}><FontAwesomeIcon icon={faSearch} /></CButton>
                                        </CTooltip>
                                    </CInputGroupAppend>
                                </CInputGroup>
                            </CCol>
                        </CRow>
                        <br />
                        <CDataTable
                            items={this.state.files}
                            fields={fields}
                            itemsPerPageSelect
                            striped
                            hover
                            itemsPerPage={5}
                            sorter
                            pagination
                            scopedSlots={{
                                ' ': () => {
                                    return (
                                        <td> </td>
                                    )
                                },
                                'name': (item) => {
                                    return (
                                        <td style={{ maxWidth: "125px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><FontAwesomeIcon icon={faFile} />  {item.file_name}</td>
                                    )
                                },
                                'file': (item) => {
                                    const separate = item.file_path.split("/")
                                    return (
                                        <td style={{ maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            <CLink onClick={() => this.retrieveData(item.file_id)} style={{ color: "#3c4b64", textDecorationColor: "#3c4b64" }}>
                                                {separate[separate.length - 1]}
                                            </CLink>
                                        </td>
                                    )
                                },
                                'created': (item) => {
                                    return (
                                        <td>{moment(item.file_created_at).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                    )
                                },
                                'updated': (item) => {
                                    return (
                                        <td>{item.file_updated_at ? moment(item.file_updated_at).format('MMMM Do YYYY, h:mm:ss a') : "-"}</td>
                                    )
                                },
                                '   Actions': (item) => {
                                    return (
                                        <td className="text-center">
                                            <CLink to={{ pathname: `/view/${this.props.match.params.archive_type}/${this.props.match.params.archive_year}/${this.props.match.params.archive_month}/${item.file_id}` }}>
                                                <CTooltip content={`View`} placement={`top`}>
                                                    <FontAwesomeIcon style={{ color: "#3c4b64", marginRight: "25px" }} icon={faEye} />
                                                </CTooltip>
                                            </CLink>


                                            <CLink to={{ pathname: `/update/${this.props.match.params.archive_type}/${this.props.match.params.archive_year}/${this.props.match.params.archive_month}/${item.file_id}` }}>
                                                <CTooltip content={`Update`} placement={`top`}>
                                                    <FontAwesomeIcon style={{ color: "#3c4b64" }} icon={faEdit} />
                                                </CTooltip>
                                            </CLink>

                                            <CLink onClick={() => this.postDelete(item.file_id)}>
                                                <CTooltip content={`Delete`} placement={`top`}>
                                                    <FontAwesomeIcon style={{ color: "#3c4b64", marginLeft: "25px" }} icon={faTrash} />
                                                </CTooltip>
                                            </CLink>
                                        </td>
                                    )
                                }
                            }}
                        />
                    </CCardBody>
                </CCard>
            </>
        )
    }
}

export default File;