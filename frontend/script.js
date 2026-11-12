async function getip(url,options={},button,message){
    button.disabled = true;
    message.textContent = "Loading...";
    try{
        const response = await fetch(url,options);
        const data = await response.json();
        if(response.status === 429){
            let sec=Number(response.headers.get("Retry-After"))||60;
            cooldown(sec,button,message);
            return null;
        }
        if(!response.ok){
            alert("Error: "+data.message);
            return null;
        }
        button.disabled = false;
        message.textContent = "Success!";
        return data;
        
    }catch(error){
        button.disabled = false;
        message.textContent = error.message;
        return null;
    }
}
function cooldown(sec,button,message){
    button.disabled = true;
    const interval = setInterval(()=>{
        message.textContent = `Please wait ${sec} seconds...`;
        sec--;
        if(sec<0){
            clearInterval(interval);
            button.disabled = false;
            message.textContent = "You can try again.";
        }
    },1000);
}
function showLogin(){
    document.getElementById("login").style.display = "block";
    document.getElementById("register").style.display = "none";
}
function showRegister(){
    document.getElementById("register").style.display = "block";
    document.getElementById("login").style.display = "none";
}
async function login(event){
    if(event) event.preventDefault();
    const username = document.querySelector("#login input[type='text']").value;
    const password = document.querySelector("#login input[type='password']").value;
    const button = document.querySelector("#login button");
    const message = document.querySelector("message");
    const response = awaitgetip("/login",{
         method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        },
        button,
        message
    );
    if(response && response.success){
        alert("Login successful!");
    }
}