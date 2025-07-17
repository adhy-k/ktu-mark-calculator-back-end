const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

function calculateGrade(mark) {
    if (mark >= 90) return "S"
    else if (mark >= 80) return "A+"
    else if (mark >= 70) return "A"
    else if (mark >= 60) return "B+"
    else if (mark >= 50) return "B"
    else if (mark >= 45) return "C"
    else if (mark >= 40) return "P"
    else return "F"
}

function gradeToGPA(grade) {
    const map = {
        "S": 10,
        "A+": 9,
        "A": 8.5,
        "B+": 8,
        "B": 7,
        "C": 6,
        "P": 5,
        "F": 0
    }
    return map[grade]
}

app.post("/calculate", (request, response) => {
    const name = (request.body.name)
    const regno = (request.body.regno)
    const clgname = (request.body.clgname)
    const subName1 = (request.body.subName1)
    const subName2 = (request.body.subName2)
    const subName3 = (request.body.subName3)
    const email = (request.body.email)
    const subIntMark1 = Math.min(parseInt(request.body.subIntMark1),40)
    const subIntMark2 = Math.min(parseInt(request.body.subIntMark2),40)
    const subIntMark3 = Math.min(parseInt(request.body.subIntMark3),40)
    const subSemMark1 = Math.min(parseInt(request.body.subSemMark1),60)
    const subSemMark2 = Math.min(parseInt(request.body.subSemMark2),60)
    const subSemMark3 = Math.min(parseInt(request.body.subSemMark3),60)
    const mark1 = (subIntMark1 + subSemMark1)
    const mark2 = (subIntMark2 + subSemMark2)
    const mark3 = (subIntMark3 + subSemMark3)
    const total = (mark1 + mark2 + mark3)

    const grade1 = calculateGrade(mark1)
    const grade2 = calculateGrade(mark2)
    const grade3 = calculateGrade(mark3)

    const gpa1 = gradeToGPA(grade1)
    const gpa2 = gradeToGPA(grade2)
    const gpa3 = gradeToGPA(grade3)

    let cgpa
    if (grade1 === "F" || grade2 === "F" || grade3 === "F") {
        cgpa = "Fail"
    } else {
        cgpa = ((gpa1 + gpa2 + gpa3) / 3).toFixed(2)
    }

    response.json({
        name,
        regno,
        email,
        clgname,
        subjects: [
            { name: subName1, internal: subIntMark1, semester: subSemMark1, total: mark1, grade: grade1 },
            { name: subName2, internal: subIntMark2, semester: subSemMark2, total: mark2, grade: grade2 },
            { name: subName3, internal: subIntMark3, semester: subSemMark3, total: mark3, grade: grade3 }
        ],
        total,
        cgpa
    })
})

app.listen(4000, () => { console.log("Server up") })