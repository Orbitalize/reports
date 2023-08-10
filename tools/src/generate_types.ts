import {promises as fs} from "fs";
import {compileFromFile} from "json-schema-to-typescript";
import * as path from "path";


// TODO: Move constants as program argument.
const inputSchemaFile =
  path.join(__dirname, "../../schemas/uss_qualifier/reports/report/TestRunReport.json");
const inputDir = path.dirname(inputSchemaFile);
const outputPath = path.join(__dirname, "../../reports/src/types/");
const outputType = outputPath + "TestRunReport.d.ts";

const adjustInterfaceNames = (tsContent: string) => {
  let adjusted = tsContent.replace(
    /HttpsGithubComInterussMonitoringBlobMainSchemasMonitoringUssQualifier(.*)Json/g,
    "$1"
  );

  // TODO: Some $ref are breaking typescript compilation. Commenting them until further investigation.
  adjusted = adjusted.replace(/^(\s*)(\$ref)/gm, "$1// $2");
  return adjusted;
};

const main = async () => {
  try {
    const tsContent = await compileFromFile(inputSchemaFile, {cwd: inputDir});
    const adjustedContent = adjustInterfaceNames(tsContent);
    await fs.writeFile(outputType, adjustedContent);
    console.log(`${outputType} generated successfully`);
  } catch (err) {
    console.error(`Unable to generate types from ${inputSchemaFile}: ${err}`);
  }
};
main();
