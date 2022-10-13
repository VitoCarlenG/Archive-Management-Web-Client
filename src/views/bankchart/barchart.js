import React, { Component } from "react";
import {
    CCard,
    CCardBody,
    CCardGroup,
    CCardHeader,
    CLink,
    CRow,
    CCol,
    CButton
} from '@coreui/react'
import {
    CChartBar,
    CChartLine,
    CChartDoughnut,
    CChartRadar,
    CChartPie,
    CChartPolarArea
} from '@coreui/react-chartjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const totalPenyimpanan = [
    {
        cabang: "Renon",
        penyimpanan: 700
    },

    {
        cabang: "Batubulan",
        penyimpanan: 300
    },
    {
        cabang: "Teuku Umar",
        penyimpanan: 400
    },
    {
        cabang: "Gatot Subroto",
        penyimpanan: 600
    }
]

class Barchart extends Component {

    render() {
        return (
            <>
                <CCard>
                    <br />
                    <CCardHeader>
                        <CRow>
                            <CCol md="4">
                                <CButton color="secondary" onClick={(e) => window.history.back(-1)}>
                                    <FontAwesomeIcon icon={faArrowLeft} /> Kembali
                                </CButton>
                            </CCol>
                            <CCol md="8" className="text-right">
                                Cabang
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CChartBar
                            datasets={[
                                {
                                    label: 'Penyimpanan',
                                    backgroundColor: '#f87979',
                                    data: [700, 300, 400, 600].sort()
                                }
                            ]}
                            labels={["Renon", "Batubulan", "Teuku Umar", "Gatot Subroto"]}
                            options={{
                                tooltips: {
                                    enabled: true
                                },
                                onClick: (e) => {
                                    window.location.href = `http://localhost:3000/#/doughnutchart?penyimpanan=700`
                                }
                            }}
                        />
                    </CCardBody>
                </CCard>
            </>
        )
    }
}

export default Barchart