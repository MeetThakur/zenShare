
fetch("http://localhost:3000/getText")
    .then(response => response.text())
    .then(data => {
        console.log(data);
    });