### **Require:**
 - `Node.js`

### **Install:**
 - In your directory `git clone https://github.com/Shotplay/Warframe-items-export.git#build`
 - `cd Warframe-items-export`
 - `npm install --omit=dev`

### **Usage:**
 - Open file run.js
 - Change the arguments of the generateData function to the code locales of your language(s)
 - Run `node run.js`

P.S. In case the data is not found, it will be marked as "undefined"

### **Avaible Languages:**
 https://warframe.fandom.com/wiki/Languages

### **Additional Items:**
The public warframe export doesn't include all the data you'd like, such as relays, so you can add them yourself.

 To do this:
  - Create a json file of type `Data_langCode.json` in the AdditionalData folder
  - View the example in the TemplateAdditionalJSON file
  - Add the data you want
  - Done

P.S. It already contains few files with some names in Russian and English
