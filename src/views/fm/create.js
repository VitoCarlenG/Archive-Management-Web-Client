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
    CTextarea,
    CInput,
    CLabel,
    CRow,
    CLink,
    CTooltip,
    CBreadcrumb,
    CBreadcrumbItem
} from '@coreui/react'
import Dropzone from 'react-dropzone'
import swal from 'sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faHome, faFolder, faPlus } from '@fortawesome/free-solid-svg-icons'

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const regexArchive = /Archive/i
const regexSpecialCharacters = /-/

class Create extends Component {

    constructor(props) {
        super(props);
        this.onDrop = (file) => {
            this.setState({ file })
        };
        this.state = {
            file: [],
            files: [],
            file_name: "",
            file_description: "",
            file_path: "",
            archive_type: ""
        };
    }

    APICheck = async e => {
        e.preventDefault()

        const checkFileName = this.state.files.filter(f => f.file_name.toLowerCase() === this.state.file_name.toLowerCase())

        if (this.state.file_name.charAt(0) === " ") {
            swal("Attention!", "Forbidden Archive Name", "error");
        } else if (this.state.file_description.charAt(0) === " ") {
            swal("Attention!", "Forbidden Archive Description", "error");
        } else if (this.state.file_name.length > 32) {
            swal("Attention!", "Maximum Length For Archive Name's 32 Letters", "error");
        } else if (this.state.file_description.length > 64) {
            swal("Attention!", "Maximum Length For Archive Description's 64 Letters", "error");
        } else if (checkFileName.length > 0) {
            swal("Attention!", "Archive Name Must Be Unique", "error");
        } else if (this.state.file.length === 0) {
            swal("Attention!", "Please Upload The Archive File", "error");
        } else {
            var today = new Date();
            var cur = `${today.getFullYear()}/${months[today.getMonth()]}`
            var cur2 = `${today.getFullYear()}-${months[today.getMonth()]}-${today.getDate()}`

            var file_path = `src/upload/${this.state.archive_type}/${cur}/Archive-${cur2}-${this.state.file[0].name}`

            const checkFilePath = this.state.files.filter(f => f.file_path.toLowerCase() === file_path.toLowerCase())

            if (this.state.file[0].name.length > 59) {
                swal("Attention!", "Maximum Length For File Name's 59 Letters", "error");
            } else if (regexArchive.test(this.state.file[0].name) || regexSpecialCharacters.test(this.state.file[0].name) || this.state.file[0].name.charAt(0) === " ") {
                swal("Attention!", "Forbidden File Name", "error");
            } else if (checkFilePath.length > 0) {
                swal("Attention!", "Archive Path Must Be Unique", "error");
            } else if (this.state.file[0].size > 209715200) {
                swal("Attention!", "File Size Must Be Lower Than 200MB", "error");
            } else {
                var base64 = await this.getBase64(this.state.file[0])

                this.setState({ file_path: base64 })

                await api.post('/create-file', {
                    file_name: this.state.file_name,
                    file_description: this.state.file_description,
                    file_path: this.state.file_path,
                    archive_type: this.state.archive_type,
                    file: this.state.file[0].name
                })
                    .then(async res => {
                        await swal("Attention!", res.data.message, "success")
                        window.location.href = `http://localhost:3000/#/year/${this.props.match.params.archive_type}`
                    })
            }
        }
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    componentDidMount() {
        api.get('/get-files')
            .then(res => {
                this.setState({
                    files: res.data.files,
                    archive_type: this.props.match.params.archive_type
                })
            })
    }

    render() {
        const file = this.state.file.map(file => (
            <li key={file.name}>
                {file.name} - {file.size} bytes
            </li>
        ));

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
                                    <FontAwesomeIcon icon={faPlus} /> Archive
                                </CLink>
                            </CBreadcrumbItem>
                        </CBreadcrumb>
                        <CRow>
                            <CCol md="8">
                                <CLink to={{ pathname: `/year/${this.props.match.params.archive_type}` }}>
                                    <CTooltip content={`Back`} placement={`right`}>
                                        <CButton style={{ backgroundColor: "#3c4b64", color: "white" }}><FontAwesomeIcon icon={faArrowLeft} /></CButton>
                                    </CTooltip>
                                </CLink>
                            </CCol>

                            <CCol md="4" className="text-right">
                                <h1><strong>Create Archive</strong></h1>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CForm method="post" onSubmit={(e) => this.APICheck(e)}>
                            <CFormGroup>
                                <CLabel htmlFor="archiveName">Archive Name</CLabel>
                                <CInput id="archiveName" type="text" required placeholder="Enter the archive's name" onChange={(e) => { this.setState({ file_name: e.target.value }) }} />
                            </CFormGroup>
                            <CFormGroup>
                                <CLabel htmlFor="archiveDescription">Archive Description</CLabel>
                                <CTextarea id="archiveDescription" rows="4" cols="50" type="text" placeholder="Enter the archive's description" onChange={(e) => { this.setState({ file_description: e.target.value }) }} />
                            </CFormGroup>
                            <br></br>
                            <CFormGroup>
                                <Dropzone onDrop={this.onDrop}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section className="text-center" style={{ border: "dashed #eeeeee", backgroundColor: "#fafafa" }}>
                                            <div {...getRootProps({ className: 'dropzone' })}>
                                                <input {...getInputProps()} />
                                                <br></br>
                                                <br></br>
                                                <p style={{ color: "gray" }}>Drag 'n' drop here or click to select the archive's file</p>
                                                <br></br>
                                            </div>
                                            <aside>
                                                <p>{file}</p>
                                            </aside>
                                        </section>
                                    )}
                                </Dropzone>
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

export default Create;