import React, { useEffect } from 'react'
import SecInputScores from './SecInputScores'

function SecComputeScores({ scores, setScores, prevStep, nextStep, data }) {

    useEffect(() => {
        console.log(data)
    }, [data]);
    return (
        <div className='computeResult'>

            <h1>Enter Student Scores</h1>
            <div className='computeResult_header'>
                <h4>Student Name: {data?.firstname} {data?.lastname}</h4>
                <h4>Session:  {`${data?.year - 1}/${data?.year}`}</h4>
                <h4>Term: {data?.term}</h4>
                <h4>Class: {data?.class}</h4>
            </div>
            <table className="table table-bordered" id="dataTable" width="80%" cellSpacing="0">
                <thead >
                    <tr >
                        <th>Subject</th>
                        <th>1st C.A</th>
                        <th>2nd C.A</th>
                        <th>total C.A</th>
                        <th>Exam</th>
                        <th>Total</th>
                        <th>Grade</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {scores?.map((score, i) => <SecInputScores
                        key={i}
                        i={i}
                        score={score}
                        scores={scores}
                        setScores={setScores}
                    />
                    )}
                </tbody>
            </table>

            <button onClick={nextStep} className='btn btn-primary btn-block'>Next</button>
        </div>
    )
}

export default SecComputeScores

