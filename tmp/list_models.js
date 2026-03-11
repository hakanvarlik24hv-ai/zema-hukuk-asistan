const apiKey = "AIzaSyBmBWTon6_dk8PUS-ZmFQyk2rdb2qr5AL4";

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
        if (data.models) {
            console.log(data.models.map(m => m.name).join(', '));
        } else {
            console.log(data);
        }
    })
    .catch(console.error);
