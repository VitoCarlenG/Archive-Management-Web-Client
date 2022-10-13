import React, { Component } from "react";
import {
    CCard,
    CCardBody,
    CCardGroup,
    CCardHeader,
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

const totalDpk = [
    {
        year: [
            2022,
            2021,
            2020,
            2019
        ],
        backgroundColor: [
            '#41B883',
            '#E46651',
            '#00D8FF',
            '#DD1B16'
        ],
        data: [
            2000,
            1000,
            3000,
            4000,
        ]
    }
]

class Piechart extends Component {
    render() {
        return (
            <>
                <CCard>
                    <br />
                    <CCardHeader>
                        <CRow>
                            <CCol md="4"></CCol>
                            <CCol md="8" className="text-right">
                                Tahun
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CChartPie
                            datasets={totalDpk}
                            labels={totalDpk[0].year}
                            options={{
                                tooltips: {
                                    enabled: true
                                },
                                onClick: (e) => {
                                    window.location.href = `http://localhost:3000/#/barchart?penyimpanan=2000`
                                }
                            }}
                        />
                    </CCardBody>
                </CCard>
            </>
        )
    }
}

export default Piechart