const http = require('https');
const fs = require('fs');
const path = require('path');

const logos = {
    "star-health.png": "https://logowik.com/pf-img/star-health-and-allied-insurance-company-logo-9575.svg", // Replaced with SVG as it's more reliable
    "hdfc-ergo.svg": "https://upload.wikimedia.org/wikipedia/commons/4/4e/HDFC_ERGO_General_Insurance_Company.svg",
    "new-india-assurance.svg": "https://upload.wikimedia.org/wikipedia/commons/e/e5/New_India_Assurance.svg",
    "united-india.svg": "https://upload.wikimedia.org/wikipedia/commons/e/e9/United_India_Insurance.svg",
    "national-insurance.png": "https://static.cdnlogo.com/logos/n/51/national-insurance-company_800.png",
    "oriental-insurance.png": "https://www.seeklogo.com/images/O/oriental-insurance-co-logo-2621D5D4E3-seeklogo.com.png"
};

const dirPath = path.join(__dirname, 'public', 'images', 'insurance');
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

Object.entries(logos).forEach(([filename, url]) => {
    const file = fs.createWriteStream(path.join(dirPath, filename));
    http.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Success: ${filename}`);
        });
    }).on('error', (err) => {
        fs.unlink(path.join(dirPath, filename), () => {});
        console.error(`Error ${filename}: ${err.message}`);
    });
});
