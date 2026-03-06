async function predictRisk(payload){

    try{

        const response = await fetch("/predict",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(payload)
        });

        const data = await response.json();

        document.getElementById("risk").innerText = data.risk;
        document.getElementById("probability").innerText = data.probability;

    }

    catch(error){
        alert("Server error. Try again.");
    }

}


function submitForm(){

    const payload = {

        age: document.getElementById("age").value,
        bp: document.getElementById("bp").value,
        chol: document.getElementById("chol").value,
        heartrate: document.getElementById("heartrate").value,
        bmi: document.getElementById("bmi").value

    };

    predictRisk(payload);

}