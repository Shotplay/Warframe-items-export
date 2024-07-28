Require:
 - `Node.js`

Optional require:
  - `Typescript`

Install:
 - In your directory `git clone https://github.com/Shotplay/Warframe-items-CSV.git`
 - `cd Warframe-items-CSV`
 - `npm i`

Usage:
 - Open file generate.ts for Typescript or generate.js for JavaScript
 - At the very bottom of the file, change the arguments of the generateCSV function to the code locales of your language(s)
 - Run generate.ts or generate.js

Avaible Languages:
 https://warframe.fandom.com/wiki/Languages

Additional Items:
 The public warframe export doesn't include all the data you'd like, such as relays, so you can add them yourself.

 To do this:
  - Create a json file in the AdditionalData folder
  - View the example in the TemplateAdditionalJSON file
  - Add the data you want
  - Done

P.S. It already contains two files with relay names in Russian and English.

Types:
If you are using `Typescript`, there is a file for you in the @types folder describing all data types
