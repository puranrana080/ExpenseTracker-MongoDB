




document.getElementById('rzp-button').onclick = async function (e) {
    e.preventDefault()

    try{
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: { "Authorization": token } })

    console.log(">>>>>>>>>>>>", response)

    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {

            await axios.post("http://localhost:3000/purchase/updatetransactionstatus",
                {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                },
                { headers: { "Authorization": token } })

            alert("You are premium User Now")

            window.location.href='/expense'

        }
    }
    const rzp1 = new Razorpay(options)

    rzp1.open()

    rzp1.on('payment-failed', async function (response) {
        console.log("Payment Failed", response)

        try{

        await axios.post('http://localhost:3000/purchase/failedtransactionstatus',
            {
                order_id: options.order_id,
            }, { headers: { "Authorization": token } }
        )

        alert("Payment Failed! Something went wrong")
    }
    catch(error){
        console.error("Failed to log failed payment:", error);
    }
    })
}
catch(error){
console.log("Failed, error")
}

}




function handleAddExpense(event) {
    event.preventDefault()

    const expense = {
        amount: event.target.amount.value,
        description: event.target.description.value,
        category: event.target.category.value
    }
    const token = localStorage.getItem('token')
    axios.post("http://localhost:3000/expense/add-expense", expense, { headers: { "Authorization": token } })
        .then(response => {

            console.log("RESPONSE IS HERE",response.data)
            displayExpenseOnScreen(response.data.expenseData)
            event.target.reset()
            window.location.href='/expense'


        })

        .catch(err => {
            console.log(err)
        })


}

async function updatePremiumStatus() {
    try {
        const token = localStorage.getItem('token')

        const userResponse = await axios.get('http://localhost:3000/user/ispremium', { headers: { "Authorization": token } })
        if (userResponse.data.isPremiumUser) {
            const premiumBtn = document.getElementById('rzp-button');
            premiumBtn.textContent = 'Premium User';
            const puser = document.createElement('p')
            puser.textContent = "You are Premium user"

            premiumBtn.replaceWith(puser)

            const leaderboardBtn = document.createElement('input')
            leaderboardBtn.type = 'button'
            leaderboardBtn.id = 'leaderboardBtn'
            leaderboardBtn.value = 'Show Leaderboard'

            const body = document.querySelector('body')
            const reference = document.getElementById('expenselist')

            body.insertBefore(leaderboardBtn, reference)
            showLeaderBoard()

        }
    }
    catch (error) {
        console.error("Error updating premium", error)
    }

}


function showLeaderBoard() {
    const leaderboardButton = document.getElementById('leaderboardBtn')

    leaderboardButton.onclick = async () => {
        try {
            const token = localStorage.getItem('token')
            const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showleaderboard', { headers: { "Authorization": token } })
            console.log(userLeaderBoardArray)

            var leaderBoardEle = document.getElementById('leaderboard')
            leaderBoardEle.innerHTML = '<h1>Leaderboard</h1>'

            userLeaderBoardArray.data.forEach((userDetails) => {
                leaderBoardEle.innerHTML += `<li> Name-${userDetails.name}--Total Expense ${userDetails.totalAmount}     </li>`

            })
        }
        catch (err) {
            console.error("Error fetching leaderboard", err)
        }
    }
}


window.addEventListener("DOMContentLoaded", async () => {

    await updatePremiumStatus()
    const token = localStorage.getItem('token')
    try {
       
const ElePerPage=document.getElementById('itemsPerPage')
if(ElePerPage){
    ElePerPage.value=getItemsPerPage()
    getExpenses(1);
}
        const downloadlistresponse = await axios.get('http://localhost:3000/user/downloadlist', { headers: { "Authorization": token } })

        console.log(downloadlistresponse.data)
        if (downloadlistresponse.data.userDownloads){
            document.getElementById('downloadlist').innerHTML=''

            downloadlistresponse.data.userDownloads.forEach((list, i) => {
                displayDownloadList(list, i)
            })

        }

        
        const downloadButton = document.getElementById('downloadexpense');
        downloadButton.addEventListener('click', download);
    }
    catch (err) {
        console.log("Error fetching data", err)
    }




})

function setItemsPerPage() {
    const itemsPerPage = document.getElementById('itemsPerPage').value;
    localStorage.setItem('itemsPerPage', itemsPerPage);
    getExpenses(1);  // Refresh expenses on change
}

function getItemsPerPage() {
    return localStorage.getItem('itemsPerPage') || 10;  
}



//pagination
function getExpenses(page){
    const token=localStorage.getItem('token')
    const itemsPerPage=getItemsPerPage()
    axios.get(`http://localhost:3000/expense/get-expense?page=${page}&limit=${itemsPerPage}`,{
        headers:{"Authorization":token}
    })
    .then(({data:{expenses,...pageData}})=>{
        document.getElementById('expense-list').innerHTML = ''
        expenses.forEach(expense => displayExpenseOnScreen(expense))
        showPagination(pageData)
    })
    .catch((err)=>{
        console.log(err)
    })

} 

function showPagination({currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}){
    const pagination=document.getElementById('pagination')
    pagination.innerHTML=''

    if(hasPreviousPage){
        const btn2=document.createElement('button')
        btn2.innerHTML=previousPage
        btn2.addEventListener('click',()=>{
            getExpenses(previousPage)
        })
        pagination.appendChild(btn2)
    }

    const btn1=document.createElement('button')
    btn1.innerHTML=`<h3>${currentPage}</h3>`
    btn1.addEventListener('click',()=>{
        getExpenses(currentPage)
    })
    pagination.appendChild(btn1)

    if(hasNextPage){
        const btn3=document.createElement('button')
        btn3.innerHTML=nextPage
        btn3.addEventListener('click',()=>{
            getExpenses(nextPage)
        })
        pagination.appendChild(btn3)
    }
    if (currentPage !== lastPage) {
        const lastPageBtn = document.createElement('button');
        lastPageBtn.innerHTML = `Last (${lastPage})`;
        lastPageBtn.addEventListener('click', () => {
            getExpenses(lastPage);
        });
        pagination.appendChild(lastPageBtn);
    }

}





// pagination
function displayDownloadList(downloadList, i) {
    const olList = document.getElementById('downloadlist')

    const fileList = document.createElement('li')
    fileList.appendChild(document.createTextNode(`File ${i + 1}:-  ${downloadList.fileDownloadedURL}  `))
    olList.appendChild(fileList)
}

function displayExpenseOnScreen(expense) {
    const list = document.querySelector('ul')


    const newList = document.createElement('p')
    newList.appendChild(document.createTextNode(`${expense.amount}    ${expense.description}    ${expense.category}  `))
    list.appendChild(newList)

    const delBtn = document.createElement('button')
    delBtn.appendChild(document.createTextNode("Delete Expense"))
    newList.appendChild(delBtn)



    delBtn.addEventListener("click", () => {
        const token = localStorage.getItem('token')

        axios.delete(`http://localhost:3000/expense/delete-expense/${expense._id}`, { headers: { "Authorization": token } })
            .then(result => {
                console.log("Expense Deleted")
                list.removeChild(newList)
                showLeaderBoard()
            })
            .catch(err => {
                console.log(err)
            })
    })



}


function download() {
    const token = localStorage.getItem('token')
    axios.get('http://localhost:3000/user/download', { headers: { "Authorization": token } })
        .then((response) => {
            if (response.status === 200) {
                // the backend will send download link, and when we open it in browser,
                // file gets downloaded
                const a = document.createElement("a");
                a.href = response.data.fileURL;
                a.download = 'myexpense.csv';
                document.body.appendChild(a)
                a.click();
                document.body.removeChild(a)
                const newFile = {
                    filedownloadedURL: response.data.fileURL
                };

                const downloadlist = document.getElementById('downloadlist');
                displayDownloadList(newFile, downloadlist.childElementCount)

            } else {
                throw new Error("Invalid response")
            }
            

        })
        .catch((err) => {
            if(err.response.data.message){
                alert("No files to download")
            }else{

            alert("Buy Premium to Download File", err)}
            
        });
}