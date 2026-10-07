document.addEventListener("DOMContentLoaded", () => {

    fetch("../components/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
        })
        .catch(error => {
            console.error("Header error:", error);
        });


    fetch("../components/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        })
        .catch(error => {
            console.error("Footer error:", error);
        });

});
