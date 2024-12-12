


const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get('uuid')
document.getElementById('uuid').value = uuid

console.log("UUID", uuid); 

if (uuid) {
    document.getElementById('uuid').value = uuid;
} else {
    console.error('No UUID found in the URL.');
}




function updatePassword(event) {
    event.preventDefault()
    const newPassword = document.getElementById('newPassword').value
    const uuid = document.getElementById('uuid').value

    axios.post("http://localhost:3000/password/updatepassword", {
        uuid: uuid,
        newPassword: newPassword
    })
        .then((response) => {
            console.log(response.data.message)
            window.location.href='/login.html'
        })
        .catch(err => {
            console.log(err)
        })


}
