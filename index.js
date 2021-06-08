'use-strict';

class SimpleUpload extends HTMLElement {
    static get observedAtrributes() {
        return [ "accept", "multiple", "action", "token" ];
    }
    
    constructor() {
        super();
        
        this.attachShadow({mode: 'open'});
        let wrapper = document.createElement('div');
        wrapper.setAttribute("style", "display: none;");
        
        this.shadowTop = wrapper;
        this.shadowRoot.append(wrapper);        
    }

    connectedCallback() {
        let fileElem = document.createElement("input");
        fileElem.type = "file";
        let accept = this.getAttribute("accept");
        let multiple = this.getAttribute("multiple");
        if (accept !== undefined)
            fileElem.accept = accept;
        if (multiple == "true")
            fileElem.multiple = "multiple";
        fileElem.display = "none";
        this.shadowTop.appendChild(fileElem);
        this.fileElem = fileElem;
        let obj = this;
        fileElem.addEventListener("change", function() { obj.handleFiles() }, false);
    }

    handleFiles() {
        let fileElem = this.fileElem;
        if (fileElem.files.length > 0) {
            let formData = new FormData();
            let info = [];
            for (let index = 0; index < fileElem.files.length; index++) {
                let file = fileElem.files[index];
                let key = "file" + index;
                formData.append(key, file);
                let infoElem = {
                    "key": key,
                    "name": file.name,
                    "size": file.size,
                    "fileType": file.type,
                };
                info.push(infoElem);
            };
            this.event("uploadStarted", info);

            let url = this.getAttribute("url");
            let token = this.getAttribute("token");
            let headers = {};
            if (token) {
                headers["Authorization"] = "Bearer " + token;
            };
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData
            }).then(response => {
                if (response.ok) {
                    this.event("uploadOK", response.json());
                }  else {
                    let msg =
                        { status: response.status,
                          text: response.statusText
                        };
                    this.event("uploadError", msg);
                }
            })
            .catch(error => {
                let msg =
                    { status: 999,
                      text: error.message
                    };
                this.event("uploadError", msg);
                console.error(msg);
            })
        }
    }

    event(name, payload) {
        let wrapper = this.shadowTop;
        wrapper.dispatchEvent(new CustomEvent(name, {
            bubbles: true,
            composed: true,
            detail: payload
        }))
    }
    
    invoke() {
        this.fileElem.click();
    }
}

customElements.define("simple-upload", SimpleUpload);
