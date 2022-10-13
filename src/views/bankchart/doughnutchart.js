import React, { Component } from "react";
import {
    CCard,
    CCardBody,
    CCardGroup,
    CCardHeader,
    CButton,
    CRow,
    CCol
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

class Doughnut extends Component {
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
                                Penyimpanan
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CChartDoughnut
                            datasets={[
                                {
                                    backgroundColor: [
                                        '#41B883',
                                        '#E46651',
                                        '#00D8FF'
                                    ],
                                    data: [300, 150, 250]
                                }
                            ]}
                            labels={['Tabungan', 'Giro', 'Deposito']}
                            options={{
                                tooltips: {
                                    enabled: true
                                }
                            }}
                        />
                    </CCardBody>
                </CCard>
            </>
        )
    }
}

export default Doughnut