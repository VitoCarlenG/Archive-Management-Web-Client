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
import { faFolder, faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons'

const fields = [
    { key: ' ' },
    { key: 'name' },
    { key: 'type' }
]

class Month extends Component {

    constructor(props) {
        super(props)
        this.state = {
            month_folders: []
        }
    }

    setArchiveMonth(archive_month) {
        window.location.href = `http://localhost:3000/#/file/${this.props.match.params.archive_type}/${this.props.match.params.archive_year}/${archive_month}`
    }

    getData(archive_type, archive_year) {
        api.get(`/view-month-folders?archive_type=${archive_type}&archive_year=${archive_year}`)
            .then(res => {
                this.setState({
                    month_folders: res.data.month_folders
                })
            })
    }

    componentDidMount() {
        this.getData(this.props.match.params.archive_type, this.props.match.params.archive_year)
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

                            <CBreadcrumbItem active>
                                <CLink style={{ color: "#3c4b64", pointerEvents: "none", opacity: "0.5" }}>
                                    <FontAwesomeIcon icon={faFolder} /> {this.props.match.params.archive_year}
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
                                <CLink to={{ pathname: `/year/${this.props.match.params.archive_type}` }}>
                                    <CTooltip content={`Back`} placement={`right`}>
                                        <CButton style={{ backgroundColor: "#3c4b64", color: "white" }}><FontAwesomeIcon icon={faArrowLeft} /></CButton>
                                    </CTooltip>
                                </CLink>
                            </CCol>
                        </CRow>
                        <br />
                        <CDataTable
                            items={this.state.month_folders}
                            fields={fields}
                            itemsPerPageSelect
                            striped
                            hover
                            onRowClick={(e) => this.setArchiveMonth(e)}
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

export default Month;