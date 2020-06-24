import React, { Component } from 'react';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin';
import 'draft-js/dist/Draft.css';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import ColorPicker, { colorPickerPlugin } from 'draft-js-color-picker';
import { stateToHTML } from 'draft-js-export-html';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import 'draft-js-alignment-plugin/lib/plugin.css';
import createFocusPlugin from 'draft-js-focus-plugin';
import 'draft-js-focus-plugin/lib/plugin.css';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
} from 'draft-js-buttons';
import ImageAdd from './ImageAdd';
import './diaryEditor.css';
import { EditorState } from 'draft-js';

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const emojiPlugin = createEmojiPlugin({ useNativeArt: true });
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
    resizeablePlugin.decorator,
    alignmentPlugin.decorator,
    focusPlugin.decorator,
    blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });

const plugins = [toolbarPlugin, emojiPlugin, imagePlugin,
    blockDndPlugin, focusPlugin, alignmentPlugin, resizeablePlugin];

const presetColors = [
    '#ff00aa',
    '#F5A623',
    '#F8E71C',
    '#8B572A',
    '#7ED321',
    '#417505',
    '#BD10E0',
    '#9013FE',
    '#4A90E2',
    '#50E3C2',
    '#B8E986',
    '#000000',
    '#4A4A4A',
    '#9B9B9B',
    '#FFFFFF',
];

class DiaryEditor extends Component {

    handleChange = (editorState) => {
        console.log(editorState.toJS())
        let inlineStyles = this.picker.exporter(editorState);
        console.log(inlineStyles)
        let newOptions = {
            inlineStyles,
            blockStyleFn: (block) => {
                const blockType = block.get('type').toLowerCase();
                if (blockType === 'blockquote')
                    return {
                        element: 'blockquote',
                        attributes: {
                            className: 'diary-blockquote'
                        },
                    };

            },
            entityStyleFn: (entity) => {
                const entityType = entity.get('type').toLowerCase();
                if (entityType === 'image') {
                    const data = entity.getData();

                    let styleElement = {
                        margin: '20px',
                    };

                    if (data.alignment === 'center')
                        styleElement = {
                            display: 'block',
                            margin: '20px auto'
                        }
                    else if (data.alignment)
                        styleElement = {
                            float: data.alignment,
                            margin: '20px'
                        }

                    styleElement['width'] = data.width ? data.width + '%' : '40%';

                    return {
                        element: 'img',
                        attributes: {
                            src: data.src,
                        },
                        style: {
                            ...styleElement
                        },
                    };
                }
            },

        }
        const html = stateToHTML(editorState.getCurrentContent(), newOptions);
        console.log(html)
        this.props.onChange(editorState, html);
    }

    handleImage = (url) => {
        this.handleChange(imagePlugin.addImage(this.props.editorState, url));
        this.props.addImage(url);
    }

    picker = colorPickerPlugin(this.props.onChange, () => this.props.editorState);

    myBlockStyleFn = (contentBlock) => {
        const type = contentBlock.getType();
        switch (type) {
            case 'blockquote':
                return 'diary-blockquote';
            case 'code':
                return 'diary-code';
            case 'atomic':
                return 'diary-editor-image-container';
        }
    }

    render() {
        return (
            <div className="DiaryEditor">
                <Toolbar>
                    {
                        // may be use React.Fragment instead of div to improve perfomance after React 16
                        (externalProps) => (
                            <div>
                                <BoldButton {...externalProps} />
                                <ItalicButton {...externalProps} />
                                <UnderlineButton {...externalProps} />
                                <CodeButton {...externalProps} />
                                <Separator {...externalProps} />
                                <HeadlineOneButton {...externalProps} />
                                <HeadlineTwoButton {...externalProps} />
                                <HeadlineThreeButton {...externalProps} />
                                <UnorderedListButton {...externalProps} />
                                <OrderedListButton {...externalProps} />
                                <BlockquoteButton {...externalProps} />
                                <CodeBlockButton {...externalProps} />
                                <Separator {...externalProps} />
                                <div className='diary-editor-color-picker-container'>
                                    <ColorPicker
                                        toggleColor={color => this.picker.addColor(color)}
                                        presetColors={presetColors}
                                        color={this.picker.currentColor(this.props.editorState) || 'black'}
                                    />
                                </div>
                                <EmojiSuggestions />
                                <EmojiSelect />
                                <ImageAdd
                                    editorState={this.props.editorState}
                                    onChange={this.handleChange}
                                    modifier={this.handleImage}
                                />
                            </div>
                        )
                    }
                </Toolbar>

                <div className="diary-editor-container">
                    <Editor editorState={this.props.editorState}
                        onChange={this.handleChange}
                        plugins={plugins}
                        customStyleFn={this.picker.customStyleFn}
                        blockStyleFn={this.myBlockStyleFn}
                    />
                    <AlignmentTool />
                    <div className='diary-editor-blank'></div>
                </div>
            </div>
        );
    }
}

export default DiaryEditor;