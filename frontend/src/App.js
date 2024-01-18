import React, { useState, useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import Pusher from "pusher-js";
import pushid from "pushid";
import axios from "axios";

import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/css/css.js";
import "codemirror/mode/javascript/javascript.js";

import "./App.css";

function App() {
  const [id, setId] = useState(pushid());
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [output, setOutput] = useState("");

  const runCode = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
  };

  const codeMirrorOptions = {
    theme: "material",
    lineNumbers: true,
    scrollbarStyle: null,
    lineWrapping: true,
  };

  const syncUpdates = () => {
    const data = { id, html, css, js };
    axios.post("http://localhost:5000/update-editor", data).catch(console.error);
  };

  useEffect(() => {
    const pusher = new Pusher("9b387ef6c7edfb8f29b8", {
      cluster: "ap2",
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
      pusher.unsubscribe("editor");
    };
  }, [id]);

  return (
    <div className="App">
      <section className="playground">
        <div className="code-editor html-code">
          <div className="editor-header">HTML</div>
          <CodeMirror
            value={html}
            options={{
              mode: "htmlmixed",
              ...codeMirrorOptions,
            }}
            onBeforeChange={(editor, data, value) => {
              setHtml(value);
              syncUpdates();
            }}
          />
        </div>

        <div className="code-editor css-code">
          <div className="editor-header">CSS</div>
          <CodeMirror
            value={css}
            options={{
              mode: "css",
              ...codeMirrorOptions,
            }}
            onBeforeChange={(editor, data, value) => {
              setCss(value);
              syncUpdates();
            }}
          />
        </div>

        <div className="code-editor js-code">
          <div className="editor-header">JavaScript</div>
          <CodeMirror
            value={js}
            options={{
              mode: "javascript",
              ...codeMirrorOptions,
            }}
            onBeforeChange={(editor, data, value) => {
              setJs(value);
              syncUpdates();
            }}
          />
        </div>
      </section>

      <section className="result">
        <iframe title="result" className="iframe" srcDoc={output} />
      </section>
    </div>
  );
}

export default App;
