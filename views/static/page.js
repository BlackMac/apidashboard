var sandboxCode = {
    html:"",
    script:""
}
var save = null
const changeIndicator = document.getElementById("editor-js-change-indicator")

function update(mode, value) {
    changeIndicator.style['color']="#aaaaaa";
    if (save) window.clearTimeout(save);
    if (mode === "javascript") sandboxCode.script = value;
    if (mode === "html") sandboxCode.html = value;
    save = window.setTimeout(() => {
        $.post( "/save", sandboxCode, ( data ) => {
            changeIndicator.style['color']="transparent";
            document.getElementById('preview').contentWindow.location.reload();
        });
        save = null;
    }, 800)
}

function setupEditor(id, mode, changeIndicator) {
    let editor = ace.edit(id);
    editor.setTheme("ace/theme/monokai");
    let session = editor.getSession();
    session.setMode("ace/mode/"+mode);
    session.on("changeAnnotation", function() {
        var annotations = session.getAnnotations()||[], i = len = annotations.length;
        while (i--) {
            if(/doctype first\. Expected/.test(annotations[i].text) ||
            /Missing semicolon/.test(annotations[i].text)) {
            annotations.splice(i, 1);
            }
        }
        if(len>annotations.length) {
            session.setAnnotations(annotations);
        }
    });
    session.on("changeAnnotation", (change) => {
        let annotations = editor.getSession().getAnnotations();
        let err = false;
        annotations.forEach((annotation) => {
            if (annotation.type === "error") err = true;
        });
        if (!err) {
            let text = session.getDocument().getValue()
            update(mode, text);
        }
        
    })
}
    
setupEditor("editor-js", "javascript");
setupEditor("editor-html", "html");
