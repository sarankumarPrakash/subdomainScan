const readline = require('readline');


const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout 
});

// Function to get subdomains from crt.sh
async function getSubdomainsFromCT(domain) {
    const url = `https://crt.sh/?q=${domain}`; 
    try {
        // Fetch the data from the CRT.sh API
        const response = await fetch(url);
        //   console.log(response);
        const text = await response.text();
       
        // Extract subdomains from the text
       
        
        const subdomains = text.match(/<TD>([a-zA-Z0-9.-]+)\<\/TD>/g).map((subdomain) => {
            return subdomain.replace(/<\/?TD>/g, "");
        });

        let filteredArray = [
            ...new Set(
                subdomains.filter(
                (item, index, self) =>
                  item !== domain &&
                  !item.startsWith('www') &&
                  self.indexOf(item) === index
              )
            )
          ];
          
          if (filteredArray.length > 0) {
            console.log(`Found ${filteredArray.length} subdomains:`);
            filteredArray.forEach((subdomain, index) => {
                
                console.log(`${index + 1}. ${subdomain}`);
            });
        } else {
            console.log("No subdomains found.");
        }

        return filteredArray;

    } catch (error) {
        console.error("Error fetching subdomains:", error);
        return [];
    }
}
// Tool for user input
function getUserInput() {

    console.log(`
        ____  _   _ ____ ____   ____    _    _   _ 
       / ___|| | | | __ ) ___| / ___|  / \\  | \\ | |
       \\___ \\| | | |  _ \\___ \\| |     / _ \\ |  \\| |
        ___) | |_| | |_) |__) | |___ / ___ \\| |\\  |
       |____/ \\___/|____/____/ \\____/_/   \\_\\_| \\_|
                                                    
             
             # Coded By sarankumar Prakash
             # Scan - A Subdomain Extractor Tool
      `);
      



    rl.question('Please enter a domain (e.g., example.com): ', (domain) => {
        if (domain) {
            getSubdomainsFromCT(domain).then(subdomains => {
                rl.close(); 
            });
        } else {
            console.log("Domain input is required.");
            rl.close(); 
        }
    });
}

// Run the tool
getUserInput();
