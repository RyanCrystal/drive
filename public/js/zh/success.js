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
            document.getElementById('msg').innerHTML = '您已經成功將鏈接複製到剪切板!'
        }

    } catch (err) {
        console.log('Oops, unable to copy');
    }
});