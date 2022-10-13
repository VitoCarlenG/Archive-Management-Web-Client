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
    CSelect,
    CRow,
    CLink,
    CBreadcrumb,
    CBreadcrumbItem,
    CTooltip
} from '@coreui/react'
import Dropzone from 'react-dropzone'
import swal from 'sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faHome, faFolder, faEdit } from '@fortawesome/free-solid-svg-icons'

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const regexArchive = /Archive/i
const regexSpecialCharacters = /-/

class Update extends Component {

    constructor(props) {
        super(props);
        this.onDrop = (file) => {
            this.setState({ file })
        };
        this.state = {
            archives: [],
            files: [],
            file: [],
            file_id: "",
            file_name: "",
            file_description: "",
            file_path: "",
            archive_type: "",
            input_file_name: "",
            input_file_path: "",
            input_archive_type: "",
            bak_file_name: "",
            bak_file_path: "",
            data_url: ""
        };
    }

    APICheck = (e, file_id) => {
        e.preventDefault();

        swal({
            title: "Are You Sure?",
            text: "You Want To Update This Archive?",
            buttons: ["No", "Yes"],
            icon: "warning",
            dangerMode: true,
        })
            .then(willUpdate => {
                if (willUpdate) {
                    this.updateAPI(e, file_id)
                }
            });
    }

    updateAPI = async (e, file_id) => {
        e.preventDefault()

        if (this.state.file_description.charAt(0) === " ") {
            swal("Attention!", "Forbidden Archive Description", "error");
        } else if (this.state.file_description.length > 64) {
            swal("Attention!", "Maximum Length For Archive Description's 64 Letters", "error");
        } else if (this.state.file.length === 0) {
            swal("Attention!", "Please Upload The Archive File", "error");
        } else {
            if (this.state.file_name !== this.state.bak_file_name) {
                const checkFileName = this.state.files.filter(f => f.file_name.toLowerCase() === this.state.file_name.toLowerCase())

                if (this.state.file_name.charAt(0) === " ") {
                    swal("Attention!", "Forbidden Archive Name", "error");
                } else if (this.state.file_name.length > 32) {
                    swal("Attention!", "Maximum Length For Archive Name's 32 Letters", "error");
                } else if (checkFileName.length > 0) {
                    swal("Attention!", "Archive Name Must Be Unique", "error");
                } else {
                    api.get(`/get-archive-type?archive_id=${this.state.archive_type}`)
                        .then(async res => {
                            this.setState({
                                input_archive_type: res.data.archive_type[0].archive_type
                            })

                            const separator = this.state.input_file_path.split("/")
                            const separator2 = separator[separator.length - 1].split("-")

                            var file_path = `src/upload/${this.state.input_archive_type}/${separator[3]}/${separator[4]}/${separator2[0]}-${separator2[1]}-${separator2[2]}-${separator2[3]}-${this.state.file[0].name}`

                            if (file_path !== this.state.bak_file_path) {
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
                                    api.post("/delete-file", {
                                        file_id: file_id
                                    })

                                    var base64 = await this.getBase64(this.state.file[0])

                                    this.setState({ file_path: base64 })

                                    api.put('/update-file', {
                                        file_name: this.state.file_name,
                                        file_description: this.state.file_description,
                                        file_path: this.state.file_path,
                                        archive_type: this.state.input_archive_type,
                                        file: this.state.file[0].name,
                                        input_file_path: file_path,
                                        file_id: file_id
                                    })
                                        .then(async res => {
                                            await swal("Attention!", res.data.message, "success")
                                            window.location.href = `http://localhost:3000/#/file/${this.props.match.params.archive_type}/${this.props.match.params.archive_year}/${this.props.match.params.archive_month}`
                                        })
                                }
                            } else {
                                api.post("/delete-file", {
                                    file_id: file_id
                                })

                                var base64 = await this.getBase64(this.state.file[0])

                                this.setState({ file_path: base64 })

                                api.put('/update-file', {
                                    file_name: this.state.file_name,
                                    file_description: this.state.file_description,
                                    file_path: this.state.file_path,
                                    archive_type: this.state.input_archive_type,
                                    file: this.state.file[0].name,
                                    input_file_path: file_path,
                                    file_id: file_id
                                })
                                    .then(async res => {
                                        await swal("Attention!", res.data.message, "success")
                                        window.location.href = `http://localhost:3000/#/file/${this.props.match.params.archive_type}/${this.props.match.params.archive_year}/${this.props.match.params.archive_month}`
                                    })
                            }
                        })
                }
            } else {
                api.get(`/get-archive-type?archive_id=${this.state.archive_type}`)
                    .then(async res => {
                        this.setState({
                            input_archive_type: res.data.archive_type[0].archive_type
                        })

                        const separator = this.state.input_file_path.split("/")
                        const separator2 = separator[separator.length - 1].split("-")

                        var file_path = `src/upload/${this.state.input_archive_type}/${separator[3]}/${separator[4]}/${separator2[0]}-${separator2[1]}-${separator2[2]}-${separator2[3]}-${this.state.file[0].name}`

                        if (file_path !== this.state.bak_file_path) {
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
                                api.post("/delete-file", {
                                    file_id: file_id
                                })

                                var base64 = await this.getBase64(this.state.file[0])

                                this.setState({ file_path: base64 })

                                api.put('/update-file', {
                                    file_name: this.state.file_name,
                                    file_description: this.state.file_description,
                                    file_path: this.state.file_path,
                                    archive_type: this.state.input_archive_type,
                                    file: this.state.file[0].name,
                                    input_file_path: file_path,
                                    file_id: file_id
                                })
                                    .then(async res => {
                                        await swal("Attention!", res.data.message, "success")
                                        window.location.href = `http://localhost:3000/#/file/${this.props.match.params.archive_type}/${this.props.match.params.archive_year}/${this.props.match.params.archive_month}`
                                    })
                            }
                        } else {
                            api.post("/delete-file", {
                                file_id: file_id
                            })

                            var base64 = await this.getBase64(this.state.file[0])

                            this.setState({ file_path: base64 })

                            api.put('/update-file', {
                                file_name: this.state.file_name,
                                file_description: this.state.file_description,
                                file_path: this.state.file_path,
                                archive_type: this.state.input_archive_type,
                                file: this.state.file[0].name,
                                input_file_path: file_path,
                                file_id: file_id
                            })
                                .then(async res => {
                                    await swal("Attention!", res.data.message, "success")
                                    window.location.href = `http://localhost:3000/#/file/${this.props.match.params.archive_type}/${this.props.match.params.archive_year}/${this.props.match.params.archive_month}`
                                })
                        }
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
            .then(async res => {
                this.setState({
                    file_id: res.data.file[0].file_id,
                    file_name: res.data.file[0].file_name,
                    file_description: res.data.file[0].file_description,
                    input_file_path: res.data.file[0].file_path,
                    archive_type: res.data.file[0].archive_type,
                    bak_file_name: res.data.file[0].file_name,
                    bak_file_path: res.data.file[0].file_path
                })

                await api.post('/retrieve-file', {
                    file_id: this.state.file_id
                })
                    .then(res => {
                        this.setState({ data_url: res.data.file })
                    })

                await api.post('/get-file-name', {
                    file_id: this.state.file_id
                })
                    .then(res => {
                        this.setState({ input_file_name: res.data.file_name })
                    })

                // var convert = await this.dataURLtoFile(this.state.data_url, this.state.input_file_name)

                // this.setState({ file: convert })
            })
    }

    componentDidMount() {

        api.get(`/get-archives`)
            .then(res => {
                this.setState({
                    archives: res.data.archives
                })
            })

        api.get('/get-files')
            .then(res => {
                this.setState({
                    files: res.data.files
                })
            })

        this.getData(this.props.match.params.file_id)
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
                                    <FontAwesomeIcon icon={faEdit} /> Archive - {this.state.file_name}
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
                                <h1><strong>Update Archive</strong></h1>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CForm method="post" onSubmit={(e) => this.APICheck(e, this.state.file_id)}>
                            <CFormGroup>
                                <CLabel htmlFor="archiveName">Archive Name</CLabel>
                                <CInput id="archiveName" type="text" required placeholder="Enter the archive's name" value={this.state.file_name} onChange={(e) => { this.setState({ file_name: e.target.value }) }} />
                            </CFormGroup>
                            <CFormGroup>
                                <CLabel htmlFor="archiveDescription">Archive Description</CLabel>
                                <CTextarea id="archiveDescription" rows="4" cols="50" type="text" placeholder="Enter the archive's description" value={this.state.file_description} onChange={(e) => { this.setState({ file_description: e.target.value }) }} />
                            </CFormGroup>
                            <CFormGroup>
                                <CLabel htmlFor="archiveType">Archive Folder</CLabel>
                                <CSelect id="archiveType" required value={this.state.archive_type} onChange={(e) => { this.setState({ archive_type: e.target.value }) }}>
                                    <option value="" hidden>Select the archive's folder</option>
                                    {
                                        this.state.archives.map((data, idx) => {
                                            return (
                                                <option key={idx} value={data.archive_id}>{data.archive_type}</option>
                                            )
                                        })
                                    }
                                </CSelect>
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
                                                <ul>{file}</ul>
                                            </aside>
                                        </section>
                                    )}
                                </Dropzone>
                            </CFormGroup>
                            <br></br>
                            <CFormGroup>
                                <CButton block style={{ backgroundColor: "#3c4b64", color: "white" }} type="submit">Update</CButton>
                            </CFormGroup>
                        </CForm>
                    </CCardBody>
                </CCard>
            </>
        )
    }
}

export default Update;