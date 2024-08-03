import React, { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const CustomTinyMCEEditor = ({ onEditorChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    // Function to handle voice-to-text conversion
    const handleVoiceToText = () => {
      if ('webkitSpeechRecognition' in window) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          console.log('Voice recognition started. Speak into the microphone.');
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (editorRef.current) {
            const editor = editorRef.current;
            editor.execCommand('mceInsertContent', false, transcript);
            onEditorChange(editor.getContent());
          }
        };

        recognition.onerror = (event) => {
          console.error('Error occurred in recognition: ' + event.error);
        };

        recognition.onend = () => {
          console.log('Voice recognition ended.');
        };

        recognition.start();
      } else {
        console.error('Speech recognition not supported in this browser.');
      }
    };

    // Ensure the custom button is added when editor is initialized
    const editor = editorRef.current;
    if (editor) {
      editor.ui.registry.addButton('voiceToText', {
        text: 'Voice to Text',
        onAction: handleVoiceToText,
      });
    }
  }, [onEditorChange]);

  return (
    <Editor
      apiKey='54gnpttiqcpxauq7f5m7e306osmh1v3m08hpezcy2q4fxxx2'
      onInit={(evt, editor) => {
        editorRef.current = editor;
        editor.ui.registry.addButton('voiceToText', {
          text: 'Voice to Text',
          onAction: () => {
            if ('webkitSpeechRecognition' in window) {
              const recognition = new window.webkitSpeechRecognition();
              recognition.continuous = false;
              recognition.interimResults = false;
              recognition.lang = 'en-US';

              recognition.onstart = () => {
                console.log('Voice recognition started. Speak into the microphone.');
              };

              recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (editorRef.current) {
                  const editor = editorRef.current;
                  editor.execCommand('mceInsertContent', false, transcript);
                  onEditorChange(editor.getContent());
                }
              };

              recognition.onerror = (event) => {
                console.error('Error occurred in recognition: ' + event.error);
              };

              recognition.onend = () => {
                console.log('Voice recognition ended.');
              };

              recognition.start();
            } else {
              console.error('Speech recognition not supported in this browser.');
            }
          },
        });
      }}
      initialValue="<p>This is the initial content of the editor.</p>"
      init={{
        height: 250,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | voiceToText',
        setup: (editor) => {
          editor.on('Change', () => {
            onEditorChange(editor.getContent());
          });
        },
      }}
    />
  );
};

export default CustomTinyMCEEditor;
