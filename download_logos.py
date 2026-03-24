import os

logos = {
    "star-health.png": "https://logokit.net/logo/star-health-and-allied-insurance-company-logo-9541/star-health-and-allied-insurance-company-logo-9541.png",
    "hdfc-ergo.svg": "https://upload.wikimedia.org/wikipedia/commons/4/4e/HDFC_ERGO_General_Insurance_Company.svg",
    "new-india-assurance.svg": "https://upload.wikimedia.org/wikipedia/commons/e/e5/New_India_Assurance.svg",
    "united-india.svg": "https://upload.wikimedia.org/wikipedia/commons/e/e9/United_India_Insurance.svg",
    "national-insurance.png": "https://static.cdnlogo.com/logos/n/51/national-insurance-company_800.png",
    "oriental-insurance.png": "https://www.seeklogo.com/images/O/oriental-insurance-co-logo-2621D5D4E3-seeklogo.com.png"
}

os.makedirs("public/images/insurance", exist_ok=True)

for name, url in logos.items():
    print(f"Downloading {name}...")
    os.system(f'curl -L "{url}" -o "public/images/insurance/{name}"')
