import { addNoteGrade, updateGrades, deleteGrades, affGrades, getStudentGrades, calculMoyenne, meilleurEtudiant } from "../services/servicesGrades.js";
import { getStudentById } from "../services/servicesStudents.js";



const ajoutGrades = async (req, res) => {

    const { student_id, subject_id, note } = req.body;

    const notes = await addNoteGrade(student_id, subject_id, note);


    if (notes.changes === 0) {
        return res.status(404).json({ error: "Une erreur est survenu lors de l'ajout de la note" });
    };


    return res.status(201).json({ student_id, subject_id, note });
};


const modifGrades = async (req, res) => {

    const id = Number(req.params.id);
    const data = req.body;

    const uptdate = await updateGrades(id, data);

    if (uptdate.changes === 0) {
        return res.status(404).json({ error: "La modification de la noe a échoué" });
    };


    return res.status(200).json({
        id: id,
        student_id: data.student_id,
        subject_id: data.subject_id,
        note: data.note
    });

};



const seachGrades = async (req, res) => {

    const afficher = await affGrades();

    return res.status(200).json(afficher);
};


const seachGradesStudent = async (req, res) => {

    const studentId = Number(req.params.studentId);
    const subjectId = Number(req.params.subjectId);


    if (req.user.role === "etudiant") {

        const student = await getStudentById(studentId);

        if (!student || student.user_id !== req.user.id) {
            return res.status(403).json({ error: "Vous ne pouvez consulter que vos propres notes." });
        };
    };


    const afficher = await getStudentGrades(studentId, subjectId);

    if (afficher.length === 0) {
        return res.status(404).json({ error: "Les note de cet étudiant son introuvable" });
    };


    return res.status(200).json(afficher);

};



const gradesParProf = async (req, res) => {
    const teacher_id = Number(req.params.teacher_id);
    return res.status(200).json(await getGradesByTeacher(teacher_id));
};




const moyenneStudent = async (req, res) => {

    const studentId = Number(req.params.studentId);
    const subjectId = Number(req.params.subjectId);


    if (req.user.role === "etudiant") {
        const student = await getStudentById(studentId);
        if (!student || student.user_id !== req.user.id) {
            return res.status(403).json({ error: "Vous ne pouvez consulter que vos propres notes." });
        }
    }



    const afficher = await calculMoyenne(studentId, subjectId);

    if (afficher === 0) {
        return res.status(404).json({ error: "Les note de cet étudiant sont introuvables, la moyenne ne peut pas etre calculé" });
    };


    return res.status(200).json(afficher);

};



const supprimeGrades = async (req, res) => {

    const id = Number(req.params.id);

    const supprime = await deleteGrades(id);

    if (supprime.changes === 0) {
        return res.status(404).json({ error: "Supression de l'absence impossible" });
    };


    return res.status(200).json(supprime);

};

export { ajoutGrades, modifGrades, seachGrades, seachGradesStudent, gradesParProf, moyenneStudent, supprimeGrades };