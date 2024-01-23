import React, { useState, useEffect, useRef } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import Pusher from "pusher-js";
import pushid from "pushid";
import axios from "axios";

import "./App.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";

function App() {
  const [id, setId] = useState("");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");

  const iframeRef = useRef(null);

  useEffect(() => {
    setId(pushid());

    const pusher = new Pusher("9b387ef6c7edfb8f29b8", {
      cluster: "eu",
      forceTLS: true,
    });

    const channel = pusher.subscribe("editor");

    channel.bind("text-update", (data) => {
      if (data.id === id) return;

      setHtml(data.html);
      setCss(data.css);
      setJs(data.js);
    });

    return () => {
      channel.unbind("text-update");
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
  };

  const htmlCodeMirrorRef = useRef(null);
  const cssCodeMirrorRef = useRef(null);
  const jsCodeMirrorRef = useRef(null);

  const editorWillUnmount = (editor, codeMirror) => {
    const wrapper = codeMirror.getWrapperElement();
    wrapper.parentNode.removeChild(wrapper);
  };

  return (
    <div className="App">
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
            editorWillUnmount={(editor) => editorWillUnmount(editor, htmlCodeMirrorRef.current)}
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
            editorWillUnmount={(editor) => editorWillUnmount(editor, cssCodeMirrorRef.current)}
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
            editorWillUnmount={(editor) => editorWillUnmount(editor, jsCodeMirrorRef.current)}
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

export default App;
