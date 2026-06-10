# Project Name

This project allows NJ residents to look up their PAS-1 property tax relief status.

## Table of Contents

1. [Architecture](#architecture)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Contributing](#contributing)
5. [License](#license)
6. [Contact](#contact)
7. [Acknowledgements](#acknowledgements)

## Architecture

This monorepo involves a NextJS frontend (/webapp), a AWS Lambda function API Backend (/lambda), and
a AWS CDK Infrastructure As Code (/infra) packages.

### Built With

- [AWS CDK](link-to-framework)
- [Tool Name](link-to-tool)
- [Database Name](link-to-database)

## Installation

Provide step-by-step guidance on how to install your project. This could include dependencies,
environment setup, etc.

```bash
# Clone this repository
git clone https://github.com/newjersey/tax-relief-status-checker

# Go into the repository
cd tax-relief-status-checker

# Install dependencies
npm install
```

## Usage

Running the web app locally

```bash
npm run dev
```

Building the lambda locally

```bash
npm run package
```

Deploying resources using CDK

```bash
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY
export AWS_SESSION_TOKEN
npm run deploy:dev
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and
create. Any contributions you make are greatly appreciated.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT license. For more information, see [LICENSE](LICENSE).

## Contact

If you want to get in touch with the Office of Innovation team, please email us at
[team@innovation.nj.gov](mailto:team@innovation.nj.gov).

### Join the Office of Innovation!

If you are excited to design and deliver modern policies and services to improve the lives of all
New Jerseyans, you should
[join the New Jersey State Office of Innovation](https://innovation.nj.gov/join.html)!

## Disclaimer

This project utilizes certain tools and technologies for development purposes. The inclusion of
these tools does not imply endorsement or recommendation. Users are encouraged to evaluate the
suitability of these tools for their own use.
