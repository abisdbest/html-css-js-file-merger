let files = [];
let numoffiles = 0

function addFile() {
    numoffiles += 1
    const fileInputs = document.getElementById('file-inputs');
    const newFileInput = document.createElement('div');
    newFileInput.classList.add('file-input', 'new-file');

    newFileInput.innerHTML = `
        <input type="text" placeholder="File Name">
        <input type="text" placeholder="File Content">
        <button class="delete-file-button" onclick="deleteFile(this)">Delete File</button>
    `;

    // Append new file input and animate container height
    fileInputs.appendChild(newFileInput);
    
    // Smoothly expand the container height to accommodate the new file
    requestAnimationFrame(() => {
        fileInputs.style.height = `${numoffiles * 69}px`;
        newFileInput.classList.remove('new-file'); // Remove the new-file class for smooth appearance
    });
}

function deleteFile(button) {
    numoffiles -= 1
    if (numoffiles == 0) {
        document.getElementById('file-inputs').innerHTML = ""
    }
    const fileInput = button.parentElement;
    fileInput.classList.add('fade-out'); // Add fade-out effect
    

    // Wait for the fade-out transition, then remove the element and adjust the height
    setTimeout(() => {
        fileInput.remove(); // Remove the file input

        // Get the file inputs container
        const fileInputs = document.getElementById('file-inputs');

        requestAnimationFrame(() => {
            fileInputs.style.height = `${numoffiles * 69}px`;
        });
    }, 300); // Delay should match the fade-out duration
}




function mergeFiles() {
    const fileInputs = document.querySelectorAll('.file-input');
    files = [];
    fileInputs.forEach(input => {
        const filename = input.querySelector('input[type="text"]:nth-of-type(1)').value;
        const filecontent = input.querySelector('input[type="text"]:nth-of-type(2)').value;
        files.push({ filename, filecontent });
    });

    let mergedHtml = '';

    // Find the HTML file
    const htmlFile = files.find(file => file.filename.endsWith('.html'));
    if (!htmlFile) {
        alert('You must have one HTML file.');
        return;
    }
    mergedHtml = htmlFile.filecontent
    // Parse the HTML file content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlFile.filecontent, 'text/html');

    // Process <link> tags, but only inline if it's a CSS file
    const linkTags = doc.querySelectorAll('link[href]');
    linkTags.forEach(link => {
        const href = link.getAttribute('href');
        const cssFile = files.find(file => file.filename === href && href.endsWith('.css')); // Only inline if .css
        if (cssFile) {
            link.remove();
            mergedHtml += `<style>\n${cssFile.filecontent}\n</style>\n`;
        } else {
            mergedHtml += link.outerHTML + '\n';
        }
    });

    // Process <script> tags, but only inline if it's a JS file
    const scriptTags = doc.querySelectorAll('script[src]');
    scriptTags.forEach(script => {
        const src = script.getAttribute('src');
        const jsFile = files.find(file => file.filename === src && src.endsWith('.js')); // Only inline if .js
        if (jsFile) {
            script.remove();
            mergedHtml += `<script>\n${jsFile.filecontent}\n</script>\n`;
        } else {
            mergedHtml += script.outerHTML + '\n';
        }
    });

    // Only add the content inside the <body> tag
    mergedHtml += doc.body.innerHTML;

    document.getElementById('output').value = mergedHtml;
}