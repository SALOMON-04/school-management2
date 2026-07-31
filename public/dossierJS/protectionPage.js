const protegePages = (utilisateur) => {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if(!token || role !== utilisateur){
        window.location.href = "../public/dossierhtml/index.html"
    }
};

export default protegePages ;