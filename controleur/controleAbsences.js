import { createAbsence, getAllAbscence, getAbsenceById, getAbsencesByTeacher, updateAbsence, deleteAbsence, nombreAbsences, getStudentAbsences } from "../services/servicesAbsences.js";
import { getStudentById } from "../services/servicesStudents.js";


const creationAbsence = async (req, res) => {

    const { student_id, status } = req.body;

    const abscences = await createAbsence(student_id, status);

    if (abscences.changes === 0) {
        return res.status(404).json({ error: "une erreur est survenu au moment de l'enregistrement de l'absence" });

    };


    return res.status(201).json({ student_id, data, status });

};



const seachAbsence = async (req, res) => {

    const afficher = await getAllAbscence();
    return res.status(200).json(afficher);
};



const seachAbsenceId = async (req, res) => {

    const id = Number(req.params.id);

    const seach = await getAbsenceById(id);

    if (!seach) {
        return res.status(404).json({ error: `Aucune absence correspond a cet ${id}` });

    };

    return res.status(200).json(seach);

};


const absencesParProf = async (req, res) => {
    const teacher_id = Number(req.params.teacher_id);
    return res.status(200).json(await getAbsencesByTeacher(teacher_id));
};



const modifAbsence = async (req, res) => {

    const id = Number(req.params.id);
    const data = req.body;
    console.log(data);
    
    const uptdate = await updateAbsence(id, data);

    if (uptdate.changes === 0) {
        return res.status(404).json({ error: "Modification de l'absence impossible" });
    };


    return res.status(200).json({
        id: id,
        student_id: data.student_id,
        status: data.status
    });

};




const supprimeAbsence = async (req, res) => {

    const id = Number(req.params.id);

    const supprime = await deleteAbsence(id);

    if (supprime.changes === 0) {
        return res.status(404).json({ error: "Supression de l'absence impossible" });
    };


    return res.status(200).json(supprime);

};




const compteAbsences = async (req, res) => {

    const student_id = Number(req.params.student_id);


    if (req.user.role === "etudiant") {
        const student = await getStudentById(student_id);
        if (!student || student.user_id !== req.user.id) {
            return res.status(403).json({ error: "Vous ne pouvez consulter que vos propres absences." });
        }
    }



    const nombre = await nombreAbsences(student_id);


    return res.status(200).json(nombre);
};



const afficherAbsencesByStudent = async (req, res) => {

    const student_id = Number(req.params.student_id);

    if (req.user.role === "etudiant") {
        const student = await getStudentById(student_id);
        if (!student || student.user_id !== req.user.id) {
            return res.status(403).json({ error: "Vous ne pouvez consulter que vos propres absences." });
        }
    }


    const nombre = await getStudentAbsences(student_id);

    return res.status(200).json(nombre);
}



export { creationAbsence, seachAbsence, seachAbsenceId, absencesParProf, modifAbsence, compteAbsences, afficherAbsencesByStudent, supprimeAbsence }