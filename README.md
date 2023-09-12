# Reports

This repository contains a template for [interuss/monitoring/uss_qualifier](https://github.com/interuss/monitoring/blob/main/monitoring/uss_qualifier) reports.

The report must be bundled as a single file to include all dependencies and allow users to download and open it on their machine without experiencing [CORS issues](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp) without requiring starting a local server..

See [reports](./reports) for getting started.


## Release

To release a new version of the report, create a new tag by creating a new release on this [page](https://github.com/Orbitalize/reports/releases).
This will trigger the [release workflow](./.github/workflows/release.yaml)  which will generate a single file bundle of the report application and publish it as a zip.

The zip file can then be used as an report template in the [interuss/monitoring](https://github.com/interuss/monitoring/blob/main/monitoring/uss_qualifier/configurations/configuration.py#L49) report configuration. See [U-Space test suite](https://github.com/interuss/monitoring/blob/main/monitoring/uss_qualifier/configurations/dev/uspace.yaml#L32) as example.

