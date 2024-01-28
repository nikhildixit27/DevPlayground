import React, { useState, useEffect, useRef } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import Pusher from "pusher-js";
import pushid from "pushid";
import axios from "axios";
// import Header from './components/Header';

// import "./App.css";

import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";

function Playground() {
    const [id, setId] = useState("");
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [js, setJs] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    const iframeRef = useRef(null);

    useEffect(() => {
        setId(pushid());
    }, []);

    useEffect(() => {
        const pusher = new Pusher("9b387ef6c7edfb8f29b8", {
            cluster: "eu",
            forceTLS: true,
        });

        const channel = pusher.subscribe("editor");

        const handleTextUpdate = (data) => {
            if (data.id === id) return;

            setHtml(data.html);
            setCss(data.css);
            setJs(data.js);
        };

        channel.bind("text-update", handleTextUpdate);

        return () => {
            channel.unbind("text-update", handleTextUpdate);
            pusher.unsubscribe("editor");
        };
    }, [id]);

    useEffect(() => {
        runCode();
    }, [html, css, js]);

    const syncUpdates = () => {
        const data = { id, html, css, js };

        axios.post("http://localhost:5000/update-editor", data).catch(console.error);
    };

    const runCode = () => {
        const document = iframeRef.current.contentDocument;
        const documentContents = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}

        <script type="text/javascript">
          ${js}
        </script>
      </body>
      </html>
    `;

        document.open();
        document.write(documentContents);
        document.close();
    };

    const codeMirrorOptions = {
        theme: "material",
        lineNumbers: true,
        scrollbarStyle: null,
        lineWrapping: true,
        lint: true,
    };

    const htmlCodeMirrorRef = useRef(null);
    const cssCodeMirrorRef = useRef(null);
    const jsCodeMirrorRef = useRef(null);

    const editorWillUnmount = (editor, codeMirror) => {
        // Check if codeMirror is defined before trying to call setValue
        if (codeMirror && codeMirror.current) {
            codeMirror.current.setValue('');
        }
    };

    return (
        <div className={`App ${showPreview ? 'show-preview' : ''}`}>
            {/* <Header togglePreview={() => setShowPreview((prev) => !prev)} showPreview={showPreview} /> */}
            <section className="playground">
                <div className="code-editor html-code">
                    <div className="editor-header">HTML</div>
                    <CodeMirror
                        value={html}
                        options={{
                            mode: "htmlmixed",
                            ...codeMirrorOptions
                        }}
                        onBeforeChange={(editor, data, html) => {
                            setHtml(html);
                            syncUpdates();
                        }}

                        editorWillUnmount={(editor, codeMirror) => editorWillUnmount(editor, codeMirror)}
                        ref={htmlCodeMirrorRef}
                    />
                </div>
                <div className="code-editor css-code">
                    <div className="editor-header">CSS</div>
                    <CodeMirror
                        value={css}
                        options={{
                            mode: "css",
                            ...codeMirrorOptions
                        }}
                        onBeforeChange={(editor, data, css) => {
                            setCss(css);
                            syncUpdates();
                        }}
                        editorWillUnmount={(editor, codeMirror) => editorWillUnmount(editor, codeMirror)}
                        ref={cssCodeMirrorRef}
                    />
                </div>
                <div className="code-editor js-code">
                    <div className="editor-header">JavaScript</div>
                    <CodeMirror
                        value={js}
                        options={{
                            mode: "javascript",
                            ...codeMirrorOptions
                        }}
                        onBeforeChange={(editor, data, js) => {
                            setJs(js);
                            syncUpdates();
                        }}
                        editorWillUnmount={(editor, codeMirror) => editorWillUnmount(editor, codeMirror)}
                        ref={jsCodeMirrorRef}
                    />
                </div>
            </section>
            <section className="result">
                <iframe title="result" className="iframe" ref={iframeRef} />
            </section>
        </div>
    );
}

export default Playground