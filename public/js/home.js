// async function saveFile(inp) {
//     let formData = new FormData();
//     let file = inp.files[0];
//     if (file) {
//         document.getElementById('upload-btn').disabled = false;

//     }

//     formData.append("file", file);

//     const ctrl = new AbortController()    // timeout
//     setTimeout(() => ctrl.abort(), 5000);

//     try {
//         let r = await fetch('/upload',
//             { method: "POST", body: formData, signal: ctrl.signal });
//         console.log('HTTP response code:', r.status);
//     } catch (e) {
//         console.log('Huston we have problem...:', e);
//     }

// }

document.querySelector('#upload-button').addEventListener('click', function () {
    // user has not chosen any file
    if (document.querySelector('#file-input').files.length == 0) {
        alert('Error : No file selected');
        return;
    }

    // first file that was chosen
    let file = document.querySelector('#file-input').files[0];

    // allowed types
    // let allowed_mime_types = ['image/jpeg', 'image/png'];

    // // allowed max size in MB
    // let allowed_size_mb = 2;

    // // validate file type
    // if (allowed_mime_types.indexOf(file.type) == -1) {
    //     alert('Error : Incorrect file type');
    //     return;
    // }

    // // validate file size
    // if (file.size > allowed_size_mb * 1024 * 1024) {
    //     alert('Error : Exceeded size');
    //     return;
    // }

    // // validation is successful
    // alert('You have chosen the file ' + file.name);


    let data = new FormData();

    // file selected by the user
    // in case of multiple files append each of them
    data.append('file', document.querySelector('#file-input').files[0]);

    let request = new XMLHttpRequest();
    request.open('POST', '/upload');

    // upload progress event
    request.upload.addEventListener('progress', function (e) {
        let percent_complete = (e.loaded / e.total) * 100;

        // percentage of upload completed
        console.log(percent_complete);
    });

    // AJAX request finished event
    request.addEventListener('load', function (e) {
        // HTTP status message
        console.log(request.status);

        // request.response will hold the response from the server
        console.log(request.response);
    });

    // send POST request to server side script
    request.send(data);

    // upload file now
});



