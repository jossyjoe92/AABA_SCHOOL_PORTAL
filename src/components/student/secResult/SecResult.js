import React, { useState, useEffect } from 'react';
import './SecResult.css'
import SecConfirmScores from './SecConfirmScores'
import SecComputeScores from './SecComputeScores';
import { useParams, useHistory } from 'react-router-dom'
import { HOST_URL } from '../../../config'
import { useQuery, usePaginatedQuery } from 'react-query'

const fetchStudentProfile = async (key, id) => {
  const res = await fetch(`${HOST_URL}/api/staff/compute-result/${id}`, {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("jwt")
    }
  })
  return res.json();
}

const SecResult = () => {
  const { id } = useParams()
  const [step, setStep] = useState(1)
  const [studentData, setStudentData] = useState({})
  const [scores, setScores] = useState([])
  const [total, setTotal] = useState(null)
  const [average, setAverage] = useState(null)
  const [grade, setGrade] = useState(null)
  const [scale, setScale] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()

  // React query fecth data
  const { data, status } = useQuery(['StudentProfile', id], fetchStudentProfile)

  useEffect(() => {

    if (!data) return

    if(data.hasResult){

      setTimeout(() => {
        return history.push(`/editsecresult/${id}`)
      }, 500);
   
    }
    const scores = data.subjects?.subjects.map(subject => {
      return {
        subject,
        // assignment: {
        //     first: 0,
        //     second: 0,
        //     total: 0
        //   },
        CA: {
          first: 0,
          second: 0,
          total: 0
        },
        exam: 0,
        total: 0,
        grade: '',
        remark: '',
        subjectPosition: '',
        classAverage: ''

      }
    })
    const result = {
      Id: data.student?._id,
      firstname: data.student?.firstname,
      lastname: data.student?.lastname,
      year: data.calendar?.year,
      term: data.calendar?.term,
      class: data.student?.stdClass
    }
    setStudentData(result)
    setScores(scores)

  }, [data])


  const nextStep = (e) => {
    e.preventDefault();
    setStep(step => step + 1)
  };

  // Go back to prev step
  const prevStep = (e) => {
    e.preventDefault();
    setStep(step => step - 1)
  };

  const saveResult = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const response = await fetch(`${HOST_URL}/api/staff/student-result`, {
      method: 'post',
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        id: studentData.Id,
        scores,
        total,
        average,
        grade,
        scale,
        year: studentData.year,
        term: studentData.term,
        stdClass: studentData.class

      })
  })

  const data = await response.json()

       if (data.error) {
          setIsLoading(false)
          alert(data.error)
        } else {
          console.log(data)
          setIsLoading(false)
          alert('Result saved Succesfully')
          history.push(`/student/result/${id}`)
        }

  }
  return (step === 1) ? (
    <SecComputeScores
      data={studentData}
      scores={scores}
      setScores={setScores}
      prevStep={prevStep}
      nextStep={nextStep}
    />
  ) :
    <SecConfirmScores
      saveResult={saveResult}
      data={data}
      setData={data}
      scores={scores}
      setScores={setScores}
      total={total}
      setTotal={setTotal}
      average={average}
      setAverage={setAverage}
      grade={grade}
      setGrade={setGrade}
      scale={scale}
      setScale={setScale}
      isLoading={isLoading}
      nextStep={nextStep}
      prevStep={prevStep}
      setStep={setStep}

    />
}

export default SecResult;