const result = require("../models/resultModel")
const Student = require("../models/studentDetailsModel");
const createResult = async (req, res) => {
    let id = req.body.student_id
    let subject = Object.entries(req.body.result[0])
    console.log(subject)
    let subjectResult = { subjectName: subject[0][0], marks: subject[0][1] }
    subjectResult.year=req.body.result[0].Year
    subjectResult.slot=req.body.result[0].Slot
    let details = await Student.findOne({ student_id: id })
    let check = await result.findOne({ student_id: id })
    let checkConditon=false;
    if (check) {
        let push = { $push: { result: subjectResult } }
        for (let i = 0; i < check.result.length; i++) {
            if (check.result[i].subjectName == subject[0][0] && check.result[i].slot ==subject[1][1]  && check.result[i].year ==subject[2][1]  ) {
                checkConditon = true
                break;
            }
            else {
                checkConditon = false
            }
        }
        console.log(checkConditon)
        if (checkConditon) {
            let a=await result.findOneAndUpdate(
                {
                    student_id:id,
                    "result.subjectName": subject[0][0]
                },
                {
                    $set: {
                        "result.$.marks": subject[0][1]
                    }
                }

            );
            res.json("updated succefully")
        }
        else {
            const updateResult = await result.updateOne({ student_id: id }, push);
            res.json(updateResult)
        }

    }
    else {
        let obj = {
            Name: details.Name,
            class: details.class,
            section: details.section,
            student_id: id,
            result: subjectResult
        }
        let results = await result.create(obj)
        res.json(results)
    }

}
const getClassResult = async (req, res) => {
    try {
        const { section, cls,slot,year } = req.body;
        let arr=[]
        const details = await result.find({ class: cls, section: section });
        details.map((data,i)=>{
            data.result.map((v)=>{
                console.log(v.slot==slot)
                if(v.slot==slot && v.year==year){
                 arr.push(v)
                }
            })
            details[i].result=arr
            arr=[]
        })
        res.send(details)
    } catch (error) {

    }
}



module.exports = {
    createResult,
    getClassResult
}

