<template>
  <div
    class="monaco_editor_container"
    :style="{style}"
  />
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
function noop () { }

export {monaco};

export default {
    name: 'IntMonaco',
    props: {
        diffEditor: {type: Boolean, default: false},
        width: {type: [String, Number], default: '100%'},
        height: {type: [String, Number], default: '100%'},
        original: {type: String, default: ''},
        value: {type: String, default: ''},
        language: {type: String, default: 'javascript'},
        theme: {type: String, default: 'vs'},
        options: {type: Object, default () {
            return {};
        }},
        editorMounted: {type: Function, default: noop},
        editorBeforeMount: {type: Function, default: noop}
    },

    computed: {
        style () {
            return {
                width: !/^\d+$/.test(this.width) ? this.width : `${this.width}px`,
                height: !/^\d+$/.test(this.height) ? this.height : `${this.height}px`
            };
        }
    },

    watch: {
        options: {
            deep: true,
            handler (options) {
                this.editor && this.editor.updateOptions(options);
            }
        },

        value () {
            this.editor && this.value !== this.getValue() && this.setValue(this.value);
        },

        language () {
            if (!this.editor) return;
            if (this.diffEditor) {
                const {original, modified} = this.editor.getModel();
                monaco.editor.setModelLanguage(original, this.language);
                monaco.editor.setModelLanguage(modified, this.language);
            } else {
                monaco.editor.setModelLanguage(this.editor.getModel(), this.language);
            }
        },

        theme () {
            this.editor && monaco.editor.setTheme(this.theme);
        },

        style () {
            this.editor && this.$nextTick(() => {
                this.editor.layout();
            });
        }
    },

    mounted () {
        this.initMonaco();
    },

    beforeDestroy () {
        this.editor && this.editor.dispose();
    },

    methods: {
        initMonaco () {
            const {value, language, theme, options} = this;
            Object.assign(options, this._editorBeforeMount());
            this.editor = monaco.editor[this.diffEditor ? 'createDiffEditor' : 'create'](this.$el, {
                value: value,
                language: language,
                theme: theme,
                ...options
            });
            // https://stackoverflow.com/questions/51395393/how-to-trigger-paste-event-manually-in-javascript
            // https://github.com/microsoft/monaco-editor/issues/1674
            // this.editor.addAction({
            //     id: 'myPaste',
            //     label: 'Paste',
            //     keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_V],
            //     contextMenuGroupId: '9_cutcopypaste',
            //     run: (editor) => {
            //         alert('Add your custom pasting code here');
            //     }
            // });
            this.diffEditor && this._setModel(this.value, this.original);
            this._editorMounted(this.editor);
        },

        _getEditor () {
            if (!this.editor) return null;
            return this.diffEditor ? this.editor.modifiedEditor : this.editor;
        },

        _setModel (value, original) {
            const {language} = this;
            const originalModel = monaco.editor.createModel(original, language);
            const modifiedModel = monaco.editor.createModel(value, language);
            this.editor.setModel({
                original: originalModel,
                modified: modifiedModel
            });
        },

        setValue (value) {
            let editor = this._getEditor();
            if (editor) return editor.setValue(value);
            return null;
        },

        getValue () {
            let editor = this._getEditor();
            if (!editor) return '';
            return editor.getValue();
        },

        layout () {
            this.editor.layout();
        },

        _editorBeforeMount () {
            const options = this.editorBeforeMount(monaco);
            return options || {};
        },

        _editorMounted (editor) {
            this.editorMounted(editor, monaco);
            if (this.diffEditor) {
                editor.onDidUpdateDiff((event) => {
                    const value = this.getValue();
                    this._emitChange(value, event);
                });
            } else {
                editor.onDidChangeModelContent((event) => {
                    const value = this.getValue();
                    this._emitChange(value, event);
                });
            }
        },

        _emitChange (value, event) {
            this.$emit('change', value, event);
            this.$emit('input', value);
        }
    }
};
</script>

<style>
  /* monaco doesn't work without this*/
  .monaco_editor_container {
    position:absolute; left:0; top:0;
    width:100%; height:100%; max-height:100% !important;
    margin:0; padding:0;
    overflow:hidden;
  }
</style>
