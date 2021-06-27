function triggerUpload() {
    document.getElementById('file-input').click();
}
async function saveFile(inp) {
    // let formData = new FormData();
    let file = inp.files[0];
    if (file) {
        document.getElementById('upload-button').classList.remove('disabled');
        document.querySelector('.filename').innerHTML = 'File: <i>' + file.name + '</i>';
    }

    console.log(file);

    // formData.append("file", file);

    // const ctrl = new AbortController()    // timeout
    // setTimeout(() => ctrl.abort(), 5000);

    // try {
    //     let r = await fetch('/upload',
    //         { method: "POST", body: formData, signal: ctrl.signal });
    //     console.log('HTTP response code:', r.status);
    // } catch (e) {
    //     console.log('Huston we have problem...:', e);
    // }

}

document.querySelector('#upload-button').addEventListener('click', function () {
    // user has not chosen any file
    if (document.querySelector('#file-input').files.length == 0) {
        alert('Error : No file selected');
        return;
    }

    // first file that was chosen
    let file = document.querySelector('#file-input').files[0];

    document.querySelector('.progress-container').classList.remove('hide');
    document.getElementById('upload-button').disabled = true;

    let data = new FormData();

    // file selected by the user
    // in case of multiple files append each of them
    data.append('file', document.getElementById('file-input').files[0]);

    let request = new XMLHttpRequest();
    request.open('POST', '/upload');

    // upload progress event
    request.upload.addEventListener('progress', function (e) {
        let percent_complete = (e.loaded / e.total) * 100;
        var elem = document.getElementById("myBar");

        elem.style.width = percent_complete + "%";
        document.getElementById("percent").innerHTML = Math.trunc(percent_complete) + "%";

        if (percent_complete == 100) {
            document.getElementById('success').innerHTML = '<div>Wait a moment, we are creating the link...';
        }

        // percentage of upload completed
        // console.log(percent_complete);
    });

    // AJAX request finished event
    request.addEventListener('load', function (e) {
        // HTTP status message
        // console.log(request.status);

        // request.response will hold the response from the server
        // console.log(request.response);
        document.getElementById('success').innerHTML = request.response;
        copy();
        document.querySelector('.filename').innerHTML = '';
        document.querySelector('.upload-container').innerHTML = '';
    });

    // send POST request to server side script
    request.send(data);

    // upload file now
});

function copy() {
    var copyTextareaBtn = document.getElementById('copy');

    copyTextareaBtn.addEventListener('click', function (event) {
        var copyTextarea = document.querySelector('.shared-link');
        copyTextarea.focus();
        copyTextarea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
            if (successful) {
                document.getElementById('msg').innerHTML = 'You have successfully copied the link to your clipboard!'
            }

        } catch (err) {
            console.log('Oops, unable to copy');
        }
    });
}



