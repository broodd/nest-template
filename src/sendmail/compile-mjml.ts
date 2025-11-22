import { basename, resolve, dirname, join } from 'path/posix';
import { writeFile, readFile, readdir } from 'fs/promises';

import mjml2html from 'mjml';

async function transformMjmlTemplatesToHbs() {
  const templatesMjmlDir = join(__dirname, '../../src/sendmail/templates/mjml');
  const files = await readdir(templatesMjmlDir).then((files) =>
    files.filter((file) => file.endsWith('.mjml')),
  );

  const promises = files.map(async (fileName) => {
    const filePath = join(templatesMjmlDir, fileName);
    const newFileName = basename(fileName, '.mjml') + '.hbs';
    const newFilePath = resolve(dirname(templatesMjmlDir), newFileName);

    const mjmlContent = await readFile(filePath, 'utf-8');
    const compiled = mjml2html(mjmlContent, { filePath: templatesMjmlDir, beautify: true });
    await writeFile(newFilePath, compiled.html, 'utf-8');

    console.log(`✅ Compiled: ${newFileName}`);
  });

  await Promise.all(promises);
}

transformMjmlTemplatesToHbs();
