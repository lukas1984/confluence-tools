# confluence-tools
Some simple JQuery tools to help navigating through long and complex Confluence pages.

Work in progress!

## Installation

* Install Chrome extension "Custom JavaScript for Websites 2" from:
  https://chromewebstore.google.com/detail/custom-javascript-for-web/ddbjnfjiigjmcpcpkmhogomapikjbjdk
  
* On your Confluence site, open the extension, activate "Enable cjs for this host" and copy-paste this script:

      customjsReady('body', function(element) {
        fetch('https://raw.githubusercontent.com/lukas1984/confluence-tools/main/confluence-toc.js')
          .then((res) => res.text())
          .then((js) => {
            eval(js);
            console.log('Loaded confluence-toc.js')
          })
      });
