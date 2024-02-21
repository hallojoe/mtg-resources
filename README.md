# mtg-resources

MTG data and images.

Requires `curl` on target system. Find lates curl releases [here](https://curl.se/docs/releases.html).

Install: `npm install`

To gather data from a set run: `node ./scripts/index.js [set-code, ex. mom, bro or mh2]`

Project structure:

 - data
   - [set-code]
     - data
       - index.json
       - index.min.json
      - images
        - [multiverseid]-[set-code]-[name-slug].png
 - scripts
   - index.js [set-code]
 
