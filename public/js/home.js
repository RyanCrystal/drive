async function saveFile(inp) {
    let formData = new FormData();
    let file = inp.files[0];

    formData.append("file", file);

    const ctrl = new AbortController()    // timeout
    setTimeout(() => ctrl.abort(), 5000);

    try {
        let r = await fetch('/upload',
            { method: "POST", body: formData, signal: ctrl.signal });
        console.log('HTTP response code:', r.status);
    } catch (e) {
        console.log('Huston we have problem...:', e);
    }

}
