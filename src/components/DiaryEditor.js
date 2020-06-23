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
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
    AlignBlockCenterButton,
    AlignBlockLeftButton,
    AlignBlockDefaultButton,
    AlignBlockRightButton,
} from 'draft-js-buttons';
import ImageAdd from './ImageAdd';


const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const emojiPlugin = createEmojiPlugin({ useNativeArt: true });
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const imagePlugin = createImagePlugin();
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
    state = {

    }

    handleChange = (editorState) => {
        console.log(editorState.toJS())
        const inlineStyles = this.picker.exporter(editorState);
        const html = stateToHTML(editorState.getCurrentContent(), { inlineStyles });
        console.log(html)

        this.props.onChange(editorState, html);
    }

    handleImage = (url)=>{
        imagePlugin.addImage(this.props.editorState, url);
        this.props.addImage(url);
    }

    picker = colorPickerPlugin(this.props.onChange, () => this.props.editorState);

    render() {
        //blockquote 태그, code 태그 style 바꿀것

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
                                <Separator {...externalProps} />
                                <HeadlineOneButton {...externalProps} />
                                <HeadlineTwoButton {...externalProps} />
                                <HeadlineThreeButton {...externalProps} />
                                <UnorderedListButton {...externalProps} />
                                <OrderedListButton {...externalProps} />
                                <BlockquoteButton {...externalProps} />
                                <CodeBlockButton {...externalProps} />
                                <Separator {...externalProps} />
                                <AlignBlockCenterButton {...externalProps} />
                                <AlignBlockLeftButton {...externalProps} />
                                <AlignBlockDefaultButton {...externalProps} />
                                <AlignBlockRightButton {...externalProps} />
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
                    />
                    <AlignmentTool />
                </div>
            </div>
        );
    }
}

export default DiaryEditor;