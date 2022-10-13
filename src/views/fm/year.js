import React, { Component } from "react"
import { api } from './api'
import {
    CCard,
    CCardHeader,
    CCardBody,
    CRow,
    CCol,
    CDataTable,
    CButton,
    CLink,
    CBreadcrumb,
    CBreadcrumbItem,
    CTooltip
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faArrowLeft, faPlus, faHome } from '@fortawesome/free-solid-svg-icons'

const fields = [
    { key: ' ' },
    { key: 'name' },
    { key: 'type' }
]

class Year extends Component {

    constructor(props) {
        super(props)
        this.state = {
            year_folders: []
        }
    }

    setArchiveYear(archive_year) {
        window.location.href = `http://localhost:3000/#/month/${this.props.match.params.archive_type}/${archive_year}`
    }

    getData(archive_type) {
        api.get(`/view-year-folders?archive_type=${archive_type}`)
            .then(res => {
                this.setState({
                    year_folders: res.data.year_folders
                })
            })
    }

    componentDidMount() {
        this.getData(this.props.match.params.archive_type)
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
                                    <FontAwesomeIcon icon={faFolder} /> {this.props.match.params.archive_type}
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
                            <CCol className="text-left">
                                <CLink to={{ pathname: "/fm" }}>
                                    <CTooltip content={`Back`} placement={`right`}>
                                        <CButton style={{ backgroundColor: "#3c4b64", color: "white" }}><FontAwesomeIcon icon={faArrowLeft} /></CButton>
                                    </CTooltip>
                                </CLink>
                            </CCol>
                            <CCol className="text-right">
                                <CLink to={{ pathname: `/create/${this.props.match.params.archive_type}` }}>
                                    <CTooltip content={`Create Archive`} placement={`left`}>
                                        <CButton style={{ backgroundColor: "#3c4b64", color: "white" }}><FontAwesomeIcon icon={faPlus} /></CButton>
                                    </CTooltip>
                                </CLink>
                            </CCol>
                        </CRow>
                        <br />
                        <CDataTable
                            items={this.state.year_folders}
                            fields={fields}
                            itemsPerPageSelect
                            striped
                            hover
                            onRowClick={(e) => this.setArchiveYear(e)}
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
                                        <td><FontAwesomeIcon icon={faFolder} />  {item}</td>
                                    )
                                },
                                'type': () => {
                                    return (
                                        <td>File folder</td>
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

export default Year;